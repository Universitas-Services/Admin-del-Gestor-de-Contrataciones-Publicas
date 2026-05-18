import { create } from 'zustand';
import { authService } from '@/services/authService';
import { authStorage } from '@/storage/authStorage';
import { AuthState, AuthActions, User } from '@/types/auth.types';

/**
 * Función helper para inicializar el estado desde cookies
 * Se ejecuta al crear el store para evitar race conditions
 */
const getInitialState = (): AuthState => {
  // Solo en el cliente
  if (typeof window !== 'undefined') {
    const user = authStorage.getUser();
    const token = authStorage.getToken();

    // Si hay usuario, token y el rol es UNIVERSITAS
    if (user && token && user.rol === 'UNIVERSITAS') {
      return {
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    }
  }

  // Estado por defecto si no hay sesión
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

/**
 * Store global de autenticación (ORQUESTADOR)
 *
 * Responsabilidades:
 * - Manejar estado global con Zustand
 * - Orquestar llamadas a authService (HTTP)
 * - Orquestar llamadas a authStorage (persistencia)
 * - Validar reglas de negocio (ej: rol UNIVERSITAS)
 * - Manejar flujos completos de autenticación
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // Estado inicial basado en cookies
  ...getInitialState(),

  /**
   * Inicia sesión
   * Orquesta el flujo completo: HTTP → Validación → Storage → Estado
   */
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      // Llamar al servicio HTTP
      const { access_token, user } = await authService.login({
        email,
        password,
      });

      // Validar reglas de negocio
      if (user.rol !== 'UNIVERSITAS') {
        throw new Error('No tiene permisos para acceder a este sistema');
      }

      // Guardar en storage (cookies)
      authStorage.saveAuth(access_token, user);

      // Actualizar estado global
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      // Manejar errores
      let errorMessage = 'Error al iniciar sesión';

      if (error && typeof error === 'object') {
        if (
          'response' in error &&
          error.response &&
          typeof error.response === 'object'
        ) {
          if (
            'data' in error.response &&
            error.response.data &&
            typeof error.response.data === 'object'
          ) {
            if (
              'message' in error.response.data &&
              typeof error.response.data.message === 'string'
            ) {
              errorMessage = error.response.data.message;
            }
          }
        } else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  /**
   * Cierra la sesión del usuario
   * Limpia storage y resetea estado
   */
  logout: () => {
    // Llamar al servicio
    authService.logout().catch(() => {});

    // Limpiar storage (cookies)
    authStorage.clearAuth();

    // 3. Resetear estado global
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  /**
   * Verifica si existe una sesión activa
   * Restaura el estado desde el storage al cargar la aplicación
   */
  checkAuth: () => {
    // Verificar si hay sesión en storage
    if (!authStorage.hasValidSession()) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      return;
    }

    // Obtener usuario del storage
    const user = authStorage.getUser();

    // Validar rol UNIVERSITAS
    if (user && user.rol === 'UNIVERSITAS') {
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      // Sesión inválida, limpiar storage
      authStorage.clearAuth();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Limpia el error del estado
   */
  clearError: () => {
    set({ error: null });
  },
}));

// Re-exportar tipo User para facilitar imports
export type { User };
