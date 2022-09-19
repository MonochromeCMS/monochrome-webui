/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_PATH: string;
  readonly VITE_MEDIA_PATH: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
