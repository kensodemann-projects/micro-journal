import { vi, type Mock } from 'vitest';
import type {
  ChangePasswordPayload,
  LoginCredentials,
  LoginResponse,
  MessageResponse,
  User,
} from '@/core/api/auth/types';

const defaultUser: User = {
  id: 1,
  created_at: 1781274921674,
  name: 'Testy McDefaultTestUser',
  email: 'test@testy-face.com',
  role: 'admin',
};

const defaultLoginResponse: LoginResponse = {
  authToken: 'test-auth-token',
  user_id: 1,
};

export const postLogin: Mock<(credentials: LoginCredentials) => Promise<LoginResponse>> = vi
  .fn()
  .mockResolvedValue(defaultLoginResponse);
export const getMe: Mock<(token: string) => Promise<User>> = vi.fn().mockResolvedValue(defaultUser);
export const requestResetLink: Mock<(email: string) => Promise<MessageResponse>> = vi
  .fn()
  .mockResolvedValue({ message: 'Email sent' });
export const postMagicLinkLogin: Mock<(payload: { magic_token: string; email: string }) => Promise<LoginResponse>> = vi
  .fn()
  .mockResolvedValue(defaultLoginResponse);
export const updatePassword: Mock<(token: string, payload: ChangePasswordPayload) => Promise<MessageResponse>> = vi
  .fn()
  .mockResolvedValue({ message: 'Password updated' });
