
const API_BASE_URL = {
    development: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    production: import.meta.env.VITE_API_BASE_URL || 'https://backend.appmars.in',
  };
  
  export const API_URL = process.env.NODE_ENV === 'production'
    ? API_BASE_URL.production
    : API_BASE_URL.development;
  