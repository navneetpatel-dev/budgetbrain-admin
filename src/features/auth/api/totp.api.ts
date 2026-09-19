import { apiGet, apiPost } from '@/shared/services/api';

export interface EnrollTotpResponse {
  secret: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
}

export async function fetchCurrentUser() {
  return apiGet<{ id: string; email: string; totpEnabled: boolean }>('/auth/me');
}

export async function enrollTotp() {
  return apiPost<EnrollTotpResponse>('/auth/totp/enroll', {});
}

export async function confirmTotp(code: string) {
  return apiPost<{ message: string }>('/auth/totp/confirm', { code });
}
