import { apiClient } from '@/lib/apiClient';
import type { ClausulaFormData } from '@/schemas/clausula.schema';

export interface Clausula {
  id: string;
  titulo: string;
  cuerpo: string;
  origen: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClausulaListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ClausulaListMeta {
  total: number;
  page: number;
  lastPage: number;
}

export interface ClausulaListResponse {
  data: Clausula[];
  meta: ClausulaListMeta;
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

export const clausulaService = {
  getAll: async (
    params: ClausulaListParams = {}
  ): Promise<ClausulaListResponse> => {
    try {
      const response = await apiClient.get<ClausulaListResponse>(
        '/biblioteca/clausulas-genericas',
        {
          params: {
            page: params.page ?? 1,
            limit: params.limit ?? 10,
            ...(params.search ? { search: params.search } : {}),
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Error al obtener cláusulas'));
    }
  },

  getById: async (id: string): Promise<Clausula> => {
    try {
      const response = await apiClient.get<Clausula>(
        `/biblioteca/clausulas-genericas/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Error al obtener la cláusula'));
    }
  },

  create: async (data: ClausulaFormData): Promise<Clausula> => {
    try {
      const response = await apiClient.post<Clausula>(
        '/biblioteca/clausulas-genericas',
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Error al crear la cláusula'));
    }
  },

  update: async (id: string, data: ClausulaFormData): Promise<Clausula> => {
    try {
      const response = await apiClient.patch<Clausula>(
        `/biblioteca/clausulas-genericas/${id}`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, 'Error al actualizar la cláusula')
      );
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/biblioteca/clausulas-genericas/${id}`);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Error al eliminar la cláusula'));
    }
  },
};
