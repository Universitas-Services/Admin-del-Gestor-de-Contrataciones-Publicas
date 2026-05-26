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
import { Loader2, Eye, EyeOff } from 'lucide-react';

/**
 * Componente CreateEnteForm
 * Formulario simplificado para crear un Ente Público con su Admin Ente
 */
export default function CreateEnteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        <Card className="border-border shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold tracking-tight">
              Información de Creación de Ente
            </CardTitle>
            <CardDescription>
              Complete los siguientes campos obligatorios para registrar el
              nuevo Ente Público y su administrador.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Nombre del Ente */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Nombre del Ente *
                  </FormLabel>
                  <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs">
                    Ejemplo: Alcaldía del Municipio Libertador
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

            <div className="grid gap-5 md:grid-cols-2">
              {/* Nombre Admin */}
              <FormField
                control={form.control}
                name="nombreAdmin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Nombre del administrador *
                    </FormLabel>
                    <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs">
                      Ejemplo: Juan
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

              {/* Apellido Admin */}
              <FormField
                control={form.control}
                name="apellidoAdmin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Apellido del administrador *
                    </FormLabel>
                    <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs">
                      Ejemplo: Pérez
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
            </div>

            {/* Email Contacto */}
            <FormField
              control={form.control}
              name="emailContacto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Email de contacto *
                  </FormLabel>
                  <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs">
                    Ejemplo: admin@alcaldia.gov.ve
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

        {/* Botón de Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-32 font-semibold shadow-sm"
          >
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
