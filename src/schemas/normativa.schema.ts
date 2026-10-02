import { z } from 'zod';

export const normativaSchema = z.object({
  textoNormativaCompleto: z
    .string()
    .min(1, 'La normativa es obligatoria')
    .min(10, 'La normativa debe tener al menos 10 caracteres'),
  indActivo: z.boolean(),
});

export type NormativaFormData = z.infer<typeof normativaSchema>;
