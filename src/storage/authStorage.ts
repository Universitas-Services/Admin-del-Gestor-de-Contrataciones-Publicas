import { User } from '@/types/auth.types';
import {
  setAuthCookies,
  clearAuthCookies,
  getAuthToken,
  getUserSession,
} from '@/utils/cookies';

/**
 * Storage de autenticación
 * Centraliza toda la lógica de persistencia de tokens y datos de usuario
 *
 * Responsabilidades:
 * - Guardar/leer/eliminar tokens en cookies
 * - Abstraer la capa de persistencia
 * - Validaciones básicas de sesión
 */
export const authStorage = {
  /**
   * Guarda el token y datos del usuario en cookies
   * @param token - JWT access token
   * @param user - Datos del usuario
   */
  saveAuth: (token: string, user: User): void => {
    setAuthCookies(token, user);
  },

  /**
   * Obtiene el token guardado en cookies
   * @returns Token o null si no existe
   */
  getToken: (): string | null => {
    return getAuthToken();
  },

  /**
   * Obtiene los datos del usuario guardados en cookies
   * @returns Usuario o null si no existe
   */
  getUser: (): User | null => {
    return getUserSession();
  },

  /**
   * Elimina el token y datos del usuario de las cookies
   */
  clearAuth: (): void => {
    clearAuthCookies();
  },

  /**
   * Verifica si hay una sesión válida guardada
   * @returns true si existe token y usuario en cookies
   */
  hasValidSession: (): boolean => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    return !!(token && user);
  },

  /**
   * Verifica si el usuario guardado tiene un rol específico
   * @param role - Rol a verificar
   * @returns true si el usuario tiene ese rol
   */
  hasRole: (role: string): boolean => {
    const user = authStorage.getUser();
    return user?.rol === role;
  },
};

// Re-exportar User para facilitar imports
export type { User };
