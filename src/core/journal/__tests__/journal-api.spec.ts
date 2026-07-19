import { getAuthHeader, mockFetch } from '@/test-utils/mock-fetch';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getCategories,
  getCategory,
  getEntry,
  getEntryType,
  getEntryTypes,
  getEntries,
  getMood,
  getMoods,
  removeEntry,
  saveCategory,
  saveEntry,
} from '../journal-api';
import { mockCategories, mockEntries, mockMoods, mockTypes } from './mock-data';

const API_BASE = 'https://api.example.com';

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
        mockFetch(() => new Response(JSON.stringify({ message: 'Unexpected error' }), { status: 500 })),
      );

      await expect(getCategories('valid-token')).rejects.toMatchObject({
        status: 500,
        message: 'Unexpected error',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in getCategories', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(getCategories('valid-token')).rejects.toThrow('VITE_XANO_JOURNAL_API_URL is not configured');
    });
  });

  describe('Get Category', () => {
    it('gets a category', async () => {
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/categories/1`);
        expect(init?.method).toBe('GET');
        expect(getAuthHeader(init)).toBe('Bearer valid-token');
        return new Response(JSON.stringify(mockCategories[0]), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);
      const result = await getCategory('valid-token', '1');
      expect(result).toEqual(mockCategories[0]);
    });

    it('throws an error if the request fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(() => new Response(JSON.stringify({ message: 'Unexpected error' }), { status: 500 })),
      );
      await expect(getCategory('valid-token', '1')).rejects.toMatchObject({
        status: 500,
        message: 'Unexpected error',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in getCategory', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(getCategory('valid-token', '1')).rejects.toThrow('VITE_XANO_JOURNAL_API_URL is not configured');
    });
  });

  describe('Save Category', () => {
    describe('without an id', () => {
      it('posts the new category', async () => {
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
    });

    describe('with an id', () => {
      it('patches the category', async () => {
        const fetchMock = mockFetch((url, init) => {
          expect(url).toBe(`${API_BASE}/categories/1`);
          expect(init?.method).toBe('PATCH');
          expect(getAuthHeader(init)).toBe('Bearer valid-token');
          return new Response(JSON.stringify({ id: 1, name: 'Updated Category', created_at: 1693526400000 }), {
            status: 200,
          });
        });
        vi.stubGlobal('fetch', fetchMock);
        const result = await saveCategory('valid-token', { id: 1, name: 'Updated Category' });
        expect(result).toEqual({ id: 1, name: 'Updated Category', created_at: 1693526400000 });
      });
    });

    it('throws an error if the request fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(
          () => new Response(JSON.stringify({ message: 'Unauthorized - Authentication Required' }), { status: 401 }),
        ),
      );
      await expect(saveCategory('valid-token', { name: 'New Category' })).rejects.toMatchObject({
        status: 401,
        message: 'Unauthorized - Authentication Required',
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
        mockFetch(() => new Response(JSON.stringify({ message: 'Unexpected error' }), { status: 500 })),
      );
      await expect(getMoods('valid-token')).rejects.toMatchObject({
        status: 500,
        message: 'Unexpected error',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in getMoods', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(getMoods('valid-token')).rejects.toThrow('VITE_XANO_JOURNAL_API_URL is not configured');
    });
  });

  describe('Get Mood', () => {
    it('gets a mood', async () => {
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/moods/1`);
        expect(init?.method).toBe('GET');
        expect(getAuthHeader(init)).toBe('Bearer valid-token');
        return new Response(JSON.stringify(mockMoods[0]), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);
      const result = await getMood('valid-token', '1');
      expect(result).toEqual(mockMoods[0]);
    });

    it('throws an error if the request fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(() => new Response(JSON.stringify({ message: 'Not Found.' }), { status: 404 })),
      );
      await expect(getMood('valid-token', '1')).rejects.toMatchObject({
        status: 404,
        message: 'Not Found.',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in getMood', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(getMood('valid-token', '1')).rejects.toThrow('VITE_XANO_JOURNAL_API_URL is not configured');
    });
  });

  describe('Get Entry Types', () => {
    it('gets the list of entry types', async () => {
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/types`);
        expect(init?.method).toBe('GET');
        expect(getAuthHeader(init)).toBe('Bearer valid-token');
        return new Response(JSON.stringify(mockTypes), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);
      const result = await getEntryTypes('valid-token');
      expect(result).toEqual(mockTypes);
    });

    it('throws an error if the request fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(() => new Response(JSON.stringify({ message: 'Unexpected error' }), { status: 500 })),
      );
      await expect(getEntryTypes('valid-token')).rejects.toMatchObject({
        status: 500,
        message: 'Unexpected error',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in getEntryTypes', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(getEntryTypes('valid-token')).rejects.toThrow('VITE_XANO_JOURNAL_API_URL is not configured');
    });
  });

  describe('Get Entry Type', () => {
    it('gets an entry type', async () => {
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/types/1`);
        expect(init?.method).toBe('GET');
        expect(getAuthHeader(init)).toBe('Bearer valid-token');
        return new Response(JSON.stringify(mockTypes[0]), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);
      const result = await getEntryType('valid-token', '1');
      expect(result).toEqual(mockTypes[0]);
    });

    it('throws an error if the request fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(() => new Response(JSON.stringify({ message: 'Not Found.' }), { status: 404 })),
      );
      await expect(getEntryType('valid-token', '1')).rejects.toMatchObject({
        status: 404,
        message: 'Not Found.',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in getEntryType', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(getEntryType('valid-token', '1')).rejects.toThrow('VITE_XANO_JOURNAL_API_URL is not configured');
    });
  });

  describe('Get Entries', () => {
    it('gets the list of entries', async () => {
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/entries`);
        expect(init?.method).toBe('GET');
        expect(getAuthHeader(init)).toBe('Bearer valid-token');
        return new Response(JSON.stringify(mockEntries), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);
      const result = await getEntries('valid-token');
      expect(result).toEqual(mockEntries);
    });

    it('throws an error if the request fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(() => new Response(JSON.stringify({ message: 'Unexpected error' }), { status: 500 })),
      );
      await expect(getEntries('valid-token')).rejects.toMatchObject({
        status: 500,
        message: 'Unexpected error',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in getEntries', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(getEntries('valid-token')).rejects.toThrow('VITE_XANO_JOURNAL_API_URL is not configured');
    });
  });

  describe('Get Entry', () => {
    it('gets an entry', async () => {
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/entries/1`);
        expect(init?.method).toBe('GET');
        expect(getAuthHeader(init)).toBe('Bearer valid-token');
        return new Response(JSON.stringify(mockEntries[0]), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);
      const result = await getEntry('valid-token', '1');
      expect(result).toEqual(mockEntries[0]);
    });

    it('throws an error if the request fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(() => new Response(JSON.stringify({ message: 'Not Found.' }), { status: 404 })),
      );
      await expect(getEntry('valid-token', '1')).rejects.toMatchObject({
        status: 404,
        message: 'Not Found.',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in getEntry', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(getEntry('valid-token', '1')).rejects.toThrow('VITE_XANO_JOURNAL_API_URL is not configured');
    });
  });

  describe('Save Entry', () => {
    describe('without an id', () => {
      it('posts the new entry', async () => {
        const fetchMock = mockFetch((url, init) => {
          expect(url).toBe(`${API_BASE}/entries`);
          expect(init?.method).toBe('POST');
          expect(getAuthHeader(init)).toBe('Bearer valid-token');
          return new Response(JSON.stringify(mockEntries[0]), { status: 200 });
        });
        vi.stubGlobal('fetch', fetchMock);
        const result = await saveEntry('valid-token', {
          subject: 'New Entry',
          description: 'New Entry Description',
          category_id: mockCategories[0].id,
          type_id: mockTypes[0].id,
          mood_id: mockMoods[0].id,
        });
        expect(result).toEqual(mockEntries[0]);
      });
    });

    describe('with an id', () => {
      it('patches the entry', async () => {
        const fetchMock = mockFetch((url, init) => {
          expect(url).toBe(`${API_BASE}/entries/1`);
          expect(init?.method).toBe('PATCH');
          expect(getAuthHeader(init)).toBe('Bearer valid-token');
          return new Response(JSON.stringify({ ...mockEntries[0], description: 'Updated Entry Description' }), {
            status: 200,
          });
        });
        vi.stubGlobal('fetch', fetchMock);
        const result = await saveEntry('valid-token', {
          ...mockEntries[0],
          description: 'Updated Entry Description',
        });
        expect(result).toEqual({ ...mockEntries[0], description: 'Updated Entry Description' });
      });
    });

    it('throws an error if the request fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(() => new Response(JSON.stringify({ message: 'Unexpected error' }), { status: 500 })),
      );
      await expect(
        saveEntry('valid-token', {
          subject: 'New Entry',
          description: 'New Entry Description',
          category_id: mockCategories[0].id,
          type_id: mockTypes[0].id,
          mood_id: mockMoods[0].id,
        }),
      ).rejects.toMatchObject({
        status: 500,
        message: 'Unexpected error',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in saveEntry', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(
        saveEntry('valid-token', {
          subject: 'New Entry',
          description: 'New Entry Description',
          category_id: mockCategories[0].id,
          type_id: mockTypes[0].id,
          mood_id: mockMoods[0].id,
        }),
      ).rejects.toThrow('VITE_XANO_JOURNAL_API_URL is not configured');
    });
  });

  describe('Remove Entry', () => {
    it('removes an entry', async () => {
      const fetchMock = mockFetch((url, init) => {
        expect(url).toBe(`${API_BASE}/entries/1`);
        expect(init?.method).toBe('DELETE');
        expect(getAuthHeader(init)).toBe('Bearer valid-token');
        return new Response(JSON.stringify({ message: 'Entry removed successfully' }), { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);
      const result = await removeEntry('valid-token', '1');
      expect(result).toEqual({ message: 'Entry removed successfully' });
    });

    it('throws an error if the request fails', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch(() => new Response(JSON.stringify({ message: 'Not Found.' }), { status: 404 })),
      );
      await expect(removeEntry('valid-token', '1')).rejects.toMatchObject({
        status: 404,
        message: 'Not Found.',
      });
    });

    it('throws when VITE_XANO_JOURNAL_API_URL is not configured in removeEntry', async () => {
      vi.stubEnv('VITE_XANO_JOURNAL_API_URL', '');

      await expect(removeEntry('valid-token', '1')).rejects.toThrow('VITE_XANO_JOURNAL_API_URL is not configured');
    });
  });
});
