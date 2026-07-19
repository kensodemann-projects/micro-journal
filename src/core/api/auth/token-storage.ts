const AUTH_TOKEN_KEY = 'authToken';

const storage = (): Storage => window.localStorage;

export const getToken = (): string | null => {
  return storage().getItem(AUTH_TOKEN_KEY);
};

export const setToken = (token: string): void => {
  storage().setItem(AUTH_TOKEN_KEY, token);
};

export const clearToken = (): void => {
  storage().removeItem(AUTH_TOKEN_KEY);
};
