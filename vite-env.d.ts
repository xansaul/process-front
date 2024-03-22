/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly  VITE_API_URL: string,
    readonly  VITE_SECONDS_BLOCKED_PROCESS: number
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
