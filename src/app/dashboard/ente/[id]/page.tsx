import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { enteService } from '@/services/enteService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import EnteDetailActions from '@/components/ente/EnteDetailActions';
import {
  Building2,
  MapPin,
  CalendarDays,
  FileText,
  Clock,
  Send,
  Edit,
  CheckCircle,
  Briefcase,
  Monitor,
  ShoppingCart,
  Landmark,
  Info,
} from 'lucide-react';

export const metadata = {
  title: 'Detalle de Entidad | UNIVERSITAS',
};

export default async function EnteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let ente;
  try {
    ente = await enteService.getEnteById(id, token);
  } catch (error) {
    console.error('Error fetching ente:', error);
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-VE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-highlight-blue -m-6 min-h-[calc(100vh-64px)] space-y-8 p-4 md:p-8">
      {/* Top Navigation & Actions */}
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            <Building2 className="h-4 w-4" />
          </Link>
          <span>/</span>
          <Link
            href="/dashboard/ente/listado"
            className="hover:text-foreground transition-colors"
          >
            Entidades
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Detalle</span>
        </div>

        {/* Find the ADMIN_ENTE user's ID inside the Ente's users list */}
        <EnteDetailActions
          targetUserId={
            (ente.usuarios as Array<{ id: string; rol: string }>)?.find(
              (u) => u.rol === 'ADMIN_ENTE'
            )?.id || ente.universitasId
          }
          enteName={ente.nombre}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Hero Card */}
        <Card className="bg-background overflow-hidden border-none shadow-sm">
          <CardContent className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="bg-sidebar/5 border-sidebar/10 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2">
              {ente.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ente.logoUrl}
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="text-sidebar-primary/40 h-12 w-12" />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  {ente.nombre}
                </h1>
                {ente.siglas && (
                  <Badge
                    variant="secondary"
                    className="border-none bg-amber-100 font-bold text-amber-800 hover:bg-amber-100"
                  >
                    {ente.siglas}
                  </Badge>
                )}
              </div>

              <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  <span>
                    RIF:{' '}
                    <span className="text-foreground font-medium">
                      {ente.rif}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {[ente.estado, ente.municipio].filter(Boolean).join(', ') ||
                      'Ubicación no registrada'}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <Badge
                  variant="outline"
                  className={
                    ente.datosConfirmados
                      ? 'gap-1.5 border-green-200 bg-green-50 px-2.5 py-1 text-green-700'
                      : 'gap-1.5 border-red-200 bg-red-50 px-2.5 py-1 text-red-700'
                  }
                >
                  {ente.datosConfirmados ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5" /> Completado
                    </>
                  ) : (
                    <>
                      <CalendarDays className="h-3.5 w-3.5" /> Pendiente por
                      completar
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column (Main Info) */}
          <div className="space-y-8 lg:col-span-8">
            {/* Información General */}
            <Card className="bg-background border-none shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                  <Info className="text-primary h-5 w-5" />
                  Información General
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                      Nombre de la entidad
                    </p>
                    <p className="text-foreground text-base font-medium">
                      {ente.nombre}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                      Registro de Información Fiscal (RIF)
                    </p>
                    <p className="text-foreground text-base font-medium">
                      {ente.rif}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                    Dirección Física
                  </p>
                  <div className="border-border bg-muted/20 flex gap-4 rounded-xl border p-4">
                    <MapPin className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                    <div className="text-foreground space-y-1 text-sm">
                      <p>{ente.direccionFiscal || 'No registrada'}</p>
                      {ente.parroquia && <p>Parroquia: {ente.parroquia}</p>}
                      {ente.municipio && <p>Municipio: {ente.municipio}</p>}
                      {ente.estado && <p>Estado: {ente.estado}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estructura Administrativa */}
            <Card className="bg-background border-none shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                  <Briefcase className="text-sidebar-primary h-5 w-5" />
                  Estructura Administrativa
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="border-sidebar/10 bg-sidebar/5 hover:bg-sidebar/10 flex flex-col items-start rounded-2xl border p-6 transition-colors">
                    <div className="bg-sidebar-primary/10 mb-5 flex h-12 w-12 items-center justify-center rounded-xl">
                      <Briefcase className="text-sidebar-primary h-6 w-6" />
                    </div>
                    <h3 className="text-foreground mb-1.5 text-base leading-tight font-bold">
                      {ente.nombreUnidadAdminFinanciera || 'No registrada'}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium">
                      Unidad Administrativa
                    </p>
                  </div>

                  <div className="border-sidebar/10 bg-sidebar/5 hover:bg-sidebar/10 flex flex-col items-start rounded-2xl border p-6 transition-colors">
                    <div className="bg-sidebar-primary/10 mb-5 flex h-12 w-12 items-center justify-center rounded-xl">
                      <Monitor className="text-sidebar-primary h-6 w-6" />
                    </div>
                    <h3 className="text-foreground mb-1.5 text-base leading-tight font-bold">
                      {ente.nombreUnidadTecnologia || 'No registrada'}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium">
                      Unidad de Tecnología
                    </p>
                  </div>

                  <div className="border-sidebar/10 bg-sidebar/5 hover:bg-sidebar/10 flex flex-col items-start rounded-2xl border p-6 transition-colors">
                    <div className="bg-sidebar-primary/10 mb-5 flex h-12 w-12 items-center justify-center rounded-xl">
                      <ShoppingCart className="text-sidebar-primary h-6 w-6" />
                    </div>
                    <h3 className="text-foreground mb-1.5 text-base leading-tight font-bold">
                      {ente.nombreUnidadContratante || 'No registrada'}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium">
                      Unidad Contratante
                    </p>
                  </div>

                  {ente.organoAdscripcion && (
                    <div className="border-sidebar/10 bg-sidebar/5 hover:bg-sidebar/10 flex flex-col items-start rounded-2xl border p-6 transition-colors">
                      <div className="bg-sidebar-primary/10 mb-5 flex h-12 w-12 items-center justify-center rounded-xl">
                        <Landmark className="text-sidebar-primary h-6 w-6" />
                      </div>
                      <h3 className="text-foreground mb-1.5 text-base leading-tight font-bold">
                        {ente.organoAdscripcion}
                      </h3>
                      <p className="text-muted-foreground text-sm font-medium">
                        Órgano de Adscripción
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8 lg:col-span-4">
            {/* Registro del Sistema */}
            <Card className="bg-background border-none shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                  <Monitor className="text-sidebar-primary h-5 w-5" />
                  Registro del Sistema
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-6 pt-6">
                <div className="flex gap-4">
                  <CalendarDays className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                      Fecha de Registro
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      {formatDate(ente.createdAt)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4">
                  <Clock className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                      Última Actualización
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      {formatDate(ente.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestión Operativa (CRM Notas) */}
            <Card className="bg-background flex min-h-[500px] flex-col border-none shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground flex items-center gap-2 text-lg font-bold">
                  <div className="h-1.5 w-4 rounded-full bg-orange-500"></div>
                  Gestión Operativa
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="flex flex-1 flex-col space-y-6 pt-6">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                      NOTAS (CRM)
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-muted text-muted-foreground rounded-full px-2 font-normal"
                    >
                      0 notas
                    </Badge>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="cursor-pointer border-orange-200 bg-orange-50 px-3 text-orange-600 hover:bg-orange-100"
                    >
                      Por contactar
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer border-blue-200 bg-blue-50 px-3 text-blue-600 hover:bg-blue-100"
                    >
                      En revisión
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer border-green-200 bg-green-50 px-3 text-green-600 hover:bg-green-100"
                    >
                      Completado
                    </Badge>
                  </div>

                  <div className="relative">
                    <Input
                      placeholder="Añadir nota..."
                      className="bg-muted/20 border-border focus-visible:ring-primary rounded-xl py-5 pr-10 focus-visible:ring-1"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Empty state para notas (ya que no hay datos en el JSON) */}
                <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-12 text-center">
                  <div className="bg-sidebar/5 flex h-16 w-16 items-center justify-center rounded-full">
                    <FileText className="text-sidebar-primary/40 h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-foreground text-base font-bold">
                      No hay notas registradas
                    </p>
                    <p className="text-muted-foreground mx-auto mt-1 max-w-[200px] text-sm">
                      Comienza añadiendo notas y actividades para este ente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
