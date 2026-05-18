import { redirect } from 'next/navigation';
import type { SessionPayload } from './types';

/**
 * Enforce role-based access in layouts
 * Defense-in-depth: Proxy valida primero, layout valida después
 *
 * @param user - Current user session or null
 */
export function enforceRoleAccess(user: SessionPayload | null): void {
  // Primera barrera: No hay autenticación
  if (!user) {
    redirect('/login');
  }

  // Segunda barrera: Rol incorrecto
  if (user.role !== 'UNIVERSITAS') {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Layout Guard] User with role "${user.role}" attempted to access UNIVERSITAS layout.`
      );
    }

    redirect('/login');
  }

  // Acceso permitido
}
