// eslint-disable-next-line @typescript-eslint/no-require-imports
global.ResizeObserver = require('resize-observer-polyfill');

function createInMemoryStorage(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return [...store.keys()][index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

// Node 22+ requires --localstorage-file for global localStorage; jsdom does not always
// expose window.localStorage in worker threads. Use per-worker in-memory storage in tests.
const testLocalStorage = createInMemoryStorage();
Object.defineProperty(globalThis, 'localStorage', {
  value: testLocalStorage,
  writable: true,
  configurable: true,
});
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: testLocalStorage,
    writable: true,
    configurable: true,
  });
}

// Mock visualViewport for Vuetify's VOverlay/VDialog components
Object.defineProperty(window, 'visualViewport', {
  writable: true,
  value: {
    addEventListener: () => {},
    removeEventListener: () => {},
    width: window.innerWidth,
    height: window.innerHeight,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    scale: 1,
  },
});
