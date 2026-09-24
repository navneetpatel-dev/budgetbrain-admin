const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3003/api/v1';
const REFRESH_KEY = 'admin_refresh_token';
const LEGACY_TOKEN_KEY = 'admin_token';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string };
}

let refreshPromise: Promise<string> | null = null;

/**
 * The access token is kept in memory only (not localStorage) to shrink the
 * XSS exposure window — the backend has no httpOnly-cookie login mode (pure
 * JSON bearer-token API), so this is the strongest hardening achievable
 * without a backend change. It resets on full page reload; `isLoggedIn()`
 * and `apiFetch`'s 401-retry silently rehydrate it from the refresh token.
 */
let accessToken: string | null = null;

function getToken() {
  return accessToken;
}

function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setToken(token: string) {
  accessToken = token;
}

export function setRefreshToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_KEY, token);
}

export function clearToken() {
  accessToken = null;
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
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
  // Deliberately does NOT bail out when the in-memory access token is empty
  // (e.g. right after a page reload) — apiFetch's own 401-retry path will
  // transparently exchange the localStorage refresh token for a new access
  // token if one exists. Bailing here before that could run was a real bug:
  // it logged every admin out on every page refresh.
  if (!isLoggedIn()) return false;
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

/**
 * A session exists whenever a refresh token is present, not whenever an
 * access token is — the access token is in-memory only and is empty on
 * every fresh page load by design (see `accessToken` above).
 */
export function isLoggedIn() {
  return !!getRefreshToken();
}

function redirectToLogin() {
  clearToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
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

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) });
}

export async function apiDelete<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'DELETE' });
}

type LoginResult =
  | { mfaRequired: true; mfaToken: string }
  | { mfaRequired?: false; role: string };

function applySessionTokens(data: { accessToken: string; refreshToken: string; user: { role: string } }) {
  if (data.user?.role !== 'admin') {
    throw new Error('Admin access required');
  }
  setToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  return data.user;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const json: ApiResponse<
    | { mfaRequired: true; mfaToken: string }
    | { accessToken: string; refreshToken: string; user: { role: string } }
  > = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message ?? 'Login failed');
  }

  if ('mfaRequired' in json.data && json.data.mfaRequired) {
    return { mfaRequired: true, mfaToken: json.data.mfaToken };
  }

  const user = applySessionTokens(json.data as { accessToken: string; refreshToken: string; user: { role: string } });
  return { role: user.role };
}

/** Completes login for a TOTP-enabled admin — the second step after `login()` returns mfaRequired. */
export async function completeMfaLogin(mfaToken: string, code: string) {
  const res = await fetch(`${API_URL}/auth/login/mfa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mfaToken, code }),
  });

  const json: ApiResponse<{
    accessToken: string;
    refreshToken: string;
    user: { role: string };
  }> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message ?? 'Verification failed');
  }

  return applySessionTokens(json.data);
}
