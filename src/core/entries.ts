import { ref, type Ref } from 'vue';
import type { Entry } from './api/journal/types';
import { getEntries } from './api/journal/journal-api';
import { getToken } from './api/auth/token-storage';

const entries = ref<Entry[]>([]);
let loadingPromise: Promise<void | Entry[]> | null = null;
const loading = ref(false);
const error = ref<Error | null>(null);

const loadEntriesIfRequired = (): void => {
  if (entries.value.length === 0 && !loadingPromise) {
    const token = getToken();
    if (token) {
      loadEntries(token);
    }
  }
};

const loadEntries = (token: string): void => {
  loading.value = true;
  error.value = null;
  loadingPromise = getEntries(token)
    .then((ents) => (entries.value = ents))
    .catch((err) => {
      error.value = err;
    })
    .finally(() => {
      loadingPromise = null;
      loading.value = false;
    });
};

export type UseEntries = {
  entries: Ref<Entry[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
};

export const useEntries = (): UseEntries => {
  loadEntriesIfRequired();

  return {
    entries,
    loading,
    error,
  };
};
