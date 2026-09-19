import { login as apiLogin, completeMfaLogin } from '@/shared/services/api';

export async function loginAdmin(email: string, password: string) {
  return apiLogin(email, password);
}

export async function verifyMfaCode(mfaToken: string, code: string) {
  return completeMfaLogin(mfaToken, code);
}
