import { vi } from 'vitest';

export const getAuthHeader = (init?: RequestInit): string | null => {
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
};

export const mockFetch = (handler: (url: string, init?: RequestInit) => Response | Promise<Response>) => {
  return vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    return Promise.resolve(handler(url, init));
  });
};
