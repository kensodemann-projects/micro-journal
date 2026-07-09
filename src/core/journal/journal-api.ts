import { request } from '@/core/http/fetch-api';
import type { Category, Mood } from './types';

const withBaseUrl = (path: string): string => {
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

export const saveCategory = async (token: string, category: Partial<Category>): Promise<Category> => {
  return request<Category>(withBaseUrl('/categories'), {
    method: 'POST',
    token,
    body: JSON.stringify(category),
  });
};

export const getMoods = async (token: string): Promise<Mood[]> => {
  return request<Mood[]>(withBaseUrl('/moods'), {
    method: 'GET',
    token,
  });
};
