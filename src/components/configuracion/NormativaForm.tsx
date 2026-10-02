'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  normativaSchema,
  type NormativaFormData,
} from '@/schemas/normativa.schema';
import { normativaService, type Normativa } from '@/services/normativaService';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface NormativaFormProps {
  editingItem: Normativa | null;
  onSuccess: () => void;
  onCancelEdit: () => void;
}

export function NormativaForm({
  editingItem,
  onSuccess,
  onCancelEdit,
}: NormativaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NormativaFormData>({
    resolver: zodResolver(normativaSchema),
    defaultValues: {
      textoNormativaCompleto: editingItem?.textoNormativaCompleto ?? '',
      indActivo: editingItem?.indActivo ?? true,
    },
  });

  const isEditing = editingItem !== null;

  async function onSubmit(values: NormativaFormData) {
    try {
      setIsSubmitting(true);
      if (isEditing && editingItem) {
        await normativaService.update(editingItem.id, values);
        toast.success('Normativa actualizada exitosamente');
        onCancelEdit();
      } else {
        await normativaService.create(values);
        toast.success('Normativa registrada exitosamente');
      }
      form.reset({ textoNormativaCompleto: '', indActivo: true });
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al guardar normativa'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    form.reset({ textoNormativaCompleto: '', indActivo: true });
    onCancelEdit();
  }

  return (
    <Card className="border-border w-full max-w-full min-w-0 overflow-hidden shadow-md">
      <CardHeader className="min-w-0">
        <CardTitle>
          {isEditing ? 'Editar normativa' : 'Registrar normativa'}
        </CardTitle>
        <CardDescription className="break-words">
          Transcriba la denominación oficial de la norma de rango nacional,
          incluyendo de forma íntegra el número de la Gaceta Oficial, su
          carácter (Ordinaria o Extraordinaria), fecha de publicación y/o año de
          aprobación, la cual estará disponible como marco jurídico general para
          todos los Entes Públicos.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="textoNormativaCompleto"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Texto de la normativa
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder="Ej: Ley Orgánica de Contrataciones Públicas, Gaceta Oficial Extraordinaria N° 6.890 de fecha..."
                      className="max-w-full rounded-xl border-2 border-slate-100 text-base break-words shadow-sm focus-visible:border-blue-600 focus-visible:ring-blue-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="indActivo"
              render={({ field }) => (
                <FormItem className="flex min-w-0 flex-row items-center justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                      Activo
                    </FormLabel>
                    <p className="text-muted-foreground text-sm break-words">
                      La normativa estará disponible para todos los Entes
                      Públicos.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 flex-1 rounded-xl bg-[#2A5C9A] text-base font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-[#1E4370]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'ACTUALIZANDO...' : 'GUARDANDO...'}
                  </>
                ) : isEditing ? (
                  'ACTUALIZAR NORMATIVA'
                ) : (
                  'GUARDAR NORMATIVA'
                )}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="h-12 rounded-xl"
                >
                  Cancelar edición
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
