import { io, Socket } from 'socket.io-client';
import useAuthStore from '@/stores/authStore';

// Create socket instance
export const socket: Socket = io(
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000',
  {
    autoConnect: false,
    auth: (cb) => {
      cb({ token: useAuthStore.getState().accessToken });
    }
  }
);

// Socket event handlers
socket.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('Socket connected');
});

socket.on('disconnect', () => {
  // eslint-disable-next-line no-console
  console.log('Socket disconnected');
});

socket.on('auth_error', (error) => {
  // eslint-disable-next-line no-console
  console.error('Socket authentication error:', error);
  useAuthStore.getState().reset();
});

socket.on('login-notification', (data) => {
  // eslint-disable-next-line no-console
  console.log('Login notification:', data);
});

// Socket authentication middleware
export function authenticateSocket() {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    socket.auth = { token: accessToken };
    socket.connect();
  }
}

// Socket disconnect utility
export function disconnectSocket() {
  socket.disconnect();
}

export default socket;