import axios from 'axios';
import { authStorage } from '@/storage/authStorage';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Cliente Axios público para endpoints sin autenticación
 * Usado en: Login, y otras rutas públicas
 */
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permite enviar/recibir cookies
});

/**
 * Cliente Axios privado para endpoints protegidos
 * Automáticamente adjunta el token de autenticación desde las cookies
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Interceptor de Request: Adjunta el token de autorización
 * Lee el token desde authStorage y lo incluye en el header
 */
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = authStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de Response: Maneja errores 401 (No autorizado)
 * Si el token expiró o es inválido, limpia la sesión y redirige al login
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Usar authStorage para limpiar la sesión
        authStorage.clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
