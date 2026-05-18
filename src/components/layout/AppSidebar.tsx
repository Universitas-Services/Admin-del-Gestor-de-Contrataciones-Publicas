'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronRight, Menu } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
export default function AppSidebar({}: AppSidebarProps) {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* Header del Sidebar */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip={
                state === 'expanded' ? 'Comprimir menú' : 'Desplegar menú'
              }
            >
              <Menu />
              <div className="flex flex-1 items-center justify-center pr-6 group-data-[collapsible=icon]:hidden">
                <Image
                  src="/LOGO UNIVERSITAS LEGAL (BLANCO).png"
                  alt="Universitas Logo"
                  width={120}
                  height={30}
                  className="object-contain"
                  priority
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Contenido del Sidebar */}
      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0">
        <SidebarGroup>
          <SidebarMenu>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href ? pathname === item.href : false;
              const isSubActive = Boolean(
                item.subItems?.some((sub) => pathname === sub.href) ||
                (item.href && pathname.startsWith(item.href))
              );

              if (item.subItems) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isSubActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isSubActive}
                        >
                          <Icon />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.href}
                              >
                                <Link href={subItem.href}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href!}>
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
        <div className="bg-sidebar-accent text-muted-foreground mb-2 rounded-lg p-3 text-center text-xs group-data-[collapsible=icon]:hidden">
          <p>v1.0.0</p>
          <p className="mt-1">© 2026 UNIVERSITAS</p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
