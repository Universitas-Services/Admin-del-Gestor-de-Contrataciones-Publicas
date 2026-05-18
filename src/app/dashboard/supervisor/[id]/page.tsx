import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supervisorService } from '@/services/supervisorService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Ban,
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Building2,
  Plus,
  Eye,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const metadata = {
  title: 'Detalle de Supervisor | UNIVERSITAS',
};

export default async function SupervisorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let supervisor;
  try {
    supervisor = await supervisorService.getSupervisorById(id, token);
  } catch (error) {
    console.error('Error fetching supervisor:', error);
    notFound(); // Redirige a 404 si no se encuentra
  }

  const formatId = (uuid: string) => {
    return `SUP-${uuid.substring(0, 5).toUpperCase()}`;
  };

  return (
    <div className="bg-highlight-blue -m-6 min-h-[calc(100vh-64px)] space-y-8 p-8">
      {/* Header Principal en una Card */}
      <Card className="bg-background/80 border-none shadow-sm backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <Button variant="ghost" size="icon" asChild className="mt-1">
                <Link href="/dashboard/supervisor/listado">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-foreground text-3xl font-bold tracking-tight capitalize">
                    {supervisor.nombre.toLowerCase()}
                  </h1>
                  <Badge
                    variant="outline"
                    className={
                      supervisor.activo
                        ? 'border-green-500/20 bg-green-500/10 text-green-600'
                        : 'border-red-500/20 bg-red-500/10 text-red-600'
                    }
                  >
                    {supervisor.activo ? '• Activo' : '• Inactivo'}
                  </Badge>
                </div>
                <div className="text-muted-foreground mt-1 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-sm font-medium">{supervisor.rol}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 border-slate-200">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="destructive"
                className="gap-2 border-none bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700"
              >
                <Ban className="h-4 w-4" />
                Suspender
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Columna Izquierda: Perfil y Stats */}
        <div className="space-y-8">
          <Card className="bg-background border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Perfil de Usuario
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="bg-muted border-border mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2">
                  {/* Placeholder for avatar */}
                  <User className="text-muted-foreground h-12 w-12" />
                </div>
                <h2 className="text-foreground text-xl font-semibold">
                  {supervisor.nombre}
                </h2>
                <p className="text-muted-foreground text-sm">
                  ID: {formatId(supervisor.id)}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                    Email
                  </p>
                  <div className="text-foreground flex items-center gap-2 text-sm">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    {supervisor.email}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                    Rol
                  </p>
                  <div className="text-foreground flex items-center gap-2 text-sm">
                    <ShieldCheck className="text-muted-foreground h-4 w-4" />
                    {supervisor.rol}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                Total Entes Asignados
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-sidebar-primary text-4xl font-bold">
                  {supervisor.entesAsignados.length}
                </span>
                <span className="text-muted-foreground text-sm">
                  Entidad{supervisor.entesAsignados.length !== 1 ? 'es' : ''}{' '}
                  activa{supervisor.entesAsignados.length !== 1 ? 's' : ''}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Entes Asignados */}
        <div className="md:col-span-2">
          <Card className="bg-background h-full border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="text-muted-foreground h-5 w-5" />
                Entes Asignados
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-8 w-8"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4 pt-6">
              {supervisor.entesAsignados.length > 0 ? (
                supervisor.entesAsignados.map((ente) => (
                  <div
                    key={ente.id}
                    className="bg-background hover:bg-muted/30 overflow-hidden rounded-lg border shadow-sm transition-colors"
                  >
                    <div className="flex items-start gap-4 p-4">
                      <div className="bg-sidebar-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                        <Building2 className="text-sidebar-primary h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="text-foreground truncate text-base font-semibold">
                            {ente.nombre}
                          </h3>
                          {ente.siglas && (
                            <Badge
                              variant="secondary"
                              className="text-xs font-normal"
                            >
                              {ente.siglas}
                            </Badge>
                          )}
                        </div>
                        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                          <span className="flex items-center gap-1">
                            # RIF: {ente.rif}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Asignado:{' '}
                            {new Date(ente.asignadoEn).toLocaleDateString(
                              'es-VE'
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground h-8 w-8"
                          asChild
                        >
                          <Link href={`/dashboard/ente/${ente.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="bg-muted/20 flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-green-600">
                        <CheckCircle2 className="h-4 w-4 fill-green-600/20" />
                        ESTADO OPERATIVO
                      </div>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-primary flex items-center text-xs font-medium transition-colors"
                      >
                        Ir a reportes <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground py-12 text-center">
                  <Building2 className="mx-auto mb-4 h-12 w-12 opacity-20" />
                  <p>No hay entes asignados a este supervisor.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
