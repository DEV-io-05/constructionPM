import { useCallback } from 'react';
import useAuthStore from '@/stores/authStore';
import type { UserRole } from '@/types/auth';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshAccessToken
  } = useAuthStore();

  // Check if user has specific role
  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    if (!user?.role) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.some(r => user.role.includes(r));
  }, [user]);

  // Check if user has permission to access specific resource
  const canAccess = useCallback((resourceUserId?: string) => {
    if (!user) return false;
    
    // Admins can access everything
    if (hasRole('ADMIN')) return true;
    
    // Users can only access their own resources
    if (resourceUserId) {
      return user.id === resourceUserId;
    }
    
    return true;
  }, [user, hasRole]);

  // Get initials for avatar
  const getUserInitials = useCallback(() => {
    if (!user?.name) return '??';
    
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshAccessToken,
    hasRole,
    canAccess,
    getUserInitials
  };
}