'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, KeyRound } from 'lucide-react';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/schemas/changePassword.schema';
import { authService } from '@/services/authService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

interface ChangePasswordModalProps {
  /** UUID del usuario al que se le cambiará la contraseña */
  targetUserId: string;
  /** Nombre visible del usuario (para el título del modal) */
  userName: string;
}

/**
 * Modal para cambiar la contraseña temporal de un usuario.
 * Permite a un administrador (UNIVERSITAS / ADMIN_ENTE) asignar
 * una nueva contraseña a un usuario de menor jerarquía.
 */
export default function ChangePasswordModal({
  targetUserId,
  userName,
}: ChangePasswordModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  async function onSubmit(values: ChangePasswordFormData) {
    try {
      setIsSubmitting(true);

      const response = await authService.changeUserPassword({
        targetUserId,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      toast.success('¡Contraseña actualizada!', {
        description: response.message,
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error('Error al cambiar la contraseña', {
        description:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error desconocido',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Reset form when the dialog closes
  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmNewPassword(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-background border-border gap-2 shadow-sm"
        >
          <KeyRound className="h-4 w-4" />
          Nueva Clave Temporal
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <KeyRound className="text-primary h-5 w-5" />
            Cambiar Contraseña Temporal
          </DialogTitle>
          <DialogDescription>
            Asignar una nueva contraseña temporal para{' '}
            <span className="text-foreground font-semibold">{userName}</span>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 pt-2"
          >
            {/* Contraseña Actual del Admin */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Contraseña administrador Universitas *
                  </FormLabel>
                  <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs italic">
                    Coloque su contraseña por favor
                  </span>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="bg-background focus-visible:ring-primary pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors focus:outline-none"
                      >
                        {showCurrentPassword ? (
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

            {/* Nueva Contraseña */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Nueva contraseña *
                  </FormLabel>
                  <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs italic">
                    Coloque la contraseña nueva temporal del usuario
                    <br />
                    Ejemplo: Aa123456*
                  </span>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        className="bg-background focus-visible:ring-primary pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors focus:outline-none"
                      >
                        {showNewPassword ? (
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

            {/* Confirmar Nueva Contraseña */}
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Confirmar contraseña *
                  </FormLabel>
                  <span className="text-muted-foreground/75 -mt-1 mb-1.5 block text-xs italic">
                    Coloque nuevamente la nueva contraseña temporal del usuario
                  </span>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        className="bg-background focus-visible:ring-primary pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmNewPassword((prev) => !prev)
                        }
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors focus:outline-none"
                      >
                        {showConfirmNewPassword ? (
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

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-32 font-semibold shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cambiando...
                  </>
                ) : (
                  'Cambiar Contraseña'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
