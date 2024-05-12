/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SECONDS_BLOCKED_PROCESS: number;
  readonly VITE_MAX_NUMBER_OF_PROCESSES_TO_REQUEST: number;
  readonly VITE_TIMER_VELOCITY: number;
  readonly VITE_PAGE_SIZE: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
