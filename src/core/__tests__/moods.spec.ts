import { mockMoods } from '@/core/api/journal/__mocks__/mock-data';
import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/api/journal/journal-api');

describe('useMoods', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('on load', () => {
    it('loads the moods if they are not already loaded', async () => {
      const { getMoods } = await import('@/core/api/journal/journal-api');
      vi.mocked(getMoods).mockResolvedValue(mockMoods);

      const { useMoods } = await import('@/core/moods');
      const { moods } = useMoods();
      await flushPromises();
      useMoods();
      await flushPromises();
      expect(getMoods).toHaveBeenCalledTimes(1);
      expect(moods.value).toEqual(mockMoods);
    });

    it('sets loading to true while fetching and false after the fetch completes', async () => {
      const { getMoods } = await import('@/core/api/journal/journal-api');
      let resolveMoods!: (value: typeof mockMoods) => void;
      vi.mocked(getMoods).mockReturnValue(
        new Promise((resolve) => {
          resolveMoods = resolve;
        }),
      );

      const { useMoods } = await import('@/core/moods');
      const { loading } = useMoods();

      expect(loading.value).toBe(true);

      resolveMoods(mockMoods);
      await flushPromises();

      expect(loading.value).toBe(false);
    });

    it('sets error when fetching moods fails', async () => {
      const { getMoods } = await import('@/core/api/journal/journal-api');
      const fetchError = new Error('Failed to fetch moods');
      vi.mocked(getMoods).mockRejectedValue(fetchError);

      const { useMoods } = await import('@/core/moods');
      const { error, loading } = useMoods();
      expect(loading.value).toBe(true);

      await flushPromises();

      expect(error.value).toBe(fetchError);
      expect(loading.value).toBe(false);
    });
  });
});
