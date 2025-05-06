import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/auth';

interface AuthGuardProps {
  children: ReactNode;
  roles?: UserRole[];
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  roles, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const navigate = useNavigate();
  const { isAuthenticated, hasRole } = useAuth();

  // Check authentication
  if (!isAuthenticated) {
    navigate({
      to: redirectTo,
      search: { 
        returnUrl: window.location.pathname 
      }
    });
    return null;
  }

  // Check roles if specified
  if (roles && !roles.some(role => hasRole(role))) {
    navigate({ to: '/403' });
    return null;
  }

  return <>{children}</>;
}