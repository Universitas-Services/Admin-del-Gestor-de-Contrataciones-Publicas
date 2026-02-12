import { apiClient } from '@/lib/apiClient';
import type { CreateEnteFormData } from '@/schemas/ente.schema';

export interface CreateEnteResponse {
  message: string;
}

export interface EnteSinSupervisor {
  id: string;
  nombre: string;
  rif: string | null;
  estado: string | null;
  municipio: string | null;
}

/**
 * Servicio de gestión de Entes
 * Contiene todas las llamadas HTTP relacionadas con Entes
 *
 * Responsabilidades:
 * - Definir funciones para cada endpoint de Entes
 * - Usar apiClient (con autenticación automática vía interceptor)
 * - Retornar la data del backend
 * - Manejar errores específicos del endpoint
 */
export const enteService = {
  /**
   * Crea un nuevo Ente Público con su Admin Ente asociado
   * Endpoint privado - requiere autenticación (token en header)
   *
   * @param data - Datos del formulario validados con Zod
   * @returns Promise con la respuesta del servidor
   * @throws Error si la petición falla
   */
  create: async (data: CreateEnteFormData): Promise<CreateEnteResponse> => {
    try {
      const response = await apiClient.post<CreateEnteResponse>('/entes', data);
      return response.data;
    } catch (error: unknown) {
      // Manejo de error 403 - No autorizado (solo UNIVERSITAS puede crear Entes)
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response &&
        error.response.status === 403
      ) {
        throw new Error('No autorizado (solo UNIVERSITAS)');
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
        throw new Error(responseData.message || 'Error al crear el Ente');
      }

      // Error de red u otro tipo
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Obtiene la lista de Entes que no tienen Supervisor asignado
   * Endpoint privado - requiere autenticación (token en header)
   *
   * @returns Promise con array de Entes disponibles
   * @throws Error si la petición falla
   */
  getEntesSinSupervisor: async (): Promise<EnteSinSupervisor[]> => {
    try {
      const response = await apiClient.get<EnteSinSupervisor[]>(
        '/entes/sin-supervisor'
      );
      return response.data;
    } catch (error: unknown) {
      // Manejo genérico de errores
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
          responseData.message || 'Error al obtener Entes disponibles'
        );
      }

      // Error de red u otro tipo
      throw new Error('Error de conexión con el servidor');
    }
  },
};
