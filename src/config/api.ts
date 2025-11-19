// src/config/api.ts
const HOST = import.meta.env.VITE_API_HOST;
const HOST_SINCO = import.meta.env.VITE_API_HOST_SINCO;

// 📌 Endpoints de la API
export const BASE_URL = HOST + "api/";
export const BASE_SICO = HOST_SINCO + "api/";

// 📌 URLs para recursos
export const BASE_URL_IMAGENES = HOST;
export const FILES_URL = HOST + "storage/";

// 📌 Claves para almacenamiento (LOCALSTORAGE CIFRADO)
export const API_KEY = "37127b80-d847-4394-bfb1-75227fdbe5a7";
export const KEY_EMPRESA = "i_eMb71jA";
export const KEY_ROL = "xvhur_uor";
export const KEY_USER = "userData";
export const KEY_USER_DATA = "userData";
export const KEY_ENCRYPTED_USER_DATA = "encryptedUserData"; // 👈 Nueva clave para datos cifrados

// 📌 Endpoints específicos
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    REFRESH_TOKEN: '/api/refresh',
    PROFILE: '/api/user-profile',
  },
  DASHBOARD: {
    STATS: '/api/info-dashboard-card',
  },
  USERS: '/users',
};

