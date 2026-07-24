import { getMe, postLogin, requestResetLink, updatePassword } from '@/core/api/auth/auth-api';
import { clearToken, getToken, setToken } from '@/core/api/auth/token-storage';
import type { ChangePasswordPayload, LoginCredentials, LoginResponse, User } from '@/core/api/auth/types';
import { HttpError } from '@/core/api/http/fetch-api';
import { ref, type Ref } from 'vue';

const user = ref<User | null>(null);
let sessionRestorePromise: Promise<boolean> | null = null;

const hydrateUserFromToken = async (token: string): Promise<boolean> => {
  try {
    user.value = await getMe(token);
    return true;
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      clearToken();
      user.value = null;
      return false;
    }
    throw error;
  }
};

const restoreSessionIfNeeded = async (): Promise<boolean> => {
  if (user.value) {
    return true;
  }

  const token = getToken();
  if (!token) {
    return false;
  }

  if (!sessionRestorePromise) {
    sessionRestorePromise = hydrateUserFromToken(token).finally(() => {
      sessionRestorePromise = null;
    });
  }

  return sessionRestorePromise;
};

export type UseAuthentication = {
  user: Ref<User | null>;
  isAuthenticated: () => Promise<boolean>;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  sendPasswordReset: (payload: { email: string }) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
};

export const useAuthentication = (): UseAuthentication => {
  void restoreSessionIfNeeded();

  const isAuthenticated = async (): Promise<boolean> => {
    const token = getToken();
    if (!token) {
      user.value = null;
      return false;
    }

    return hydrateUserFromToken(token);
  };

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { authToken } = await postLogin(credentials);
    setToken(authToken);
    await hydrateUserFromToken(authToken);
    return { authToken, user_id: user.value!.id };
  };

  const logout = async (): Promise<void> => {
    clearToken();
    user.value = null;
  };

  const sendPasswordReset = async (payload: { email: string }): Promise<void> => {
    await requestResetLink(payload.email);
  };

  const changePassword = async (payload: ChangePasswordPayload): Promise<void> => {
    const token = getToken();
    if (!token) {
      throw new HttpError(401, 'Not authenticated');
    }

    await updatePassword(token, payload);
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    sendPasswordReset,
    changePassword,
  };
};
