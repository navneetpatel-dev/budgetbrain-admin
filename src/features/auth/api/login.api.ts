import { login as apiLogin } from '@/shared/services/api';

export async function loginAdmin(email: string, password: string) {
  return apiLogin(email, password);
}
