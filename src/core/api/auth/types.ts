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
  user_id: number;
}

export interface MessageResponse {
  message: string;
}

export interface ChangePasswordPayload {
  password: string;
  confirm_password: string;
}
