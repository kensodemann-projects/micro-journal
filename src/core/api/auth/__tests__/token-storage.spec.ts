import { afterEach, describe, expect, it } from 'vitest';
import { clearToken, getToken, setToken } from '@/core/api/auth/token-storage';

describe('token-storage', () => {
  afterEach(() => {
    clearToken();
  });

  describe('getToken', () => {
    it('returns null when no token is stored', () => {
      expect(getToken()).toBeNull();
    });

    it('returns the stored token', () => {
      setToken('my-token');

      expect(getToken()).toBe('my-token');
    });
  });

  describe('setToken', () => {
    it('overwrites an existing token', () => {
      setToken('first-token');
      setToken('second-token');

      expect(getToken()).toBe('second-token');
    });
  });

  describe('clearToken', () => {
    it('removes the stored token', () => {
      setToken('my-token');

      clearToken();

      expect(getToken()).toBeNull();
    });

    it('is safe to call when no token is stored', () => {
      expect(() => clearToken()).not.toThrow();
      expect(getToken()).toBeNull();
    });
  });
});
