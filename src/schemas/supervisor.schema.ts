import { z } from 'zod';

/**
 * Schema de validación para crear un Supervisor
 * Todos los campos son obligatorios excepto entesIds
 */
export const createSupervisorSchema = z.object({
  // Información de la Organización
  nombreOrganizacion: z
    .string()
    .min(1, 'El nombre de la organización es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),

  rifOrganizacion: z
    .string()
    .min(1, 'El RIF de la organización es obligatorio')
    .regex(/^[JGVE]-\d{8,9}-\d$/, 'Formato de RIF inválido (Ej: J-12345678-9)'),

  emailOrganizacion: z
    .string()
    .min(1, 'El email de la organización es obligatorio')
    .email('Debe ser un email válido'),

  // Información del Usuario Supervisor
  nombreUsuario: z
    .string()
    .min(1, 'El nombre del usuario es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  apellidoUsuario: z
    .string()
    .min(1, 'El apellido del usuario es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede exceder 100 caracteres'),

  emailUsuario: z
    .string()
    .min(1, 'El email del usuario es obligatorio')
    .email('Debe ser un email válido'),

  password: z.string().min(1, 'La contraseña es obligatoria'),

  // Entes Asignados (Opcional - pero con default para evitar undefined)
  entesIds: z.array(z.string().uuid()).default([]),
});

export type CreateSupervisorFormData = z.infer<typeof createSupervisorSchema>;
