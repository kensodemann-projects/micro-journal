import { request } from '@/core/http/fetch-api';
import type { Category } from './types';

export const withBaseUrl = (path: string): string => {
  const baseUrl = import.meta.env.VITE_XANO_JOURNAL_API_URL;
  if (!baseUrl) {
    throw new Error('VITE_XANO_JOURNAL_API_URL is not configured');
  }
  return `${baseUrl}${path}`;
};

export const getCategories = async (token: string): Promise<Category[]> => {
  return request<Category[]>(withBaseUrl('/categories'), {
    method: 'GET',
    token,
  });
};
