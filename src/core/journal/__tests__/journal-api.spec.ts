import { getAuthHeader, mockFetch } from '@/test-utils/mock-fetch';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Category } from '../types';
import { getCategories } from '../journal-api';

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

describe('Journal API', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_XANO_JOURNAL_API_URL', API_BASE);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('Categories', () => {
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
  });
});
