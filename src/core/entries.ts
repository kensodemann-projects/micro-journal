import { ref, type Ref } from 'vue';
import type { EditableEntry, Entry } from './api/journal/types';
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
  clearEntries: () => void;
  createEntry: (entry: EditableEntry) => Promise<Entry>;
  updateEntry: (id: number, entry: EditableEntry) => Promise<Entry>;
};

export const useEntries = (): UseEntries => {
  loadEntriesIfRequired();

  const clearEntries = (): void => {
    entries.value = [];
  };

  const createEntry = async (entry: EditableEntry): Promise<Entry> => ({ ...entry, id: 0, created_at: 0, user_id: 0 });
  const updateEntry = async (id: number, entry: EditableEntry): Promise<Entry> => ({
    ...entry,
    id,
    created_at: 0,
    user_id: 0,
  });

  return {
    entries,
    loading,
    error,
    clearEntries,
    createEntry,
    updateEntry,
  };
};
