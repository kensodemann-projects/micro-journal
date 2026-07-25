import { ref, type Ref } from 'vue';
import { getEntryTypes } from './api/journal/journal-api';
import type { EntryType } from './api/journal/types';

const entryTypes = ref<EntryType[]>([]);
let loadingPromise: Promise<void | EntryType[]> | null = null;
const loading = ref(false);
const error = ref<Error | null>(null);

const loadEntryTypes = (): void => {
  if (entryTypes.value.length === 0 && !loadingPromise) {
    loading.value = true;
    error.value = null;
    loadingPromise = getEntryTypes()
      .then((cats) => (entryTypes.value = cats))
      .catch((err) => {
        error.value = err;
      })
      .finally(() => {
        loadingPromise = null;
        loading.value = false;
      });
  }
};

export type UseEntryTypes = {
  entryTypes: Ref<EntryType[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
};

export const useEntryTypes = (): UseEntryTypes => {
  loadEntryTypes();

  return {
    entryTypes,
    loading,
    error,
  };
};
