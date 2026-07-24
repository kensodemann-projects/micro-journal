import { ref } from 'vue';
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

export const useCategories = () => {
  loadCategories();

  const createCategory = async (name: string): Promise<Category> => {
    const category = await saveCategory(getToken()!, { name });
    categories.value = await getCategories();
    return category;
  };

  return {
    categories,
    createCategory,
    loading,
    error,
  };
};
