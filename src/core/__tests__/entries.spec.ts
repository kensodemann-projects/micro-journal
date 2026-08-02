import { mockCategories, mockEntries, mockMoods, mockTypes } from '@/core/api/journal/__mocks__/mock-data';
import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/api/auth/token-storage');
vi.mock('@/core/api/journal/journal-api');

describe('useEntries', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('on load', () => {
    it('gets the token from the token storage', async () => {
      const { getToken } = await import('@/core/api/auth/token-storage');
      vi.mocked(getToken).mockReturnValue('123');

      const { useEntries } = await import('@/core/entries');
      useEntries();
      expect(getToken).toHaveBeenCalledExactlyOnceWith();
      await flushPromises();
    });

    describe('when a token exists', () => {
      beforeEach(async () => {
        const { getToken } = await import('@/core/api/auth/token-storage');
        vi.mocked(getToken).mockReturnValue('123');
      });

      it('loads the entries if they are not already loaded', async () => {
        const { getEntries } = await import('@/core/api/journal/journal-api');
        vi.mocked(getEntries).mockResolvedValue(mockEntries);

        const { useEntries } = await import('@/core/entries');
        const { entries } = useEntries();
        await flushPromises();
        useEntries();
        await flushPromises();
        expect(getEntries).toHaveBeenCalledExactlyOnceWith('123');
        expect(entries.value).toEqual(mockEntries);
      });

      it('sets loading to true while fetching and false after the fetch completes', async () => {
        const { getEntries } = await import('@/core/api/journal/journal-api');
        let resolveEntries!: (value: typeof mockEntries) => void;
        vi.mocked(getEntries).mockReturnValue(
          new Promise((resolve) => {
            resolveEntries = resolve;
          }),
        );

        const { useEntries } = await import('@/core/entries');
        const { loading } = useEntries();

        expect(loading.value).toBe(true);

        resolveEntries(mockEntries);
        await flushPromises();

        expect(loading.value).toBe(false);
      });

      it('sets error when fetching entries fails', async () => {
        const { getEntries } = await import('@/core/api/journal/journal-api');
        const fetchError = new Error('Failed to fetch entries');
        vi.mocked(getEntries).mockRejectedValue(fetchError);

        const { useEntries } = await import('@/core/entries');
        const { error, loading } = useEntries();
        expect(loading.value).toBe(true);

        await flushPromises();

        expect(error.value).toBe(fetchError);
        expect(loading.value).toBe(false);
      });
    });

    describe('when no token exists', () => {
      beforeEach(async () => {
        const { getToken } = await import('@/core/api/auth/token-storage');
        vi.mocked(getToken).mockReturnValue(null);
      });

      it('does not load the entries', async () => {
        const { getEntries } = await import('@/core/api/journal/journal-api');
        const { useEntries } = await import('@/core/entries');
        const { entries } = useEntries();
        await flushPromises();
        expect(entries.value).toEqual([]);
        expect(getEntries).not.toHaveBeenCalled();
      });
    });
  });

  describe('clear entries', () => {
    beforeEach(async () => {
      const { getToken } = await import('@/core/api/auth/token-storage');
      const { getEntries } = await import('@/core/api/journal/journal-api');
      vi.mocked(getToken).mockReturnValue('123');
      vi.mocked(getEntries).mockResolvedValue(mockEntries);
    });
    it('removes the previously loaded entities', async () => {
      const { useEntries } = await import('@/core/entries');
      useEntries();
      await flushPromises();

      const { entries, clearEntries } = useEntries();
      clearEntries();
      expect(entries.value).toEqual([]);
    });
  });

  describe('create entry', () => {
    beforeEach(async () => {
      const { getToken } = await import('@/core/api/auth/token-storage');
      const { saveEntry } = await import('@/core/api/journal/journal-api');
      vi.mocked(getToken).mockReturnValue('123');
      vi.mocked(saveEntry).mockResolvedValue({
        id: 42,
        created_at: 1785696012523,
        user_id: 42,
        date: '2024-10-03',
        entry_time: 1727996400000, // late night
        subject: "Can't stop replaying the meeting",
        description: 'Worried I came across poorly in the client call. Need to ask for feedback tomorrow.',
        category_id: mockCategories[1].id, // Midnight Thoughts
        type_id: mockTypes[2].id, // Worry
        mood_id: mockMoods[2].id, // Low
      });
    });

    it('calls the saveEntry API', async () => {
      const { saveEntry } = await import('@/core/api/journal/journal-api');
      const { useEntries } = await import('@/core/entries');
      const { createEntry } = useEntries();
      createEntry({
        date: '2024-10-03',
        entry_time: 1727996400000, // late night
        subject: "Can't stop replaying the meeting",
        description: 'Worried I came across poorly in the client call. Need to ask for feedback tomorrow.',
        category_id: mockCategories[1].id, // Midnight Thoughts
        type_id: mockTypes[2].id, // Worry
        mood_id: mockMoods[2].id, // Low
      });
      expect(saveEntry).toHaveBeenCalledExactlyOnceWith('123', {
        date: '2024-10-03',
        entry_time: 1727996400000, // late night
        subject: "Can't stop replaying the meeting",
        description: 'Worried I came across poorly in the client call. Need to ask for feedback tomorrow.',
        category_id: mockCategories[1].id, // Midnight Thoughts
        type_id: mockTypes[2].id, // Worry
        mood_id: mockMoods[2].id, // Low
      });
    });

    it('resolves the new entry', async () => {
      const { useEntries } = await import('@/core/entries');
      const { createEntry } = useEntries();
      const entry = await createEntry({
        date: '2024-10-03',
        entry_time: 1727996400000, // late night
        subject: "Can't stop replaying the meeting",
        description: 'Worried I came across poorly in the client call. Need to ask for feedback tomorrow.',
        category_id: mockCategories[1].id, // Midnight Thoughts
        type_id: mockTypes[2].id, // Worry
        mood_id: mockMoods[2].id, // Low
      });
      expect(entry).toEqual({
        id: 42,
        created_at: 1785696012523,
        user_id: 42,
        date: '2024-10-03',
        entry_time: 1727996400000, // late night
        subject: "Can't stop replaying the meeting",
        description: 'Worried I came across poorly in the client call. Need to ask for feedback tomorrow.',
        category_id: mockCategories[1].id, // Midnight Thoughts
        type_id: mockTypes[2].id, // Worry
        mood_id: mockMoods[2].id, // Low
      });
    });
  });
});
