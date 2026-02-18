import { apiClient } from '@/lib/apiClient';
import type { CreateSupervisorFormData } from '@/schemas/supervisor.schema';

export interface CreateSupervisorResponse {
  message: string;
}

/**
 * Servicio de gestión de Supervisores
 * Contiene todas las llamadas HTTP relacionadas con Supervisores
 *
 * Responsabilidades:
 * - Definir funciones para cada endpoint de Supervisores
 * - Usar apiClient (con autenticación automática vía interceptor)
 * - Retornar la data del backend
 * - Manejar errores específicos del endpoint
 */
export const supervisorService = {
  /**
   * Crea un nuevo Supervisor con su Organización asociada
   * Endpoint privado - requiere autenticación (token en header)
   *
   * @param data - Datos del formulario validados con Zod
   * @returns Promise con la respuesta del servidor
   * @throws Error si la petición falla
   */
  create: async (
    data: CreateSupervisorFormData
  ): Promise<CreateSupervisorResponse> => {
    try {
      const response = await apiClient.post<CreateSupervisorResponse>(
        '/supervisores',
        data
      );
      return response.data;
    } catch (error: unknown) {
      // Manejo de error 400 - Algunos Entes especificados no existen
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response &&
        error.response.status === 400
      ) {
        throw new Error('Algunos Entes especificados no existen');
      }

      // Manejo de error 409 - Email ya registrado
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response &&
        error.response.status === 409
      ) {
        throw new Error('Email ya registrado');
      }

      // Otros errores del servidor
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response
      ) {
        const responseData = error.response.data as { message?: string };
        throw new Error(responseData.message || 'Error al crear el Supervisor');
      }

      // Error de red u otro tipo
      throw new Error('Error de conexión con el servidor');
    }
  },
};
