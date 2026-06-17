import type { ChangePasswordPayload, LoginCredentials, LoginResponse, MessageResponse, User } from '@/core/auth/types';

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

function getBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_XANO_AUTH_API_URL;
  if (!baseUrl) {
    throw new Error('VITE_XANO_AUTH_API_URL is not configured');
  }
  return baseUrl;
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string; error?: string };
    return body.message ?? body.error ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

async function request<T>(path: string, options: RequestInit & { token?: string | null } = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Content-Type') && rest.body) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new HttpError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function postLogin(credentials: LoginCredentials): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function getMe(token: string): Promise<User> {
  return request<User>('/auth/me', {
    method: 'GET',
    token,
  });
}

export function requestResetLink(email: string): Promise<MessageResponse> {
  const params = new URLSearchParams({ email });
  return request<MessageResponse>(`/reset/request-reset-link?${params.toString()}`, {
    method: 'GET',
  });
}

export function postMagicLinkLogin(payload: { magic_token: string; email: string }): Promise<LoginResponse> {
  return request<LoginResponse>('/reset/magic-link-login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updatePassword(token: string, payload: ChangePasswordPayload): Promise<MessageResponse> {
  return request<MessageResponse>('/reset/update_password', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}
