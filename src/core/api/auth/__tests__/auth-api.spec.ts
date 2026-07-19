import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getMe, postLogin, postMagicLinkLogin, requestResetLink, updatePassword } from '@/core/api/auth/auth-api';
import { getAuthHeader, mockFetch } from '@/test-utils/mock-fetch';

const API_BASE = 'https://api.example.com';

const mockUser = {
  id: 42,
  created_at: 1781274921674,
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin' as const,
};

const mockLoginResponse = {
  authToken: 'test-token',
  user_id: 42,
};

describe('auth-api', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_XANO_AUTH_API_URL', API_BASE);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('postLogin', () => {
    it('POSTs credentials and returns login response', async () => {
      const credentials = { email: 'test@example.com', password: 'secret' };
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/auth/login`);
        expect(init?.method).toBe('POST');
        expect(init?.body).toBe(JSON.stringify(credentials));
        expect(getAuthHeader(init)).toBeNull();
        return new Response(JSON.stringify(mockLoginResponse), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await postLogin(credentials);

      expect(result).toEqual(mockLoginResponse);
    });

    it('throws HttpError when login fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(() => new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 })),
      );

      await expect(postLogin({ email: 'test@example.com', password: 'wrong' })).rejects.toMatchObject({
        status: 401,
        message: 'Invalid credentials',
      });
    });
  });

  describe('getMe', () => {
    it('GETs /auth/me with bearer token and returns user', async () => {
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/auth/me`);
        expect(init?.method).toBe('GET');
        expect(getAuthHeader(init)).toBe('Bearer valid-token');
        return new Response(JSON.stringify(mockUser), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await getMe('valid-token');

      expect(result).toEqual(mockUser);
    });
  });

  describe('requestResetLink', () => {
    it('GETs reset link endpoint with encoded email', async () => {
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/reset/request-reset-link?email=test%40example.com`);
        expect(init?.method).toBe('GET');
        expect(getAuthHeader(init)).toBeNull();
        return new Response(JSON.stringify({ message: 'Email sent' }), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await requestResetLink('test@example.com');

      expect(result).toEqual({ message: 'Email sent' });
    });
  });

  describe('postMagicLinkLogin', () => {
    it('POSTs magic link payload and returns login response', async () => {
      const payload = { magic_token: 'magic-123', email: 'test@example.com' };
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/reset/magic-link-login`);
        expect(init?.method).toBe('POST');
        expect(init?.body).toBe(JSON.stringify(payload));
        return new Response(JSON.stringify(mockLoginResponse), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await postMagicLinkLogin(payload);

      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('updatePassword', () => {
    it('POSTs password payload with bearer token', async () => {
      const payload = { password: 'new-pass', confirm_password: 'new-pass' };
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/reset/update_password`);
        expect(init?.method).toBe('POST');
        expect(init?.body).toBe(JSON.stringify(payload));
        expect(getAuthHeader(init)).toBe('Bearer change-password-token');
        return new Response(JSON.stringify({ message: 'Password updated' }), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await updatePassword('change-password-token', payload);

      expect(result).toEqual({ message: 'Password updated' });
    });
  });

  describe('withBaseUrl', () => {
    it('throws when VITE_XANO_AUTH_API_URL is not configured', () => {
      vi.stubEnv('VITE_XANO_AUTH_API_URL', '');

      expect(() => postLogin({ email: 'test@example.com', password: 'secret' })).toThrow(
        'VITE_XANO_AUTH_API_URL is not configured',
      );
    });
  });
});
