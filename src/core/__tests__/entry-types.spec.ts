import { mockTypes } from '@/core/api/journal/__mocks__/mock-data';
import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/api/journal/journal-api');

describe('useEntryTypes', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('on load', () => {
    it('loads the entry types if they are not already loaded', async () => {
      const { getEntryTypes } = await import('@/core/api/journal/journal-api');
      vi.mocked(getEntryTypes).mockResolvedValue(mockTypes);

      const { useEntryTypes } = await import('@/core/entry-types');
      const { entryTypes } = useEntryTypes();
      await flushPromises();
      useEntryTypes();
      await flushPromises();
      expect(getEntryTypes).toHaveBeenCalledTimes(1);
      expect(entryTypes.value).toEqual(mockTypes);
    });

    it('sets loading to true while fetching and false after the fetch completes', async () => {
      const { getEntryTypes } = await import('@/core/api/journal/journal-api');
      let resolveEntryTypes!: (value: typeof mockTypes) => void;
      vi.mocked(getEntryTypes).mockReturnValue(
        new Promise((resolve) => {
          resolveEntryTypes = resolve;
        }),
      );

      const { useEntryTypes } = await import('@/core/entry-types');
      const { loading } = useEntryTypes();

      expect(loading.value).toBe(true);

      resolveEntryTypes(mockTypes);
      await flushPromises();

      expect(loading.value).toBe(false);
    });

    it('sets error when fetching entry types fails', async () => {
      const { getEntryTypes } = await import('@/core/api/journal/journal-api');
      const fetchError = new Error('Failed to fetch entry types');
      vi.mocked(getEntryTypes).mockRejectedValue(fetchError);

      const { useEntryTypes } = await import('@/core/entry-types');
      const { error, loading } = useEntryTypes();
      expect(loading.value).toBe(true);

      await flushPromises();

      expect(error.value).toBe(fetchError);
      expect(loading.value).toBe(false);
    });
  });
});
