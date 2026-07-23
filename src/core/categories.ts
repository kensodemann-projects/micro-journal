import { ref } from 'vue';
import type { Category } from './api/journal/types';
import { getCategories } from './api/journal/journal-api';

const categories = ref<Category[]>([]);
let loadingPromise: Promise<Category[]> | null = null;
const loading = ref(false);
const error = ref<Error | null>(null);

const loadCategories = (): void => {
  if (categories.value.length === 0 && !loadingPromise) {
    loadingPromise = getCategories()
      .then((cats) => (categories.value = cats))
      .finally(() => {
        loadingPromise = null;
      });
  }
};

export const useCategories = () => {
  loadCategories();

  return {
    categories,
    loading,
    error,
  };
};
