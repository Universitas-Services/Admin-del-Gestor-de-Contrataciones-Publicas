import { axiosPublic } from '@/lib/apiClient';
import { LoginCredentials, LoginResponse } from '@/types/auth.types';

/**
 * Servicio de autenticación
 * Contiene todas las llamadas HTTP relacionadas con autenticación
 *
 * Responsabilidades:
 * - Definir funciones para cada endpoint de auth
 * - Usar el cliente HTTP apropiado (público/privado)
 * - Retornar la data del backend
 * - Transformar data si es necesario
 */
export const authService = {
  /**
   * Inicia sesión en el backend
   * @param credentials - Email y password del usuario
   * @returns Token de acceso y datos del usuario
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosPublic.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Cierra la sesión del usuario
   */
  // Por ahora, logout es solo del lado del cliente (limpiar cookies y estado)
  logout: async (): Promise<void> => {
    // Por ahora, logout es solo del lado del cliente
    // (limpiar cookies y estado)
  },
};
