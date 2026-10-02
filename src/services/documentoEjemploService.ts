import { apiClient } from '@/lib/apiClient';

export interface DocumentoEjemplo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentoEjemploListParams {
  page?: number;
  limit?: number;
  search?: string;
  activo?: boolean;
}

export interface DocumentoEjemploListMeta {
  total: number;
  page: number;
  lastPage: number;
}

export interface DocumentoEjemploListResponse {
  data: DocumentoEjemplo[];
  meta: DocumentoEjemploListMeta;
}

export interface DocumentoEjemploUpdateData {
  nombre: string;
  codigo: string;
  descripcion?: string | null;
  orden: number;
  activo: boolean;
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

export const documentoEjemploService = {
  getAll: async (
    params: DocumentoEjemploListParams = {}
  ): Promise<DocumentoEjemploListResponse> => {
    try {
      const response = await apiClient.get<DocumentoEjemploListResponse>(
        '/documentos-ejemplo',
        {
          params: {
            page: params.page ?? 1,
            limit: params.limit ?? 10,
            ...(params.search ? { search: params.search } : {}),
            ...(params.activo !== undefined ? { activo: params.activo } : {}),
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, 'Error al obtener documentos de ejemplo')
      );
    }
  },

  getByCodigo: async (codigo: string): Promise<DocumentoEjemplo> => {
    try {
      const response = await apiClient.get<DocumentoEjemplo>(
        `/documentos-ejemplo/${codigo}`
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, 'Error al obtener el documento de ejemplo')
      );
    }
  },

  create: async (formData: FormData): Promise<DocumentoEjemplo> => {
    try {
      const response = await apiClient.post<DocumentoEjemplo>(
        '/documentos-ejemplo',
        formData
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, 'Error al crear el documento de ejemplo')
      );
    }
  },

  update: async (
    id: string,
    data: DocumentoEjemploUpdateData
  ): Promise<DocumentoEjemplo> => {
    try {
      const response = await apiClient.patch<DocumentoEjemplo>(
        `/documentos-ejemplo/${id}`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, 'Error al actualizar el documento de ejemplo')
      );
    }
  },

  replaceImage: async (
    id: string,
    formData: FormData
  ): Promise<DocumentoEjemplo> => {
    try {
      const response = await apiClient.put<DocumentoEjemplo>(
        `/documentos-ejemplo/${id}/imagen`,
        formData
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Error al reemplazar la imagen'));
    }
  },

  delete: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `/documentos-ejemplo/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, 'Error al eliminar el documento de ejemplo')
      );
    }
  },
};
