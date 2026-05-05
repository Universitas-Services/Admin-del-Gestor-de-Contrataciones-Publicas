import { apiClient } from '@/lib/apiClient';
import type { CreateSupervisorFormData } from '@/schemas/supervisor.schema';

export interface CreateSupervisorResponse {
  message: string;
}

export interface SupervisorListItem {
  id: string;
  nombre: string;
  email: string;
  activo: boolean;
  cantidadEntesAsignados: number;
  createdAt: string;
}

export interface SupervisorDetail {
  id: string;
  nombre: string;
  email: string;
  activo: boolean;
  rol: string;
  entesAsignados: {
    id: string;
    nombre: string;
    siglas: string;
    rif: string;
    asignadoEn: string;
  }[];
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

  /**
   * Obtiene la lista completa de Supervisores
   * Endpoint privado - requiere autenticación
   *
   * @param token - Token JWT opcional (necesario para Server Components)
   * @returns Promise con array de Supervisores
   * @throws Error si la petición falla
   */
  getSupervisores: async (token?: string): Promise<SupervisorListItem[]> => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await apiClient.get<SupervisorListItem[]>(
        '/supervisores',
        config
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
          responseData.message || 'Error al obtener Supervisores'
        );
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Obtiene los detalles de un Supervisor por su ID
   * Endpoint privado - requiere autenticación
   *
   * @param id - ID del Supervisor
   * @param token - Token JWT opcional (necesario para Server Components)
   * @returns Promise con los detalles del Supervisor
   * @throws Error si la petición falla
   */
  getSupervisorById: async (
    id: string,
    token?: string
  ): Promise<SupervisorDetail> => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await apiClient.get<SupervisorDetail>(
        `/supervisores/${id}`,
        config
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
          responseData.message || 'Error al obtener los detalles del Supervisor'
        );
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};
