'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, X, Loader2, Eye, EyeOff } from 'lucide-react';
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Formulario para crear un Supervisor con su Organización y asignación de Entes
 */
export default function CreateSupervisorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEntes, setSelectedEntes] = useState<EnteSinSupervisor[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">
              Información de la Organización
            </CardTitle>
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
                  <FormLabel className="font-semibold">
                    Nombre de la Organización *
                  </FormLabel>
                  <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs">
                    Ejemplo: Contraloría Municipal
                  </span>
                  <FormControl>
                    <Input
                      className="bg-background focus-visible:ring-primary"
                      {...field}
                    />
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
                  <FormLabel className="font-semibold">
                    RIF de la Organización *
                  </FormLabel>
                  <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs">
                    Ejemplo: G-20000000-1
                  </span>
                  <FormControl>
                    <Input
                      className="bg-background focus-visible:ring-primary"
                      {...field}
                    />
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
                  <FormLabel className="font-semibold">
                    Email de la Organización *
                  </FormLabel>
                  <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs">
                    Ejemplo: contacto@contraloria.gob.ve
                  </span>
                  <FormControl>
                    <Input
                      type="email"
                      className="bg-background focus-visible:ring-primary"
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
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">
              Información del Usuario Supervisor
            </CardTitle>
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
                  <FormLabel className="font-semibold">
                    Nombre del Usuario *
                  </FormLabel>
                  <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs">
                    Ejemplo: Carlos
                  </span>
                  <FormControl>
                    <Input
                      className="bg-background focus-visible:ring-primary"
                      {...field}
                    />
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
                  <FormLabel className="font-semibold">
                    Apellido del Usuario *
                  </FormLabel>
                  <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs">
                    Ejemplo: Ramírez
                  </span>
                  <FormControl>
                    <Input
                      className="bg-background focus-visible:ring-primary"
                      {...field}
                    />
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
                  <FormLabel className="font-semibold">
                    Email del Usuario *
                  </FormLabel>
                  <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs">
                    Ejemplo: carlos.ramirez@supervision.gob.ve
                  </span>
                  <FormControl>
                    <Input
                      type="email"
                      className="bg-background focus-visible:ring-primary"
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
                  <FormLabel className="font-semibold">Contraseña *</FormLabel>
                  <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs">
                    Ejemplo: ClaveTemp123!
                  </span>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className="bg-background focus-visible:ring-primary pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Card 3: Entes Asignados */}
        <Card className="border-border shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">
                  Entes Asignados
                </CardTitle>
                <CardDescription>
                  Asigna Entes que este Supervisor gestionará (opcional)
                </CardDescription>
              </div>
              {/* Botón para abrir Sheet */}
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer font-semibold shadow-sm"
                onClick={() => setIsSheetOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Ente(s)
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Sheet para selección de Entes */}
            <SelectEntesSheet
              isOpen={isSheetOpen}
              onOpenChange={setIsSheetOpen}
              selectedEntes={selectedEntes}
              onAddEnte={handleAddEnte}
              onRemoveEnte={handleRemoveEnte}
            />

            {/* Tabla de Entes Seleccionados */}
            <Table>
              <TableCaption>
                Puede asignar múltiples entes a un solo supervisor.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>RIF</TableHead>
                  <TableHead>NOMBRE</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedEntes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-muted-foreground text-center"
                    >
                      No hay Entes asignados
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedEntes.map((ente, index) => (
                    <TableRow
                      key={ente.id}
                      className={index % 2 === 0 ? 'bg-muted/50' : ''}
                    >
                      <TableCell>{ente.rif || 'No especificado'}</TableCell>
                      <TableCell>{ente.nombre}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => handleRemoveEnte(ente.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Botón Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-32 cursor-pointer font-semibold shadow-sm"
          >
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
