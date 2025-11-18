export const APP_CONFIG = {
  APP_NAME: 'Mi App',
  API_BASE_URL: import.meta.env.VITE_API_HOST || 'http://localhost:3000/api',
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
};