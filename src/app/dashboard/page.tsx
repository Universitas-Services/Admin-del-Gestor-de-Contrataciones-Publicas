import { cookies } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, CheckCircle, Clock } from 'lucide-react';
import { enteService } from '@/services/enteService';

/**
 * Página Principal del Dashboard
 * Muestra estadísticas y resumen del sistema
 */
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let metrics = {
    totalEntes: 0,
    totalSupervisores: 0,
    completados: 0,
    porCompletar: 0,
  };

  try {
    metrics = await enteService.getDashboardMetrics(token);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    // You could handle the error visually or just let it show 0s
  }
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
        {/* Total Entes */}
        <Card className="border-l-4 border-l-purple-600 transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Entes
            </CardTitle>
            <FileText className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {metrics.totalEntes}
            </div>
          </CardContent>
        </Card>

        {/* Total Supervisores */}
        <Card className="border-l-4 border-l-blue-600 transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Supervisores
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {metrics.totalSupervisores}
            </div>
          </CardContent>
        </Card>

        {/* Completadas */}
        <Card className="border-l-4 border-l-green-600 transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completadas
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {metrics.completados}
            </div>
          </CardContent>
        </Card>

        {/* Por completar */}
        <Card className="border-l-4 border-l-orange-600 transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Por completar
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {metrics.porCompletar}
            </div>
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
