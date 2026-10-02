import { apiClient } from '@/lib/apiClient';
import type { NormativaFormData } from '@/schemas/normativa.schema';

export interface Normativa {
  id: string;
  textoNormativaCompleto: string;
  indActivo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NormativaListParams {
  page?: number;
  limit?: number;
  search?: string;
  indActivo?: boolean;
}

export interface NormativaListMeta {
  total: number;
  page: number;
  lastPage: number;
}

export interface NormativaListResponse {
  data: Normativa[];
  meta: NormativaListMeta;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const responseData = error.response.data as { message?: string };
    return responseData.message || fallback;
  }
  return 'Error de conexión con el servidor';
}

export const normativaService = {
  getAll: async (
    params: NormativaListParams = {}
  ): Promise<NormativaListResponse> => {
    try {
      const response = await apiClient.get<NormativaListResponse>(
        '/biblioteca/normativa-global',
        {
          params: {
            page: params.page ?? 1,
            limit: params.limit ?? 10,
            ...(params.search ? { search: params.search } : {}),
            ...(params.indActivo !== undefined
              ? { indActivo: params.indActivo }
              : {}),
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Error al obtener normativas'));
    }
  },

  getById: async (id: string): Promise<Normativa> => {
    try {
      const response = await apiClient.get<Normativa>(
        `/biblioteca/normativa-global/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Error al obtener la normativa'));
    }
  },

  create: async (data: NormativaFormData): Promise<Normativa> => {
    try {
      const response = await apiClient.post<Normativa>(
        '/biblioteca/normativa-global',
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Error al crear la normativa'));
    }
  },

  update: async (id: string, data: NormativaFormData): Promise<Normativa> => {
    try {
      const response = await apiClient.patch<Normativa>(
        `/biblioteca/normativa-global/${id}`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, 'Error al actualizar la normativa')
      );
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/biblioteca/normativa-global/${id}`);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Error al eliminar la normativa'));
    }
  },
};
