import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

/**
 * Página de Contrataciones
 * Placeholder: Funcionalidad por implementar
 */
export default function ContratacionesPage() {
  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contrataciones</h1>
        <p className="mt-2 text-gray-600">Gestión de contrataciones públicas</p>
      </div>

      {/* Contenido Placeholder */}
      <Card className="border-l-4 border-l-purple-600">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-purple-600" />
            <CardTitle className="text-xl">Módulo en Desarrollo</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Esta sección estará disponible próximamente. Aquí podrás gestionar
            todas las contrataciones del sistema.
          </p>
          <div className="mt-4 rounded-lg bg-purple-50 p-4">
            <p className="text-sm font-medium text-purple-800">
              Funcionalidades planificadas:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-purple-700">
              <li>Lista de contrataciones activas</li>
              <li>Crear nueva contratación</li>
              <li>Editar contrataciones existentes</li>
              <li>Seguimiento de estados</li>
              <li>Reportes y estadísticas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
