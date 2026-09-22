import { apiGet, apiPatch } from '@/shared/api/admin.api';
import type { UsersResponse, UserDetail } from '../types/users.types';

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isSuspended?: boolean | string;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

export async function getUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
  const { page = 1, limit = 20, search, role, isSuspended, sortBy, sortDir } = params;
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));
  if (search && search.trim()) query.set('search', search.trim());
  if (role && role !== 'all') query.set('role', role);
  if (isSuspended !== undefined && isSuspended !== 'all') {
    query.set('isSuspended', String(isSuspended));
  }
  if (sortBy) query.set('sortBy', sortBy);
  if (sortDir) query.set('sortDir', sortDir);
  return apiGet<UsersResponse>(`/admin/users?${query.toString()}`);
}

export async function getUserById(id: string): Promise<UserDetail> {
  return apiGet<UserDetail>(`/admin/users/${id}`);
}

export async function updateUserRole(id: string, role: string): Promise<UserDetail> {
  return apiPatch<UserDetail>(`/admin/users/${id}`, { role });
}

export async function updateUserSuspension(id: string, suspended: boolean): Promise<UserDetail> {
  return apiPatch<UserDetail>(`/admin/users/${id}`, { suspended });
}
