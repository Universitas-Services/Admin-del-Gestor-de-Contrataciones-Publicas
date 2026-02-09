/**
 * Rutas base por rol
 * En este sistema solo hay 1 rol: UNIVERSITAS
 */
export const ROLE_BASE_ROUTES = {
  UNIVERSITAS: '/dashboard',
} as const;

/**
 * Rutas de dashboard por rol
 */
export const DASHBOARD_ROUTES = {
  UNIVERSITAS: '/dashboard',
} as const;

/**
 * Rutas adicionales por rol
 * Define todas las rutas existentes en el sidebar
 */
export const ROLE_ROUTES = {
  UNIVERSITAS: {
    dashboard: '/dashboard',
    contrataciones: '/dashboard/contrataciones',
    usuarios: '/dashboard/usuarios',
    configuracion: '/dashboard/configuracion',
  },
} as const;

/**
 * Rutas públicas (no requieren autenticación)
 */
export const PUBLIC_ROUTES = ['/login', '/'] as const;

/**
 * Obtener la ruta de dashboard según el rol
 */
export function getDashboardRoute(): string {
  return DASHBOARD_ROUTES.UNIVERSITAS;
}

/**
 * Obtener todas las rutas válidas para el rol UNIVERSITAS
 */
export function getRoleRoutes(): string[] {
  return Object.values(ROLE_ROUTES.UNIVERSITAS);
}

/**
 * Verificar si una ruta pertenece al rol UNIVERSITAS
 */
export function isRouteAllowedForRole(path: string): boolean {
  const normalizedPath = path.split('?')[0]; // Remover query params
  const roleRoutes = getRoleRoutes();
  return roleRoutes.some((route) => normalizedPath.startsWith(route));
}

/**
 * Verificar si una ruta es pública
 */
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => path === route || path.startsWith(route)
  );
}
