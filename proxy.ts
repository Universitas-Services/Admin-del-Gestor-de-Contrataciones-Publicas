import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { isPublicRoute, isRouteAllowedForRole } from '@/lib/constants/routes';

/**
 * Proxy de Next.js 16 - Guardian del servidor
 * Protege todas las rutas y valida permisos por rol
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ CASO 1: Permitir acceso a rutas públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 🔒 CASO 2: Validar rutas protegidas
  const token = request.cookies.get('access_token')?.value;

  // ❌ ERROR 1: No existe el token
  if (!token) {
    console.log(
      '[PROXY] ❌ No se encontró access_token - Redirigiendo al login'
    );
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verificar y validar el token usando la función centralizada
  const session = await verifySession(token);

  // ❌ ERROR 2: Token inválido, expirado o rol incorrecto
  if (!session) {
    console.log(
      '[PROXY] ❌ Sesión inválida o expirada - Redirigiendo al login'
    );
    const response = NextResponse.redirect(new URL('/login', request.url));

    // Limpiar cookies inválidas
    response.cookies.delete('access_token');
    response.cookies.delete('user_session');

    return response;
  }

  // ❌ ERROR 3: Ruta no permitida para el rol
  if (!isRouteAllowedForRole(pathname)) {
    console.log('[PROXY] ❌ Ruta no permitida - Redirigiendo al dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ✅ TODO CORRECTO: Token válido, no expirado, rol UNIVERSITAS, ruta permitida
  console.log(
    `[PROXY] ✅ Acceso permitido para ${session.email} (${session.role})`
  );
  return NextResponse.next();
}

/**
 * Configuración del matcher
 * Especifica en qué rutas debe ejecutarse el proxy
 *
 * Excluye:
 * - _next/static (archivos estáticos de Next.js)
 * - _next/image (optimización de imágenes)
 * - favicon.ico
 * - Archivos de assets (svg, png, jpg, jpeg, gif, webp)
 */
export const config = {
  matcher: [
    /*
     * Ejecutar en todas las rutas excepto las especificadas arriba
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
