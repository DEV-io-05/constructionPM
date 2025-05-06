export type UserRole = 'USER' | 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  name: string;
  accountNo: string;
  role: UserRole[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'password'>;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole[];
  accountNo: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface ResetPasswordWithOTPRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export type AuthHeaders = {
  Authorization: string;
};