import { z } from 'zod';

function isHtmlEmpty(html: string): boolean {
  const stripped = html.replace(/<[^>]*>/g, '').trim();
  return stripped.length === 0;
}

export const clausulaSchema = z.object({
  titulo: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(255, 'El título no puede exceder 255 caracteres'),
  cuerpo: z
    .string()
    .min(1, 'El cuerpo de la cláusula es obligatorio')
    .refine((val) => !isHtmlEmpty(val), {
      message: 'El cuerpo de la cláusula es obligatorio',
    }),
});

export type ClausulaFormData = z.infer<typeof clausulaSchema>;
