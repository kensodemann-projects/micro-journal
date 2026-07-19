import { request } from '@/core/http/fetch-api';
import type { Category, Entry, EntryType, Mood, SuccessResponse } from './types';

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

export const getCategory = async (token: string, categoryId: string): Promise<Category> => {
  return request<Category>(withBaseUrl(`/categories/${categoryId}`), {
    method: 'GET',
    token,
  });
};

export const saveCategory = async (token: string, category: Partial<Category>): Promise<Category> => {
  const method = category.id ? 'PATCH' : 'POST';
  const url = category.id ? `/categories/${category.id}` : '/categories';
  return request<Category>(withBaseUrl(url), {
    method,
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

export const getMood = async (token: string, moodId: string): Promise<Mood> => {
  return request<Mood>(withBaseUrl(`/moods/${moodId}`), {
    method: 'GET',
    token,
  });
};

export const getEntryTypes = async (token: string): Promise<EntryType[]> => {
  return request<EntryType[]>(withBaseUrl('/types'), {
    method: 'GET',
    token,
  });
};

export const getEntryType = async (token: string, entryTypeId: string): Promise<EntryType> => {
  return request<EntryType>(withBaseUrl(`/types/${entryTypeId}`), {
    method: 'GET',
    token,
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

export const saveEntry = async (token: string, entry: Partial<Entry>): Promise<Entry> => {
  const method = entry.id ? 'PATCH' : 'POST';
  const url = entry.id ? `/entries/${entry.id}` : '/entries';
  return request<Entry>(withBaseUrl(url), {
    method,
    token,
    body: JSON.stringify(entry),
  });
};

export const removeEntry = async (token: string, entryId: string): Promise<SuccessResponse> => {
  return request<SuccessResponse>(withBaseUrl(`/entries/${entryId}`), {
    method: 'DELETE',
    token,
  });
};
