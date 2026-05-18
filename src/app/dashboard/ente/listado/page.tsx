import { cookies } from 'next/headers';
import { enteService, type EnteListItem } from '@/services/enteService';
import { EntesTable } from './EntesTable';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export const metadata = {
  title: 'Listado de Entes | UNIVERSITAS',
};

// Next.js forzará este componente a ser dinámico si usamos cookies en enteService
export const dynamic = 'force-dynamic';

export default async function ListadoEntesPage() {
  // Obtener datos en el servidor
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let entes: EnteListItem[] = [];
  try {
    entes = await enteService.getEntes(token);
  } catch (error) {
    console.error('Error fetching entes:', error);
    // Continuamos con arreglo vacío, en un entorno real podríamos mostrar un error state
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 shadow-sm">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              Listado de Entes
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Gestión y visualización de todos los Entes registrados en el
              sistema
            </p>
          </div>
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Entes Públicos</CardTitle>
          <CardDescription>
            Mostrando {entes.length}{' '}
            {entes.length === 1 ? 'ente registrado' : 'entes registrados'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EntesTable data={entes} />
        </CardContent>
      </Card>
    </div>
  );
}
