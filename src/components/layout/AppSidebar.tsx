'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { sidebarItems } from '@/config/sidebar-config';
import type { SessionPayload } from '@/lib/auth/types';

/**
 * Props del AppSidebar
 */
interface AppSidebarProps {
  user: SessionPayload;
}

/**
 * Componente AppSidebar
 * Sidebar orquestador que utiliza los primitivos de shadcn
 *
 * Características:
 * - Usa componentes primitivos de shadcn/ui
 * - Variant: floating (sidebar flotante con bordes redondeados)
 * - Collapsible: icon (al colapsar muestra solo iconos)
 * - Items del menú configurados en sidebar-config.ts
 * - Estado persistente en cookies
 * - Soporte automático para mobile (Sheet)
 */
export default function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* Header del Sidebar */}
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-3 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0 group-data-[collapsible=icon]:px-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400 to-blue-600">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="text-lg font-bold">UNIVERSITAS</h1>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Contenido del Sidebar */}
      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0">
        <SidebarGroup>
          <SidebarMenu>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer del Sidebar */}
      <SidebarFooter>
        <div className="bg-sidebar-accent text-muted-foreground rounded-lg p-3 text-center text-xs group-data-[collapsible=icon]:hidden">
          <p>v1.0.0</p>
          <p className="mt-1">© 2026 UNIVERSITAS</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
