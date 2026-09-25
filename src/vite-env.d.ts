/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CATALOG_SOURCE?: "local" | "graph";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
