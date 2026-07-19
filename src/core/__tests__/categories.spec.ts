import { getCategories } from '@/core/api/journal/journal-api';
import { flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCategories } from '../categories';

vi.mock('@/core/api/auth/token-storage');
vi.mock('@/core/api/journal/journal-api');

describe('useCategories', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads the categories if they are not already loaded', async () => {
    useCategories();
    await flushPromises();
    useCategories();
    await flushPromises();
    expect(getCategories).toHaveBeenCalledTimes(1);
  });
});
