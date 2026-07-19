import { request } from '@/core/api/http/fetch-api';
import type { Category, Entry, EntryType, Mood, SuccessResponse } from './types';

const withBaseUrl = (path: string): string => {
  const baseUrl = import.meta.env.VITE_XANO_JOURNAL_API_URL;
  if (!baseUrl) {
    throw new Error('VITE_XANO_JOURNAL_API_URL is not configured');
  }
  return `${baseUrl}${path}`;
};

export const getCategories = async (): Promise<Category[]> => {
  return request<Category[]>(withBaseUrl('/categories'), {
    method: 'GET',
  });
};

export const getCategory = async (categoryId: string): Promise<Category> => {
  return request<Category>(withBaseUrl(`/categories/${categoryId}`), {
    method: 'GET',
  });
};

export const saveCategory = async (
  token: string,
  category: Category | Omit<Category, 'id' | 'created_at'>,
): Promise<Category> => {
  const method = 'id' in category ? 'PATCH' : 'POST';
  const url = 'id' in category ? `/categories/${category.id}` : '/categories';
  return request<Category>(withBaseUrl(url), { method, token, body: JSON.stringify(category) });
};

export const getMoods = async (): Promise<Mood[]> => {
  return request<Mood[]>(withBaseUrl('/moods'), {
    method: 'GET',
  });
};

export const getMood = async (moodId: string): Promise<Mood> => {
  return request<Mood>(withBaseUrl(`/moods/${moodId}`), {
    method: 'GET',
  });
};

export const getEntryTypes = async (): Promise<EntryType[]> => {
  return request<EntryType[]>(withBaseUrl('/types'), {
    method: 'GET',
  });
};

export const getEntryType = async (entryTypeId: string): Promise<EntryType> => {
  return request<EntryType>(withBaseUrl(`/types/${entryTypeId}`), {
    method: 'GET',
  });
};

export const getEntries = async (token: string): Promise<Entry[]> => {
  return request<Entry[]>(withBaseUrl('/entries'), {
    method: 'GET',
    token,
  });
};

export const getEntry = async (token: string, entryId: string): Promise<Entry> => {
  return request<Entry>(withBaseUrl(`/entries/${entryId}`), {
    method: 'GET',
    token,
  });
};

export const saveEntry = async (
  token: string,
  entry: Entry | Omit<Entry, 'id' | 'created_at' | 'user_id'>,
): Promise<Entry> => {
  const method = 'id' in entry ? 'PATCH' : 'POST';
  const url = 'id' in entry ? `/entries/${entry.id}` : '/entries';
  return request<Entry>(withBaseUrl(url), { method, token, body: JSON.stringify(entry) });
};

export const removeEntry = async (token: string, entryId: string): Promise<SuccessResponse> => {
  return request<SuccessResponse>(withBaseUrl(`/entries/${entryId}`), {
    method: 'DELETE',
    token,
  });
};
