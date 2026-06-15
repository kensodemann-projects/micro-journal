/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="vite-plugin-vue-layouts-next/client" />

interface ImportMetaEnv {
  readonly VITE_XANO_AUTH_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
