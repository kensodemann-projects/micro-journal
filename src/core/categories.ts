import { ref, type Ref } from 'vue';
import type { Category } from './api/journal/types';
import { getCategories, saveCategory } from './api/journal/journal-api';
import { getToken } from './api/auth/token-storage';

const categories = ref<Category[]>([]);
let loadingPromise: Promise<void | Category[]> | null = null;
const loading = ref(false);
const error = ref<Error | null>(null);

const loadCategories = (): void => {
  if (categories.value.length === 0 && !loadingPromise) {
    loading.value = true;
    loadingPromise = getCategories()
      .then((cats) => (categories.value = cats))
      .catch((err) => {
        error.value = err;
      })
      .finally(() => {
        loadingPromise = null;
        loading.value = false;
      });
  }
};

export type UseCategories = {
  categories: Ref<Category[]>;
  createCategory: (name: string) => Promise<Category>;
  updateCategory: (id: number, name: string) => Promise<Category>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
};

export const useCategories = (): UseCategories => {
  loadCategories();

  const createCategory = async (name: string): Promise<Category> => {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }
    const category = await saveCategory(token, { name });
    categories.value = await getCategories();
    return category;
  };

  const updateCategory = async (id: number, name: string): Promise<Category> => {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }
    const category = await saveCategory(token, { id, name });
    categories.value = await getCategories();
    return category;
  };

  return {
    categories,
    createCategory,
    updateCategory,
    loading,
    error,
  };
};
