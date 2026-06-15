import type { Ref } from 'vue';

export type UserRole = 'admin' | 'member';

export interface User {
  id: number;
  created_at: number;
  name: string;
  email: string | null;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  authToken: string;
  user_id: string;
}

export interface MessageResponse {
  message: string;
}

export interface ChangePasswordPayload {
  password: string;
  confirm_password: string;
}

export interface UseAuthentication {
  user: Ref<User | null>;
  isAuthenticated: () => Promise<boolean>;
  login: (credentials: LoginCredentials) => Promise<unknown>;
  logout: () => Promise<void>;
  sendPasswordReset: (payload: { email: string }) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
}
