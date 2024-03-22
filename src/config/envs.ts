

export const envs =  {
    API_URL: import.meta.env.VITE_API_URL || '',
    SECONDS_BLOCKED_PROCESS: +import.meta.env.VITE_SECONDS_BLOCKED_PROCESS || 8
}
