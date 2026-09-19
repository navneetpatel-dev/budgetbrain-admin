export type UserRole = 'free' | 'premium' | 'lifetime' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isSuspended?: boolean;
  createdAt: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isSuspended: boolean;
  country: string | null;
  currency: string;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}
