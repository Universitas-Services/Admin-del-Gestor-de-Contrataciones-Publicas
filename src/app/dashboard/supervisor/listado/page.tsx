import { cookies } from 'next/headers';
import {
  supervisorService,
  type SupervisorListItem,
} from '@/services/supervisorService';
import { SupervisoresTable } from './SupervisoresTable';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ShieldUser } from 'lucide-react';

export const metadata = {
  title: 'Listado de Supervisores | UNIVERSITAS',
};

// Next.js forzará este componente a ser dinámico si usamos cookies en supervisorService
export const dynamic = 'force-dynamic';

export default async function ListadoSupervisoresPage() {
  // Obtener datos en el servidor
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let supervisores: SupervisorListItem[] = [];
  try {
    supervisores = await supervisorService.getSupervisores(token);
  } catch (error) {
    console.error('Error fetching supervisores:', error);
    // Continuamos con arreglo vacío, en un entorno real podríamos mostrar un error state
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-400 to-indigo-600 shadow-sm">
            <ShieldUser className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              Listado de Supervisores
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Gestión y visualización de todos los Supervisores registrados en
              el sistema
            </p>
          </div>
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Supervisores</CardTitle>
          <CardDescription>
            Mostrando {supervisores.length}{' '}
            {supervisores.length === 1
              ? 'supervisor registrado'
              : 'supervisores registrados'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupervisoresTable data={supervisores} />
        </CardContent>
      </Card>
    </div>
  );
}
