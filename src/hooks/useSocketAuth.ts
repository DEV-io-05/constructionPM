import { useEffect, useCallback } from 'react';
import { socket } from '@/lib/socket';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useSocketAuth() {
  const { user, logout } = useAuth();

  // Handle device login notifications
  const handleAccountLogin = useCallback((data: { message: string; timestamp: Date }) => {
    toast.warning(data.message, {
      description: 'If this wasn\'t you, please secure your account.',
      action: {
        label: 'Logout',
        onClick: () => logout()
      }
    });
  }, [logout]);

  // Handle user activity events
  const handleUserActivity = useCallback((data: {
    type: 'login' | 'logout';
    user: { email: string; id: string };
    timestamp: Date;
  }) => {
    if (user?.role.includes('ADMIN')) {
      toast.info(`User ${data.user.email} ${data.type === 'login' ? 'logged in' : 'logged out'}`, {
        description: new Date(data.timestamp).toLocaleString()
      });
    }
  }, [user]);

  // Handle connection errors
  const handleError = useCallback((error: Error) => {
    toast.error('Connection error', {
      description: error.message
    });
  }, []);

  // Setup socket event listeners
  useEffect(() => {
    if (!user) return;

    socket.on('account-login', handleAccountLogin);
    socket.on('user-activity', handleUserActivity);
    socket.on('connect_error', handleError);
    socket.on('auth_error', handleError);

    return () => {
      socket.off('account-login', handleAccountLogin);
      socket.off('user-activity', handleUserActivity);
      socket.off('connect_error', handleError);
      socket.off('auth_error', handleError);
    };
  }, [user, handleAccountLogin, handleUserActivity, handleError]);

  // Status management functions
  const updateStatus = useCallback((status: 'online' | 'away' | 'offline') => {
    if (socket.connected) {
      socket.emit('status-change', status);
    }
  }, []);

  const sendChatMessage = useCallback((message: string) => {
    if (socket.connected) {
      socket.emit('chat-message', { message });
    }
  }, []);

  return {
    isConnected: socket.connected,
    updateStatus,
    sendChatMessage
  };
}