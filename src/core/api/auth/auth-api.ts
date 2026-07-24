import { request } from '@/core/api/http/fetch-api';
import type { ChangePasswordPayload, LoginCredentials, LoginResponse, MessageResponse, User } from './types';

const withBaseUrl = (path: string): string => {
  const baseUrl = import.meta.env.VITE_XANO_AUTH_API_URL;
  if (!baseUrl) {
    throw new Error('VITE_XANO_AUTH_API_URL is not configured');
  }
  return `${baseUrl}${path}`;
};

export const postLogin = (credentials: LoginCredentials): Promise<LoginResponse> => {
  return request<LoginResponse>(withBaseUrl('/auth/login'), {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const getMe = (token: string): Promise<User> => {
  return request<User>(withBaseUrl('/auth/me'), {
    method: 'GET',
    token,
  });
};

export const requestResetLink = (email: string): Promise<MessageResponse> => {
  const params = new URLSearchParams({ email });
  return request<MessageResponse>(withBaseUrl(`/reset/request-reset-link?${params.toString()}`), {
    method: 'GET',
  });
};

export const postMagicLinkLogin = (payload: { magic_token: string; email: string }): Promise<LoginResponse> => {
  return request<LoginResponse>(withBaseUrl('/reset/magic-link-login'), {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updatePassword = (token: string, payload: ChangePasswordPayload): Promise<MessageResponse> => {
  return request<MessageResponse>(withBaseUrl('/reset/update_password'), {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
};
