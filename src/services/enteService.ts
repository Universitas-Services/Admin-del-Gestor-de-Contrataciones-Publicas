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

export interface DashboardMetrics {
  totalEntes: number;
  totalSupervisores: number;
  completados: number;
  porCompletar: number;
}

export interface EnteListItem {
  id: string;
  universitasId: string;
  nombre: string;
  rif: string;
  siglas: string | null;
  logoUrl: string | null;
  direccionFiscal: string | null;
  estado: string | null;
  municipio: string | null;
  parroquia: string | null;
  nombreUnidadAdminFinanciera: string | null;
  nombreUnidadTecnologia: string | null;
  nombreUnidadContratante: string | null;
  organoAdscripcion: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  datosConfirmados: boolean;
  ciudad: string | null;
  _count: {
    usuarios: number;
    expedientes: number;
    proveedores: number;
  };
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

  /**
   * Obtiene la lista completa de Entes
   * Endpoint privado - requiere autenticación
   *
   * @param token - Token JWT opcional (necesario para Server Components)
   * @returns Promise con array de Entes
   * @throws Error si la petición falla
   */
  getEntes: async (token?: string): Promise<EnteListItem[]> => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await apiClient.get<EnteListItem[]>('/entes', config);
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
        throw new Error(responseData.message || 'Error al obtener Entes');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Obtiene los detalles de un Ente por su ID
   * Endpoint privado - requiere autenticación
   *
   * @param id - ID del Ente
   * @param token - Token JWT opcional (necesario para Server Components)
   * @returns Promise con los detalles del Ente
   * @throws Error si la petición falla
   */
  getEnteById: async (id: string, token?: string): Promise<EnteDetail> => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await apiClient.get<EnteDetail>(`/entes/${id}`, config);
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
          responseData.message || 'Error al obtener los detalles del Ente'
        );
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Obtiene las métricas del dashboard
   * Endpoint privado - requiere autenticación
   *
   * @param token - Token JWT opcional (necesario para Server Components)
   * @returns Promise con las métricas del dashboard
   * @throws Error si la petición falla
   */
  getDashboardMetrics: async (token?: string): Promise<DashboardMetrics> => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await apiClient.get<DashboardMetrics>(
        '/entes/dashboard/metrics',
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
          responseData.message || 'Error al obtener métricas del dashboard'
        );
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};

export interface EnteDetail {
  id: string;
  universitasId: string;
  nombre: string;
  rif: string;
  siglas: string | null;
  logoUrl: string | null;
  direccionFiscal: string | null;
  estado: string | null;
  municipio: string | null;
  parroquia: string | null;
  nombreUnidadAdminFinanciera: string | null;
  nombreUnidadTecnologia: string | null;
  nombreUnidadContratante: string | null;
  organoAdscripcion: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  datosConfirmados: boolean;
  ciudad: string | null;
  usuarios: unknown[];
  maximasAutoridades: unknown[];
  comisiones: unknown[];
}
