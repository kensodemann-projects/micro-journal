import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockCategories } from '@/core/api/journal/__mocks__/mock-data';

vi.mock('@/core/api/auth/token-storage');
vi.mock('@/core/api/journal/journal-api');

describe('useCategories', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

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
