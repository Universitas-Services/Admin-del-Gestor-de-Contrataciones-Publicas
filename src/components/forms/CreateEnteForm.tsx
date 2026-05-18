'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  createEnteSchema,
  type CreateEnteFormData,
} from '@/schemas/ente.schema';
import { enteService } from '@/services/enteService';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { useEffect } from 'react';

/**
 * Componente CreateEnteForm
 * Formulario completo para crear un Ente Público con su Admin Ente
 *
 * Características:
 * - React Hook Form + Zod resolver para validaciones
 * - 2 Cards separados (Información del Ente + Información del Admin)
 * - Dropdowns para ubicación (estado, municipio, parroquia)
 * - Feedback con toast (sonner)
 * - Loading state en el botón
 * - Layout responsive (2 columnas en desktop, 1 en mobile)
 */
export default function CreateEnteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estados, setEstados] = useState<{ id: number; nombre: string }[]>([]);
  const [municipios, setMunicipios] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [parroquias, setParroquias] = useState<
    { id: number; nombre: string }[]
  >([]);

  const form = useForm<CreateEnteFormData>({
    resolver: zodResolver(createEnteSchema),
    defaultValues: {
      nombre: '',
      rif: '',
      siglas: '',
      direccionFiscal: '',
      estado: '',
      municipio: '',
      parroquia: '',
      nombreAdmin: '',
      apellidoAdmin: '',
      emailContacto: '',
      password: '',
    },
  });

  const watchEstadoId = form.watch('estado');
  const watchMunicipioId = form.watch('municipio');

  // Cargar estados al inicio
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await api.territorio.getEstados();
        console.log('Full SDK response for estados:', response);
        if (response && response.data) {
          setEstados(response.data);
        } else if (Array.isArray(response)) {
          setEstados(response);
        }
      } catch (error) {
        console.error('Error fetching estados:', error);
      }
    };
    fetchEstados();
  }, []);

  // Cargar municipios cuando cambia el estado
  useEffect(() => {
    if (!watchEstadoId) {
      setMunicipios([]);
      setParroquias([]);
      return;
    }

    const fetchMunicipios = async () => {
      try {
        const response = await api.territorio.getMunicipios(
          Number(watchEstadoId)
        );
        console.log('Municipios response:', response);
        if (response && response.data) {
          setMunicipios(response.data);
        } else if (Array.isArray(response)) {
          setMunicipios(response);
        }
        // Limpiar campos dependientes
        form.setValue('municipio', '');
        form.setValue('parroquia', '');
      } catch (error) {
        console.error('Error fetching municipios:', error);
      }
    };
    fetchMunicipios();
  }, [watchEstadoId, form]);

  // Cargar parroquias cuando cambia el municipio
  useEffect(() => {
    if (!watchMunicipioId) {
      setParroquias([]);
      return;
    }

    const fetchParroquias = async () => {
      try {
        const response = await api.territorio.getParroquias(
          Number(watchMunicipioId)
        );
        console.log('Parroquias response:', response);
        if (response && response.data) {
          setParroquias(response.data);
        } else if (Array.isArray(response)) {
          setParroquias(response);
        }
        // Limpiar campo dependiente
        form.setValue('parroquia', '');
      } catch (error) {
        console.error('Error fetching parroquias:', error);
      }
    };
    fetchParroquias();
  }, [watchMunicipioId, form]);

  async function onSubmit(values: CreateEnteFormData) {
    try {
      setIsSubmitting(true);

      // Mapear IDs a nombres antes de enviar al backend
      const payload = {
        ...values,
        estado:
          estados.find((e) => e.id.toString() === values.estado)?.nombre ||
          values.estado,
        municipio:
          municipios.find((m) => m.id.toString() === values.municipio)
            ?.nombre || values.municipio,
        parroquia:
          parroquias.find((p) => p.id.toString() === values.parroquia)
            ?.nombre || values.parroquia,
      };

      const response = await enteService.create(payload);

      toast.success('¡Éxito!', {
        description: response.message,
      });

      form.reset();
    } catch (error) {
      toast.error('Error al crear el Ente', {
        description:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error desconocido',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Card 1: Información del Ente */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Ente</CardTitle>
            <CardDescription>
              Datos generales del Ente Público a registrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Nombre del Ente */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Ente *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Alcaldía del Municipio Libertador"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/*  Card 2: Información del Admin Ente */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Admin Ente</CardTitle>
            <CardDescription>
              Datos del usuario administrador del Ente
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {/* Nombre Admin */}
            <FormField
              control={form.control}
              name="nombreAdmin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Administrador *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Apellido Admin */}
            <FormField
              control={form.control}
              name="apellidoAdmin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido del Administrador *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Contacto */}
            <FormField
              control={form.control}
              name="emailContacto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de Contacto *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Ej: admin@alcaldia.gov.ve"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Contraseña temporal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* RIF */}
            <FormField
              control={form.control}
              name="rif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RIF</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: J-20000000-0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Siglas */}
            <FormField
              control={form.control}
              name="siglas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Siglas</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: AML" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dirección Fiscal */}
            <FormField
              control={form.control}
              name="direccionFiscal"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Dirección Fiscal</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Av. Urdaneta, Palacio Municipal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado */}
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {estados.map((estado) => (
                        <SelectItem
                          key={estado.id}
                          value={estado.id.toString()}
                        >
                          {estado.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Municipio */}
            <FormField
              control={form.control}
              name="municipio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Municipio</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!watchEstadoId || municipios.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un municipio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {municipios.map((municipio) => (
                        <SelectItem
                          key={municipio.id}
                          value={municipio.id.toString()}
                        >
                          {municipio.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parroquia */}
            <FormField
              control={form.control}
              name="parroquia"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Parroquia</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!watchMunicipioId || parroquias.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una parroquia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {parroquias.map((parroquia) => (
                        <SelectItem
                          key={parroquia.id}
                          value={parroquia.id.toString()}
                        >
                          {parroquia.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Botón de Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear Ente'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
