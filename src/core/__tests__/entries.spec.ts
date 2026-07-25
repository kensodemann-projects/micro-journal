import { mockEntries } from '@/core/api/journal/__mocks__/mock-data';
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
  });
});
