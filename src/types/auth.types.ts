export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  enteId: string | null;
}

/**
 * Credenciales de login
 * Body del POST /auth/login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Respuesta del endpoint de login
 */
export interface LoginResponse {
  access_token: string;
  user: User;
}

/**
 * Estado de autenticación en el store de Zustand
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Acciones del store de autenticación
 */
export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}
