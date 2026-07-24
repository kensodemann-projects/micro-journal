import { getMe, postLogin, requestResetLink, updatePassword } from '@/core/api/auth/auth-api';
import { clearToken, getToken, setToken } from '@/core/api/auth/token-storage';
import type { LoginCredentials, User } from '@/core/api/auth/types';
import { HttpError } from '@/core/api/http/fetch-api';
import { useAuthentication } from '@/core/authentication';
import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

vi.mock('@/core/api/auth/auth-api');
vi.mock('@/core/api/auth/token-storage');

const mockUser: User = {
  id: 42,
  created_at: 1781274921674,
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
};

const loginCredentials: LoginCredentials = { email: 'test@example.com', password: 'secret' };

const initializeAuthentication = (loggedIn: boolean = false) => {
  const { user } = useAuthentication();
  user.value = loggedIn ? mockUser : null;
  vi.clearAllMocks();
};

describe('useAuthentication', () => {
  beforeEach(() => {
    (postLogin as Mock).mockResolvedValue({ authToken: 'test-token', user_id: mockUser.id });
    (getMe as Mock).mockResolvedValue(mockUser);
  });

  describe('login', () => {
    beforeEach(() => {
      initializeAuthentication(false);
    });

    it('stores token and hydrates user on success', async () => {
      const { login, user } = useAuthentication();

      const result = await login(loginCredentials);

      expect(postLogin).toHaveBeenCalledExactlyOnceWith(loginCredentials);
      expect(setToken).toHaveBeenCalledExactlyOnceWith('test-token');
      expect(getMe).toHaveBeenCalledWith('test-token');
      expect(user.value).toEqual(mockUser);
      expect(result).toEqual({ authToken: 'test-token', user_id: mockUser.id });
    });

    it('does not store token or hydrate user on failure', async () => {
      (postLogin as Mock).mockRejectedValue(new HttpError(401, 'Invalid credentials'));

      const { login, user } = useAuthentication();

      await expect(login({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow('Invalid credentials');

      expect(setToken).not.toHaveBeenCalled();
      expect(getMe).not.toHaveBeenCalled();
      expect(user.value).toBeNull();
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      initializeAuthentication(true);
    });

    it('clears token and user', async () => {
      (getToken as Mock).mockReturnValue('existing-token');
      const { isAuthenticated, user, logout } = useAuthentication();
      await isAuthenticated();

      expect(user.value).toEqual(mockUser);

      await logout();

      expect(clearToken).toHaveBeenCalled();
      expect(user.value).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    beforeEach(() => {
      initializeAuthentication(true);
    });

    it('returns true and hydrates user when a valid token is stored', async () => {
      (getToken as Mock).mockReturnValue('valid-token');

      const { isAuthenticated, user } = useAuthentication();

      const result = await isAuthenticated();

      expect(result).toBe(true);
      expect(getMe).toHaveBeenCalledWith('valid-token');
      expect(user.value).toEqual(mockUser);
    });

    it('clears storage and returns false when the token is expired', async () => {
      (getToken as Mock).mockReturnValue('expired-token');
      (getMe as Mock).mockRejectedValue(new HttpError(401, 'Unauthorized'));

      const { isAuthenticated, user } = useAuthentication();

      const result = await isAuthenticated();

      expect(result).toBe(false);
      expect(clearToken).toHaveBeenCalled();
      expect(user.value).toBeNull();
    });

    it('returns false without calling getMe when no token is stored', async () => {
      (getToken as Mock).mockReturnValue(null);

      const { isAuthenticated, user } = useAuthentication();

      const result = await isAuthenticated();

      expect(result).toBe(false);
      expect(getMe).not.toHaveBeenCalled();
      expect(user.value).toBeNull();
    });
  });

  describe('sendPasswordReset', () => {
    beforeEach(() => {
      initializeAuthentication(false);
    });

    it('delegates to requestResetLink with the email', async () => {
      const { sendPasswordReset } = useAuthentication();
      await sendPasswordReset({ email: 'test@example.com' });
      expect(requestResetLink).toHaveBeenCalledExactlyOnceWith('test@example.com');
    });
  });

  describe('changePassword', () => {
    beforeEach(() => {
      initializeAuthentication(true);
    });

    it('delegates to updatePassword with the stored token', async () => {
      const payload = { password: 'new-pass', confirm_password: 'new-pass' };
      (getToken as Mock).mockReturnValue('change-password-token');
      const { changePassword } = useAuthentication();
      await changePassword(payload);
      expect(updatePassword).toHaveBeenCalledExactlyOnceWith('change-password-token', payload);
    });

    it('throws when not authenticated', async () => {
      initializeAuthentication(false);
      (getToken as Mock).mockReturnValue(null);
      const { changePassword } = useAuthentication();
      await expect(changePassword({ password: 'new-pass', confirm_password: 'new-pass' })).rejects.toThrow(
        'Not authenticated',
      );
      expect(updatePassword).not.toHaveBeenCalled();
    });
  });

  describe('session restore', () => {
    beforeEach(() => {
      initializeAuthentication(false);
    });

    it('hydrates user on first useAuthentication call when a token exists in storage', async () => {
      (getToken as Mock).mockReturnValue('stored-token');
      const { user } = useAuthentication();
      await flushPromises();

      expect(getMe).toHaveBeenCalledWith('stored-token');
      expect(user.value).toEqual(mockUser);
    });
  });
});
