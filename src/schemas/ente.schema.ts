import { z } from 'zod';

export const createEnteSchema = z.object({
  // CAMPOS OBLIGATORIOS
  nombre: z
    .string()
    .min(1, 'El nombre del Ente es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),

  emailContacto: z
    .string()
    .min(1, 'El email del Admin Ente es obligatorio')
    .email('Debe ser un email válido'),

  password: z.string().min(1, 'La contraseña es obligatoria'),

  nombreAdmin: z
    .string()
    .min(1, 'El nombre del administrador es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  apellidoAdmin: z
    .string()
    .min(1, 'El apellido del administrador es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede exceder 100 caracteres'),

  // CAMPOS OPCIONALES
  rif: z.string().optional().or(z.literal('')),

  siglas: z.string().optional().or(z.literal('')),

  // logoUrl: NO se incluye en el formulario

  direccionFiscal: z.string().optional().or(z.literal('')),

  estado: z.string().optional().or(z.literal('')),

  municipio: z.string().optional().or(z.literal('')),

  parroquia: z.string().optional().or(z.literal('')),
});

export type CreateEnteFormData = z.infer<typeof createEnteSchema>;
