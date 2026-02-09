import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, CheckCircle, Clock } from 'lucide-react';

/**
 * Página Principal del Dashboard
 * Muestra estadísticas y resumen del sistema
 */
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Bienvenido al sistema de gestión de contrataciones públicas
        </p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Contrataciones */}
        <Card className="border-l-4 border-l-purple-600 transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Contrataciones
            </CardTitle>
            <FileText className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">125</div>
            <p className="mt-1 text-xs text-gray-500">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        {/* Usuarios Activos */}
        <Card className="border-l-4 border-l-blue-600 transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Usuarios Activos
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">48</div>
            <p className="mt-1 text-xs text-gray-500">+3 nuevos esta semana</p>
          </CardContent>
        </Card>

        {/* Contrataciones Aprobadas */}
        <Card className="border-l-4 border-l-green-600 transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Aprobadas
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">98</div>
            <p className="mt-1 text-xs text-gray-500">78% del total</p>
          </CardContent>
        </Card>

        {/* En Proceso */}
        <Card className="border-l-4 border-l-orange-600 transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En Proceso
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">27</div>
            <p className="mt-1 text-xs text-gray-500">Requieren revisión</p>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Bienvenida */}
      <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">
            ¡Bienvenido al Sistema de Gestión!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/90">
            Este es el panel de control del sistema de gestión de contrataciones
            públicas. Desde aquí puedes administrar todas las operaciones del
            sistema.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-lg bg-white/20 px-4 py-3 backdrop-blur-sm">
              <p className="text-sm font-medium">Acceso Completo</p>
              <p className="text-xs text-white/80">Rol: UNIVERSITAS</p>
            </div>
            <div className="rounded-lg bg-white/20 px-4 py-3 backdrop-blur-sm">
              <p className="text-sm font-medium">Sistema Seguro</p>
              <p className="text-xs text-white/80">Protegido por Proxy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
