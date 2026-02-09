import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth/auth';
import { enforceRoleAccess } from '@/lib/auth/roleGuard';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Dashboard | UNIVERSITAS',
  description: 'Sistema de Gestión de Contrataciones Públicas',
};

/**
 * Layout del Dashboard
 * Server Component que envuelve todas las páginas privadas del sistema
 *
 * Características:
 * - Segunda capa de validación (doble check con proxy.ts)
 * - Verifica autenticación y rol UNIVERSITAS en el servidor
 * - Renderiza Sidebar + Header + Contenido si todo es válido
 * - Redirige al login si no hay sesión válida (via enforceRoleAccess)
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Defense-in-depth: Valida rol aunque proxy ya lo hizo
  // Si falla, redirige automáticamente al login
  enforceRoleAccess(user);

  // Después de enforceRoleAccess, user está garantizado como non-null
  const authenticatedUser = user!;

  // Renderizar el layout completo con datos ya validados
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Client Component que recibe user como prop */}
      <Sidebar user={authenticatedUser} />

      {/* Contenido Principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header - Client Component que recibe user como prop */}
        <Header user={authenticatedUser} />

        {/* Área de contenido scrolleable */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
