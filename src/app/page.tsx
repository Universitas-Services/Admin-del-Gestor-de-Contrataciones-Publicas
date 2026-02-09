import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth';
import { getDashboardRoute } from '@/lib/constants/routes';

/**
 * Página Raíz de la Aplicación
 * Server Component que redirige a:
 * - /dashboard si el usuario está autenticado
 * - /login si no hay sesión activa
 */
export default async function HomePage() {
  // Verificar si el usuario tiene sesión activa
  const user = await getCurrentUser();

  if (user) {
    // Usuario autenticado: redirigir a su dashboard
    const dashboardRoute = getDashboardRoute();
    redirect(dashboardRoute);
  }

  // Sin sesión: redirigir a login
  redirect('/login');
}
