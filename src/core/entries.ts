import { ref, type Ref } from 'vue';
import type { Entry } from './api/journal/types';
import { getEntries } from './api/journal/journal-api';

const entries = ref<Entry[]>([]);
let loadingPromise: Promise<void | Entry[]> | null = null;
const loading = ref(false);
const error = ref<Error | null>(null);

const loadEntries = (): void => {
  if (entries.value.length === 0 && !loadingPromise) {
    loading.value = true;
    error.value = null;
    loadingPromise = getEntries('123')
      .then((ents) => (entries.value = ents))
      .catch((err) => {
        error.value = err;
      })
      .finally(() => {
        loadingPromise = null;
        loading.value = false;
      });
  }
};

export type UseEntries = {
  entries: Ref<Entry[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
};

export const useEntries = (): UseEntries => {
  loadEntries();

  return {
    entries,
    loading,
    error,
  };
};
