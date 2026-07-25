const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3003/api/v1';
const TOKEN_KEY = 'admin_token';
const REFRESH_KEY = 'admin_refresh_token';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string };
}

let refreshPromise: Promise<string> | null = null;

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function logout() {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken() ?? ''}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } finally {
    clearToken();
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const user = await apiGet<{ role: string }>('/auth/me');
    if (user.role !== 'admin') {
      clearToken();
      return false;
    }
    return true;
  } catch {
    clearToken();
    return false;
  }
}

export function isLoggedIn() {
  return !!getToken();
}

function redirectToLogin() {
  clearToken();
  window.location.href = '/';
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const json: ApiResponse<{ accessToken: string; refreshToken?: string }> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message ?? 'Session expired');
  }

  setToken(json.data.accessToken);
  if (json.data.refreshToken) {
    setRefreshToken(json.data.refreshToken);
  }

  return json.data.accessToken;
}

async function parseResponse<T>(res: Response): Promise<T> {
  let json: ApiResponse<T>;
  try {
    json = await res.json();
  } catch {
    throw new Error(res.ok ? 'Invalid response' : `Request failed (${res.status})`);
  }

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message ?? `Request failed (${res.status})`);
  }

  return json.data;
}

async function apiFetch<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && retry && getRefreshToken()) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      headers.Authorization = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${path}`, { ...options, headers });
    } catch {
      redirectToLogin();
      throw new Error('Session expired');
    }
  }

  if (res.status === 401) {
    redirectToLogin();
    throw new Error('Unauthorized');
  }

  return parseResponse<T>(res);
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const json: ApiResponse<{
    accessToken: string;
    refreshToken: string;
    user: { role: string };
  }> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message ?? 'Login failed');
  }

  if (json.data.user?.role !== 'admin') {
    throw new Error('Admin access required');
  }

  setToken(json.data.accessToken);
  setRefreshToken(json.data.refreshToken);
  return json.data.user;
}
