const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  DEV_MODE: import.meta.env.DEV,
} as const;

export default config;