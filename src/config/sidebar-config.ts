import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Building2,
} from 'lucide-react';

export interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Ente',
    href: '/dashboard/ente',
    icon: Building2,
  },
  {
    title: 'Contrataciones',
    href: '/dashboard/contrataciones',
    icon: FileText,
  },
  {
    title: 'Usuarios',
    href: '/dashboard/usuarios',
    icon: Users,
  },
  {
    title: 'Configuración',
    href: '/dashboard/configuracion',
    icon: Settings,
  },
];
