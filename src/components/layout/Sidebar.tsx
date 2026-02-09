'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import type { SessionPayload } from '@/lib/auth/types';

/**
 * Props del Sidebar
 */
interface SidebarProps {
  user: SessionPayload;
}

/**
 * Elementos del menú de navegación
 */
const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
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

/**
 * Componente Sidebar
 * Barra de navegación lateral con menú de opciones
 *
 * Características:
 * - Logo del sistema
 * - Menú de navegación con iconos
 * - Indicador visual de ruta activa
 * - Diseño profesional con efectos hover
 * - Recibe usuario validado como prop desde el layout server-side
 */
export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col bg-linear-to-b from-slate-900 to-slate-800 text-white shadow-2xl">
      {/* Header del Sidebar */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-purple-600 to-blue-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">UNIVERSITAS</h1>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-700" />

      {/* Navegación */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200',
                isActive
                  ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1 font-medium">{item.title}</span>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4">
        <div className="rounded-lg bg-slate-700/50 p-3 text-center text-xs text-gray-400">
          <p>v1.0.0</p>
          <p className="mt-1">© 2026 UNIVERSITAS</p>
        </div>
      </div>
    </aside>
  );
}
