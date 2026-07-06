import { vi, type Mock } from 'vitest';

export const getToken: Mock<() => string | null> = vi.fn().mockReturnValue(null);
export const setToken: Mock<(token: string) => void> = vi.fn();
export const clearToken: Mock<() => void> = vi.fn();
