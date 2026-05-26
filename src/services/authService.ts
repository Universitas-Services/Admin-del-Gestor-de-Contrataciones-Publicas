import { axiosPublic, apiClient } from '@/lib/apiClient';
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

  /**
   * Cambia la contraseña de un usuario de menor jerarquía
   * Solo administradores (UNIVERSITAS o ADMIN_ENTE) pueden usar este endpoint
   *
   * @param data - targetUserId, currentPassword, newPassword
   * @returns Promise con la respuesta del servidor
   */
  changeUserPassword: async (data: {
    targetUserId: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>(
        '/auth/change-user-password',
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response
      ) {
        const responseData = error.response.data as { message?: string };
        throw new Error(
          responseData.message || 'Error al cambiar la contraseña'
        );
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};
