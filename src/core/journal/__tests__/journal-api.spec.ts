import { getAuthHeader, mockFetch } from '@/test-utils/mock-fetch';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCategories, getMoods, saveCategory } from '../journal-api';
import type { Category, Mood } from '../types';

const API_BASE = 'https://api.example.com';
const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Daily Reflection',
    created_at: 1693526400000, // 2023-09-01
  },
  {
    id: 2,
    name: 'Midnight Thoughts',
    created_at: 1705276800000, // 2024-01-15
  },
  {
    id: 3,
    name: 'Wins & Milestones',
    created_at: 1711065600000, // 2024-03-22
  },
  {
    id: 4,
    name: 'Creative Sparks',
    created_at: 1717977600000, // 2024-06-10
  },
  {
    id: 5,
    name: 'Quiet Moments',
    created_at: 1725321600000, // 2024-09-03
  },
];

const mockMoods: Mood[] = [
  {
    id: 1,
    name: 'Great',
    rank: 1,
    created_at: 1693526400000, // 2023-09-01
  },
  {
    id: 2,
    name: 'Okay',
    rank: 2,
    created_at: 1705276800000, // 2024-01-15
  },
  {
    id: 3,
    name: 'Low',
    rank: 3,
    created_at: 1711065600000, // 2024-03-22
  },
  {
    id: 4,
    name: 'Energized',
    rank: 1,
    created_at: 1717977600000, // 2024-06-10
  },
];
describe('Journal API', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_XANO_JOURNAL_API_URL', API_BASE);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('Get Categories', () => {
    it('gets the list of categories', async () => {
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/categories`);
        expect(init?.method).toBe('GET');
        expect(getAuthHeader(init)).toBe('Bearer valid-token');
        return new Response(JSON.stringify(mockCategories), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);
      const result = await getCategories('valid-token');
      expect(result).toEqual(mockCategories);
    });

    it('throws an error if the request fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(() => new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 })),
      );

      await expect(getCategories('valid-token')).rejects.toMatchObject({
        status: 401,
        message: 'Invalid credentials',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in getCategories', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(getCategories('valid-token')).rejects.toThrow('VITE_XANO_JOURNAL_API_URL is not configured');
    });
  });

  describe('Save Category', () => {
    it('saves a category', async () => {
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/categories`);
        expect(init?.method).toBe('POST');
        expect(getAuthHeader(init)).toBe('Bearer valid-token');
        return new Response(JSON.stringify({ id: 314, name: 'New Category', created_at: 1693526400000 }), {
          status: 200,
        });
      });
      vi.stubGlobal('fetch', fetchMock);
      const result = await saveCategory('valid-token', { name: 'New Category' });
      expect(result).toEqual({ id: 314, name: 'New Category', created_at: 1693526400000 });
    });

    it('throws an error if the request fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(() => new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 })),
      );
      await expect(saveCategory('valid-token', { name: 'New Category' })).rejects.toMatchObject({
        status: 401,
        message: 'Invalid credentials',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in saveCategory', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(saveCategory('valid-token', { name: 'New Category' })).rejects.toThrow(
        'VITE_XANO_JOURNAL_API_URL is not configured',
      );
    });
  });

  describe('Get Moods', () => {
    it('gets the list of moods', async () => {
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/moods`);
        expect(init?.method).toBe('GET');
        expect(getAuthHeader(init)).toBe('Bearer valid-token');
        return new Response(JSON.stringify(mockMoods), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);
      const result = await getMoods('valid-token');
      expect(result).toEqual(mockMoods);
    });

    it('throws an error if the request fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(() => new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 })),
      );
      await expect(getMoods('valid-token')).rejects.toMatchObject({
        status: 401,
        message: 'Invalid credentials',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in getMoods', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(getMoods('valid-token')).rejects.toThrow('VITE_XANO_JOURNAL_API_URL is not configured');
    });
  });
});
