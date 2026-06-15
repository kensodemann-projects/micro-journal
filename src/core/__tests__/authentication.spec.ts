import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearToken, getToken, setToken } from '@/core/auth/token-storage';

const API_BASE = 'https://x8ki-letl-twmt.n7.xano.io/api:bQIgD9jv';

const mockUser = {
  id: 42,
  created_at: 1781274921674,
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin' as const,
};

function getAuthHeader(init?: RequestInit): string | null {
  const headers = init?.headers;
  if (!headers) {
    return null;
  }
  if (headers instanceof Headers) {
    return headers.get('Authorization');
  }
  if (Array.isArray(headers)) {
    const entry = headers.find(([key]) => key.toLowerCase() === 'authorization');
    return entry?.[1] ?? null;
  }
  return (headers as Record<string, string>).Authorization ?? null;
}

function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  return vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    return Promise.resolve(handler(url, init));
  });
}

async function loadAuthentication() {
  vi.resetModules();
  const { useAuthentication } = await import('@/core/authentication');
  return useAuthentication();
}

describe('useAuthentication', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_XANO_AUTH_API_URL', API_BASE);
    clearToken();
  });

  afterEach(() => {
    clearToken();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('login success stores token and sets user from /auth/me', async () => {
    const fetchMock = mockFetch((url, init) => {
      if (url.endsWith('/auth/login') && init?.method === 'POST') {
        return new Response(JSON.stringify({ authToken: 'test-token', user_id: '42' }), {
          status: 200,
        });
      }
      if (url.endsWith('/auth/me') && init?.method === 'GET') {
        expect(getAuthHeader(init)).toBe('Bearer test-token');
        return new Response(JSON.stringify(mockUser), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const auth = await loadAuthentication();
    await auth.login({ email: 'test@example.com', password: 'secret' });

    expect(getToken()).toBe('test-token');
    expect(auth.user.value).toEqual(mockUser);
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE}/auth/login`, expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE}/auth/me`, expect.any(Object));
  });

  it('login failure does not store token and leaves user null', async () => {
    const fetchMock = mockFetch((url) => {
      if (url.endsWith('/auth/login')) {
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
      }
      return new Response('Not found', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const auth = await loadAuthentication();

    await expect(auth.login({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow('Invalid credentials');

    expect(getToken()).toBeNull();
    expect(auth.user.value).toBeNull();
  });

  it('logout clears token and user', async () => {
    setToken('existing-token');
    const fetchMock = mockFetch((url) => {
      if (url.endsWith('/auth/me')) {
        return new Response(JSON.stringify(mockUser), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const auth = await loadAuthentication();
    await auth.isAuthenticated();

    expect(auth.user.value).toEqual(mockUser);

    await auth.logout();

    expect(getToken()).toBeNull();
    expect(auth.user.value).toBeNull();
  });

  it('isAuthenticated returns true and hydrates user with valid token', async () => {
    setToken('valid-token');
    const fetchMock = mockFetch((url, init) => {
      if (url.endsWith('/auth/me')) {
        expect(getAuthHeader(init)).toBe('Bearer valid-token');
        return new Response(JSON.stringify(mockUser), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const auth = await loadAuthentication();
    const result = await auth.isAuthenticated();

    expect(result).toBe(true);
    expect(auth.user.value).toEqual(mockUser);
  });

  it('isAuthenticated clears storage and returns false with expired token', async () => {
    setToken('expired-token');
    const fetchMock = mockFetch((url) => {
      if (url.endsWith('/auth/me')) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
      }
      return new Response('Not found', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const auth = await loadAuthentication();
    const result = await auth.isAuthenticated();

    expect(result).toBe(false);
    expect(getToken()).toBeNull();
    expect(auth.user.value).toBeNull();
  });

  it('isAuthenticated returns false when no token is stored', async () => {
    const fetchMock = mockFetch(() => new Response('Not found', { status: 404 }));
    vi.stubGlobal('fetch', fetchMock);

    const auth = await loadAuthentication();
    const result = await auth.isAuthenticated();

    expect(result).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sendPasswordReset calls GET with encoded email query param', async () => {
    const fetchMock = mockFetch((url, init) => {
      if (url === `${API_BASE}/reset/request-reset-link?email=test%40example.com`) {
        expect(init?.method).toBe('GET');
        return new Response(JSON.stringify({ message: 'Email sent' }), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const auth = await loadAuthentication();
    await auth.sendPasswordReset({ email: 'test@example.com' });

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE}/reset/request-reset-link?email=test%40example.com`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('changePassword sends bearer token and body', async () => {
    setToken('change-password-token');
    const fetchMock = mockFetch((url, init) => {
      if (url.endsWith('/auth/me')) {
        return new Response(JSON.stringify(mockUser), { status: 200 });
      }
      if (url.endsWith('/reset/update_password') && init?.method === 'POST') {
        expect(getAuthHeader(init)).toBe('Bearer change-password-token');
        expect(init?.body).toBe(JSON.stringify({ password: 'new-pass', confirm_password: 'new-pass' }));
        return new Response(JSON.stringify({ message: 'Password updated' }), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const auth = await loadAuthentication();
    await auth.changePassword({ password: 'new-pass', confirm_password: 'new-pass' });

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE}/reset/update_password`, expect.any(Object));
  });

  it('changePassword throws when not authenticated', async () => {
    const fetchMock = mockFetch(() => new Response('Not found', { status: 404 }));
    vi.stubGlobal('fetch', fetchMock);

    const auth = await loadAuthentication();

    await expect(auth.changePassword({ password: 'new-pass', confirm_password: 'new-pass' })).rejects.toThrow(
      'Not authenticated',
    );
  });

  it('restores user on first useAuthentication call when token exists in storage', async () => {
    setToken('stored-token');
    const fetchMock = mockFetch((url, init) => {
      if (url.endsWith('/auth/me')) {
        expect(getAuthHeader(init)).toBe('Bearer stored-token');
        return new Response(JSON.stringify(mockUser), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const auth = await loadAuthentication();
    await flushPromises();

    expect(auth.user.value).toEqual(mockUser);

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE}/auth/me`, expect.any(Object));
  });
});
