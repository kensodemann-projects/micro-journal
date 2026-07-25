import { ref, type Ref } from 'vue';
import type { Mood } from './api/journal/types';
import { getMoods } from './api/journal/journal-api';

const moods = ref<Mood[]>([]);
let loadingPromise: Promise<void | Mood[]> | null = null;
const loading = ref(false);
const error = ref<Error | null>(null);

const loadMoods = (): void => {
  if (moods.value.length === 0 && !loadingPromise) {
    loading.value = true;
    error.value = null;
    loadingPromise = getMoods()
      .then((m) => (moods.value = m))
      .catch((err) => {
        error.value = err;
      })
      .finally(() => {
        loadingPromise = null;
        loading.value = false;
      });
  }
};

export type UseMoods = {
  moods: Ref<Mood[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
};

export const useMoods = (): UseMoods => {
  loadMoods();

  return {
    moods,
    loading,
    error,
  };
};
