const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

function getToken() {
  return localStorage.getItem('admin_token');
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message ?? 'Request failed');
  return json.data;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message ?? 'Request failed');
  return json.data;
}

export function setToken(token: string) {
  localStorage.setItem('admin_token', token);
}

export function clearToken() {
  localStorage.removeItem('admin_token');
}

export function isLoggedIn() {
  return !!getToken();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message ?? 'Login failed');

  const userRes = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${json.data.accessToken}` },
  });
  const userJson = await userRes.json();
  if (userJson.data?.role !== 'admin') {
    throw new Error('Admin access required');
  }

  setToken(json.data.accessToken);
  return userJson.data;
}
