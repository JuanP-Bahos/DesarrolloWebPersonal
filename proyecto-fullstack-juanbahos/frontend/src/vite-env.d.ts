/// <reference types="vite/client" />

/**
 * Le decimos a TypeScript qué variables de entorno existen.
 * Así `import.meta.env.VITE_API_URL` tiene tipo y autocompletado.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
