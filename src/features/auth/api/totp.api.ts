import { apiGet, apiPost } from '@/shared/api/admin.api';
import type { AuthUser, ConfirmTotpResponse, EnrollTotpResponse } from '../types/auth.types';

export async function fetchCurrentUser() {
  return apiGet<AuthUser>('/auth/me');
}

export async function enrollTotp() {
  return apiPost<EnrollTotpResponse>('/auth/totp/enroll', {});
}

export async function confirmTotp(code: string) {
  return apiPost<ConfirmTotpResponse>('/auth/totp/confirm', { code });
}
