import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthResponse } from '../types/auth';
import axios from 'axios';
import { socket } from '@/lib/socket';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string>;
  reset: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axios.post<AuthResponse>('/api/auth/login', {
            email,
            password
          });

          const { user, accessToken, refreshToken } = response.data;

          // Update auth state
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false
          });

          // Connect socket with auth
          socket.connect();
          socket.emit('login-notification', { email: user.email });

        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true, error: null });

          await axios.post('/api/auth/register', {
            email,
            password,
            name
          });

          // Auto login after registration
          await get().login(email, password);

        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { refreshToken } = get();
          if (refreshToken) {
            await axios.post('/api/auth/logout', { refreshToken });
          }

          // Disconnect socket
          socket.disconnect();
          
          get().reset();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Logout failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post<{ accessToken: string }>('/api/auth/refresh-token', {
            refreshToken
          });

          const { accessToken } = response.data;
          set({ accessToken });

          return accessToken;
        } catch (error) {
          // If refresh fails, logout user
          get().reset();
          throw error;
        }
      },

      reset: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;
