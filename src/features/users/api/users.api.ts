import { apiGet, apiPatch } from '@/shared/services/api';
import type { UsersResponse, UserDetail } from '../types/users.types';

export async function getUsers(page = 1, limit = 20): Promise<UsersResponse> {
  return apiGet<UsersResponse>(`/admin/users?page=${page}&limit=${limit}`);
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
