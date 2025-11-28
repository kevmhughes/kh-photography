// env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SANITY_STUDIO_API_PROJECT_ID: string
  readonly SANITY_STUDIO_API_DATASET: string
  readonly SANITY_WRITE_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
