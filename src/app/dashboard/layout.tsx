import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth/auth';
import { enforceRoleAccess } from '@/lib/auth/roleGuard';
import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

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
    <SidebarProvider defaultOpen={true}>
      <AppSidebar user={authenticatedUser} />
      <SidebarInset>
        <Header user={authenticatedUser} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
