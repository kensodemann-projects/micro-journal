import { ref } from 'vue';
import type { Category } from './api/journal/types';
import { getCategories } from './api/journal/journal-api';

const categories = ref<Category[]>([]);

const loadCategories = async () => {
  if (categories.value.length === 0) {
    categories.value = await getCategories('fake-token');
  }
};

export const useCategories = () => {
  loadCategories();

  return {
    categories,
  };
};
