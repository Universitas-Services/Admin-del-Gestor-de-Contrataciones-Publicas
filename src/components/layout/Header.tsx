'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Shield } from 'lucide-react';
import type { SessionPayload } from '@/lib/auth/types';

/**
 * Props del Header
 */
interface HeaderProps {
  user: SessionPayload;
}

/**
 * Componente Header
 * Barra superior del dashboard con información del usuario
 *
 * Características:
 * - Avatar del usuario
 * - Información del usuario (nombre, email, rol)
 * - Dropdown menu con opciones
 * - Botón de cerrar sesión
 * - Recibe usuario validado como prop desde el layout server-side
 */
export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Obtener iniciales del usuario para el avatar
  const getInitials = () => {
    // Extraer iniciales del nombre (que viene del email)
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Título / Breadcrumbs (espacio para futuras mejoras) */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Panel de Control
          </h2>
        </div>

        {/* Usuario y Menú */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-3 hover:bg-gray-100"
              >
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-gray-700">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-linear-to-br from-purple-600 to-blue-600 font-semibold text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Información del usuario */}
              <div className="space-y-1 px-2 py-2">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{user.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">{user.role}</span>
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* Cerrar Sesión */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
