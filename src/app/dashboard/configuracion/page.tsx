import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

/**
 * Página de Configuración
 * Placeholder: Funcionalidad por implementar
 */
export default function ConfiguracionPage() {
  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-2 text-gray-600">
          Ajustes y configuración del sistema
        </p>
      </div>

      {/* Contenido Placeholder */}
      <Card className="border-l-4 border-l-green-600">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-green-600" />
            <CardTitle className="text-xl">Módulo en Desarrollo</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Esta sección estará disponible próximamente. Aquí podrás configurar
            los parámetros del sistema.
          </p>
          <div className="mt-4 rounded-lg bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">
              Funcionalidades planificadas:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-green-700">
              <li>Configuración general del sistema</li>
              <li>Parámetros de notificaciones</li>
              <li>Preferencias de usuario</li>
              <li>Configuración de seguridad</li>
              <li>Respaldos y mantenimiento</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
