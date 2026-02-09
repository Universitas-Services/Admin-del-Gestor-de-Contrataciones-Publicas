import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import type { SessionPayload } from './types';
import { SESSION_CONSTANTS } from './types';

/**
 * Estructura del JWT que viene del backend
 */
interface BackendJWT {
  userId: string;
  email: string;
  rol: string;
  iat: number;
  exp: number;
}

/**
 * Verificar y decodificar un token JWT del backend
 */
export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const decoded = jwtDecode<BackendJWT>(token);

    // Verificar si el token ha expirado
    if (decoded.exp) {
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.log('❌ Token expirado');
        return null;
      }
    }

    // Verificar rol UNIVERSITAS
    if (decoded.rol !== 'UNIVERSITAS') {
      console.log(`❌ Rol incorrecto: ${decoded.rol}`);
      return null;
    }

    // Mapear campos del backend a SessionPayload
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.rol,
      name: decoded.email.split('@')[0],
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error('❌ Error verificando sesión:', error);
    return null;
  }
}

/**
 * Obtener sesión desde cookies del servidor
 */
export async function getSessionCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_CONSTANTS.COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  return verifySession(sessionCookie.value);
}

/**
 * Eliminar sesión (logout)
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_CONSTANTS.COOKIE_NAME);
  cookieStore.delete('user_session');
}
