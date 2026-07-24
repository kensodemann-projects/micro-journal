import type { Category } from '@/core/api/journal/types';
import { mockCategories } from '@/core/api/journal/__mocks__/mock-data';
import { vi } from 'vitest';
import { ref, type Ref } from 'vue';

const createCategory = vi.fn().mockResolvedValue({
  id: 314,
  created_at: 1716700800000,
  name: 'New Category',
});
const updateCategory = vi.fn().mockResolvedValue({
  id: 1,
  created_at: 1693526400000,
  name: 'Updated Category',
});

type UseCategories = {
  categories: Ref<Category[]>;
  createCategory: (name: string) => Promise<Category>;
  updateCategory: (id: number, name: string) => Promise<Category>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
};

export const useCategories: () => UseCategories = () => {
  return {
    categories: ref<Category[]>(mockCategories),
    createCategory,
    updateCategory,
    loading: ref(false),
    error: ref<Error | null>(null),
  };
};
