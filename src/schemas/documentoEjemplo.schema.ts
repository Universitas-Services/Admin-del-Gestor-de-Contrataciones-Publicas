import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const documentoFileSchema = z
  .custom<File>((val) => val instanceof File, {
    message: 'Debe seleccionar un archivo',
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: 'El archivo no puede superar 5 MB',
  })
  .refine(
    (file) =>
      ACCEPTED_FILE_TYPES.includes(file.type) ||
      /\.(pdf|docx?)$/i.test(file.name),
    {
      message: 'Solo se permiten PDF o DOCX',
    }
  );

/** Alineado con la validación del backend (kebab-case). */
const codigoDocumentoSchema = z
  .string()
  .min(1, 'El código es obligatorio')
  .max(100, 'El código no puede exceder 100 caracteres')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'El código sólo admite minúsculas, números y guiones (ej: documento-01)'
  );

export const createDocumentoEjemploSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  codigo: codigoDocumentoSchema,
  descripcion: z.string(),
  orden: z.number().int().min(0, 'El orden debe ser 0 o mayor').optional(),
  file: documentoFileSchema,
});

export const updateDocumentoEjemploSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  codigo: codigoDocumentoSchema,
  descripcion: z.string(),
  orden: z.number().int().min(0, 'El orden debe ser 0 o mayor'),
  activo: z.boolean(),
});

export const replaceDocumentoEjemploImageSchema = z.object({
  file: documentoFileSchema,
});

export type CreateDocumentoEjemploFormData = z.infer<
  typeof createDocumentoEjemploSchema
>;
export type UpdateDocumentoEjemploFormData = z.infer<
  typeof updateDocumentoEjemploSchema
>;
export type ReplaceDocumentoEjemploImageFormData = z.infer<
  typeof replaceDocumentoEjemploImageSchema
>;

export const DOCUMENTO_EJEMPLO_ACCEPT =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
