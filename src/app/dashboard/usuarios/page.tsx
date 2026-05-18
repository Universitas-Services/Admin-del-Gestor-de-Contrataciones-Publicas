import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

/**
 * Página de Usuarios
 * Placeholder: Funcionalidad por implementar
 */
export default function UsuariosPage() {
  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
        <p className="mt-2 text-gray-600">
          Administración de usuarios del sistema
        </p>
      </div>

      {/* Contenido Placeholder */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-xl">Módulo en Desarrollo</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Esta sección estará disponible próximamente. Aquí podrás administrar
            todos los usuarios del sistema.
          </p>
          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">
              Funcionalidades planificadas:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-700">
              <li>Lista de usuarios registrados</li>
              <li>Crear nuevos usuarios</li>
              <li>Editar permisos y roles</li>
              <li>Gestión de estados (activo/inactivo)</li>
              <li>Historial de actividad</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
