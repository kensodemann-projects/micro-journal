import type { UseAuthentication } from '@/core/api/auth/types';
import { vi } from 'vitest';
import { ref } from 'vue';

const isAuthenticated = vi.fn().mockResolvedValue(false);
const login = vi.fn().mockResolvedValue({});
const logout = vi.fn().mockResolvedValue(undefined);
const sendPasswordReset = vi.fn().mockResolvedValue(undefined);
const changePassword = vi.fn().mockResolvedValue(undefined);

export const useAuthentication: () => UseAuthentication = () => {
  return {
    isAuthenticated,
    login,
    logout,
    sendPasswordReset,
    changePassword,
    user: ref({
      id: 1,
      created_at: 1781274921674,
      name: 'Testy McDefaultTestUser',
      email: 'test@testy-face.com',
      role: 'admin',
    }),
  };
};
