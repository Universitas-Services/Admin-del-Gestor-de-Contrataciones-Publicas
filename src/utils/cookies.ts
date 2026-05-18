import { User } from '@/types/auth.types';

/**
 * Utilidades para manejo de cookies sin dependencias externas
 * Estas funciones funcionan tanto en cliente (document.cookie) como en servidor (headers)
 */

/**
 * Establece las cookies de autenticación en el cliente
 * @param token - JWT access token
 * @param user - Datos del usuario
 */
export const setAuthCookies = (token: string, user: User): void => {
  if (typeof document === 'undefined') return;

  const maxAge = 60 * 60 * 24 * 7; // 7 días en segundos
  const secure = process.env.NODE_ENV === 'production';
  const cookieOptions = `Max-Age=${maxAge}; Path=/; SameSite=Strict${secure ? '; Secure' : ''}`;

  // Guardar access_token
  document.cookie = `access_token=${token}; ${cookieOptions}`;

  // Guardar user_session (datos del usuario en JSON)
  const userJSON = JSON.stringify(user);
  document.cookie = `user_session=${encodeURIComponent(userJSON)}; ${cookieOptions}`;
};

/**
 * Obtiene el access_token desde las cookies
 * @returns Token o null si no existe
 */
export const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; access_token=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
};

/**
 * Obtiene la sesión del usuario desde las cookies
 * @returns Objeto User o null si no existe
 */
export const getUserSession = (): User | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; user_session=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    if (!cookieValue) return null;

    try {
      const decoded = decodeURIComponent(cookieValue);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  return null;
};

/**
 * Limpia todas las cookies de autenticación
 */
export const clearAuthCookies = (): void => {
  if (typeof document === 'undefined') return;

  const pastDate = 'Thu, 01 Jan 1970 00:00:00 UTC';
  document.cookie = `access_token=; expires=${pastDate}; Path=/; SameSite=Strict`;
  document.cookie = `user_session=; expires=${pastDate}; Path=/; SameSite=Strict`;
};

/**
 * Verifica si existe una sesión activa
 * @returns true si hay token y sesión válida
 */
export const hasActiveSession = (): boolean => {
  const token = getAuthToken();
  const user = getUserSession();

  return !!(token && user && user.rol === 'UNIVERSITAS');
};
