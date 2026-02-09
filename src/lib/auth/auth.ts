import { getSessionCookie } from './session';
import type { SessionPayload } from './types';

/**
 * Obtener usuario actual desde la sesión
 * Se ejecuta en el servidor
 */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  return getSessionCookie();
}

/**
 * Verificar si el usuario está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSessionCookie();
  return session !== null && session.role === 'UNIVERSITAS';
}
