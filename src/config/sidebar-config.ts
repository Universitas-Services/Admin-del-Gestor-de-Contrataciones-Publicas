import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Building2,
  ShieldUser,
} from 'lucide-react';

export interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  badge?: string | number;
  subItems?: { title: string; href: string }[];
}

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Ente',
    icon: Building2,
    subItems: [
      { title: 'Registrar Ente', href: '/dashboard/ente' },
      { title: 'Listado de Entes', href: '/dashboard/ente/listado' },
    ],
  },
  {
    title: 'Supervisor',
    icon: ShieldUser,
    subItems: [
      { title: 'Registrar Supervisor', href: '/dashboard/supervisor' },
      {
        title: 'Listado de Supervisores',
        href: '/dashboard/supervisor/listado',
      },
    ],
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
