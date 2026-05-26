import { z } from 'zod';

/**
 * Schema de validación para cambiar la contraseña de un usuario
 * Usado por administradores (UNIVERSITAS / ADMIN_ENTE) para resetear
 * contraseñas de usuarios de menor jerarquía
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),

    newPassword: z
      .string()
      .min(1, 'La nueva contraseña es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
      .regex(/[a-z]/, 'La contraseña debe tener al menos una letra minúscula')
      .regex(/[0-9]/, 'La contraseña debe tener al menos un número')
      .regex(
        /[^A-Za-z0-9]/,
        'La contraseña debe tener al menos un carácter especial'
      ),

    confirmNewPassword: z
      .string()
      .min(1, 'Confirmar la contraseña es obligatorio'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
