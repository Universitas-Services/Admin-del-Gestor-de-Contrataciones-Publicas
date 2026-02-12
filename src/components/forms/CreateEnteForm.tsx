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

  async function onSubmit(values: CreateEnteFormData) {
    try {
      setIsSubmitting(true);
      const response = await enteService.create(values);

      toast.success('¡Éxito!', {
        description: response.message, // "Ente creado exitosamente"
      });

      // Resetear formulario
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

            {/* Estado - Dropdown temporal */}
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <select
                      className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                      {...field}
                    >
                      <option value="">Seleccione un estado</option>
                      <option value="Distrito Capital">Distrito Capital</option>
                      <option value="Miranda">Miranda</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Municipio - Dropdown temporal */}
            <FormField
              control={form.control}
              name="municipio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Municipio</FormLabel>
                  <FormControl>
                    <select
                      className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                      {...field}
                    >
                      <option value="">Seleccione un municipio</option>
                      <option value="Libertador">Libertador</option>
                      <option value="Chacao">Chacao</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parroquia - Dropdown temporal */}
            <FormField
              control={form.control}
              name="parroquia"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Parroquia</FormLabel>
                  <FormControl>
                    <select
                      className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                      {...field}
                    >
                      <option value="">Seleccione una parroquia</option>
                      <option value="Catedral">Catedral</option>
                      <option value="San Juan">San Juan</option>
                    </select>
                  </FormControl>
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
