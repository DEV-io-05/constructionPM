import { createContext, useContext, useEffect, ReactNode } from 'react';
import { socket, authenticateSocket, disconnectSocket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';

interface SocketContextType {
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ isConnected: false });

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { isAuthenticated } = useAuth();

  // Handle socket connection based on authentication state
  useEffect(() => {
    if (isAuthenticated) {
      authenticateSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ isConnected: socket.connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}