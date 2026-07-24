import { mockCategories } from '@/core/api/journal/__mocks__/mock-data';
import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/api/auth/token-storage');
vi.mock('@/core/api/journal/journal-api');

describe('useCategories', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('on load', () => {
    it('loads the categories if they are not already loaded', async () => {
      const { getCategories } = await import('@/core/api/journal/journal-api');
      vi.mocked(getCategories).mockResolvedValue(mockCategories);

      const { useCategories } = await import('@/core/categories');
      const { categories } = useCategories();
      await flushPromises();
      useCategories();
      await flushPromises();
      expect(getCategories).toHaveBeenCalledTimes(1);
      expect(categories.value).toEqual(mockCategories);
    });

    it('sets loading to true while fetching and false after the fetch completes', async () => {
      const { getCategories } = await import('@/core/api/journal/journal-api');
      let resolveCategories!: (value: typeof mockCategories) => void;
      vi.mocked(getCategories).mockReturnValue(
        new Promise((resolve) => {
          resolveCategories = resolve;
        }),
      );

      const { useCategories } = await import('@/core/categories');
      const { loading } = useCategories();

      expect(loading.value).toBe(true);

      resolveCategories(mockCategories);
      await flushPromises();

      expect(loading.value).toBe(false);
    });

    it('sets error when fetching categories fails', async () => {
      const { getCategories } = await import('@/core/api/journal/journal-api');
      const fetchError = new Error('Failed to fetch categories');
      vi.mocked(getCategories).mockRejectedValue(fetchError);

      const { useCategories } = await import('@/core/categories');
      const { error, loading } = useCategories();
      expect(loading.value).toBe(true);

      await flushPromises();

      expect(error.value).toBe(fetchError);
      expect(loading.value).toBe(false);
    });
  });

  describe('create category', () => {
    describe('when a token exists', () => {
      beforeEach(async () => {
        const { getToken } = await import('@/core/api/auth/token-storage');
        vi.mocked(getToken).mockReturnValue('123');
      });

      it('saves the new category', async () => {
        const { saveCategory } = await import('@/core/api/journal/journal-api');
        vi.mocked(saveCategory).mockResolvedValue({
          id: 314,
          created_at: 1716700800000,
          name: 'New Category',
        });

        const { useCategories } = await import('@/core/categories');
        const { createCategory } = useCategories();
        await flushPromises();
        createCategory('New Category');
        expect(saveCategory).toHaveBeenCalledWith('123', {
          name: 'New Category',
        });
      });

      it('resolves the new category', async () => {
        const { saveCategory } = await import('@/core/api/journal/journal-api');
        vi.mocked(saveCategory).mockResolvedValue({
          id: 314,
          created_at: 1716700800000,
          name: 'New Category',
        });

        const { useCategories } = await import('@/core/categories');
        const { createCategory } = useCategories();
        await flushPromises();
        const category = await createCategory('New Category');
        expect(category).toEqual({
          id: 314,
          created_at: 1716700800000,
          name: 'New Category',
        });
      });

      it('calls getCategories as part of the create process', async () => {
        const { getCategories, saveCategory } = await import('@/core/api/journal/journal-api');
        vi.mocked(saveCategory).mockResolvedValue({
          id: 314,
          created_at: 1716700800000,
          name: 'New Category',
        });
        vi.mocked(getCategories).mockResolvedValue(mockCategories);

        const { useCategories } = await import('@/core/categories');
        const { createCategory } = useCategories();
        await flushPromises();
        vi.mocked(getCategories).mockClear();

        await createCategory('New Category');
        expect(getCategories).toHaveBeenCalledTimes(1);
      });

      describe('when saving fails', () => {
        it('rejects the promise', async () => {
          const { saveCategory } = await import('@/core/api/journal/journal-api');
          vi.mocked(saveCategory).mockRejectedValue(new Error('Failed to save category'));

          const { useCategories } = await import('@/core/categories');
          const { createCategory } = useCategories();
          await flushPromises();
          await expect(createCategory('New Category')).rejects.toThrow('Failed to save category');
        });

        it('does not call getCategories', async () => {
          const { getCategories, saveCategory } = await import('@/core/api/journal/journal-api');
          vi.mocked(saveCategory).mockRejectedValue(new Error('Failed to save category'));
          vi.mocked(getCategories).mockResolvedValue(mockCategories);

          const { useCategories } = await import('@/core/categories');
          const { createCategory } = useCategories();
          await flushPromises();
          vi.mocked(getCategories).mockClear();
          await expect(createCategory('New Category')).rejects.toThrow();
          expect(getCategories).not.toHaveBeenCalled();
        });
      });
    });

    describe('when a token does not exist', () => {
      beforeEach(async () => {
        const { getToken } = await import('@/core/api/auth/token-storage');
        vi.mocked(getToken).mockReturnValue(null);
      });

      it('rejects the promise', async () => {
        const { useCategories } = await import('@/core/categories');
        const { createCategory } = useCategories();
        await flushPromises();
        await expect(createCategory('New Category')).rejects.toThrow('No token found');
      });

      it('does not call saveCategory or getCategories', async () => {
        const { getCategories, saveCategory } = await import('@/core/api/journal/journal-api');
        vi.mocked(saveCategory).mockResolvedValue({
          id: 314,
          created_at: 1716700800000,
          name: 'New Category',
        });

        const { useCategories } = await import('@/core/categories');
        const { createCategory } = useCategories();
        await flushPromises();
        vi.mocked(getCategories).mockClear();
        await expect(createCategory('New Category')).rejects.toThrow();
        expect(saveCategory).not.toHaveBeenCalled();
        expect(getCategories).not.toHaveBeenCalled();
      });
    });
  });
});
