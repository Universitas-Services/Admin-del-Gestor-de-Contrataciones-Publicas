'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, X, Loader2 } from 'lucide-react';
import {
  createSupervisorSchema,
  type CreateSupervisorFormData,
} from '@/schemas/supervisor.schema';
import { supervisorService } from '@/services/supervisorService';
import type { EnteSinSupervisor } from '@/services/enteService';
import SelectEntesSheet from '@/components/supervisor/SelectEntesSheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Formulario para crear un Supervisor con su Organización y asignación de Entes
 *
 * Características:
 * - React Hook Form + Zod validation
 * - 3 Cards: Organización, Usuario, Entes
 * - Sheet modularizado para selección de Entes
 * - Deselección desde lista principal
 * - Entes opcionales
 */
export default function CreateSupervisorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEntes, setSelectedEntes] = useState<EnteSinSupervisor[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const form = useForm<CreateSupervisorFormData>({
    resolver: zodResolver(createSupervisorSchema),
    defaultValues: {
      nombreOrganizacion: '',
      rifOrganizacion: '',
      emailOrganizacion: '',
      nombreUsuario: '',
      apellidoUsuario: '',
      emailUsuario: '',
      password: '',
      entesIds: [],
    },
  });

  // Función para agregar un Ente a la selección
  function handleAddEnte(ente: EnteSinSupervisor) {
    setSelectedEntes((prev) => [...prev, ente]);
  }

  // Función para quitar un Ente de la selección
  function handleRemoveEnte(enteId: string) {
    setSelectedEntes((prev) => prev.filter((e) => e.id !== enteId));
  }

  // Submit del formulario
  async function onSubmit(values: CreateSupervisorFormData) {
    try {
      setIsSubmitting(true);

      // Agregar IDs de Entes seleccionados
      const dataToSend = {
        ...values,
        entesIds: selectedEntes.map((e) => e.id),
      };

      const response = await supervisorService.create(dataToSend);

      toast.success('¡Éxito!', {
        description: response.message,
      });

      // Resetear formulario y estados
      form.reset();
      setSelectedEntes([]);
    } catch (error) {
      toast.error('Error al crear el Supervisor', {
        description:
          error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Card 1: Información de la Organización */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Organización</CardTitle>
            <CardDescription>
              Datos de la organización del Supervisor
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {/* Nombre Organización */}
            <FormField
              control={form.control}
              name="nombreOrganizacion"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nombre de la Organización *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Contraloría Municipal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* RIF Organización */}
            <FormField
              control={form.control}
              name="rifOrganizacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RIF de la Organización *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: G-20000000-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Organización */}
            <FormField
              control={form.control}
              name="emailOrganizacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de la Organización *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Ej: contacto@contraloria.gob.ve"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Card 2: Información del Usuario Supervisor */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Usuario Supervisor</CardTitle>
            <CardDescription>
              Datos del usuario que administrará como Supervisor
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {/* Nombre Usuario */}
            <FormField
              control={form.control}
              name="nombreUsuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Usuario *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Carlos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Apellido Usuario */}
            <FormField
              control={form.control}
              name="apellidoUsuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido del Usuario *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ramírez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Usuario */}
            <FormField
              control={form.control}
              name="emailUsuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email del Usuario *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Ej: carlos.ramirez@supervision.gob.ve"
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
          </CardContent>
        </Card>

        {/* Card 3: Entes Asignados */}
        <Card>
          <CardHeader>
            <CardTitle>Entes Asignados</CardTitle>
            <CardDescription>
              Asigna Entes que este Supervisor gestionará (opcional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Botón para abrir Sheet */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSheetOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Ente(s)
            </Button>

            {/* Sheet para selección de Entes */}
            <SelectEntesSheet
              isOpen={isSheetOpen}
              onOpenChange={setIsSheetOpen}
              selectedEntes={selectedEntes}
              onAddEnte={handleAddEnte}
              onRemoveEnte={handleRemoveEnte}
            />

            {/* Lista de Entes Seleccionados */}
            <div className="space-y-2">
              {selectedEntes.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No hay Entes asignados
                </p>
              ) : (
                selectedEntes.map((ente) => (
                  <div
                    key={ente.id}
                    className="flex items-start justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">RIF:</span>{' '}
                        {ente.rif || 'No especificado'}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Nombre:</span>{' '}
                        {ente.nombre}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEnte(ente.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botón Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear Supervisor'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
