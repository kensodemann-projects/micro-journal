import { getCategories } from '@/core/api/journal/journal-api';
import { flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCategories } from '@/core/categories';
import { mockCategories } from '@/core/api/journal/__mocks__/mock-data';

vi.mock('@/core/api/auth/token-storage');
vi.mock('@/core/api/journal/journal-api');

describe('useCategories', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads the categories if they are not already loaded', async () => {
    const { categories } = useCategories();
    await flushPromises();
    useCategories();
    await flushPromises();
    expect(getCategories).toHaveBeenCalledTimes(1);
    expect(categories.value).toEqual(mockCategories);
  });
});
