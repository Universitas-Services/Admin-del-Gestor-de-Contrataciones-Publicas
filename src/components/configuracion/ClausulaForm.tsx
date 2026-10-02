'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  clausulaSchema,
  type ClausulaFormData,
} from '@/schemas/clausula.schema';
import { clausulaService, type Clausula } from '@/services/clausulaService';
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
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface ClausulaFormProps {
  editingItem: Clausula | null;
  onSuccess: () => void;
  onCancelEdit: () => void;
}

const EMPTY_VALUES: ClausulaFormData = { titulo: '', cuerpo: '' };

export function ClausulaForm({
  editingItem,
  onSuccess,
  onCancelEdit,
}: ClausulaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const form = useForm<ClausulaFormData>({
    resolver: zodResolver(clausulaSchema),
    defaultValues: {
      titulo: editingItem?.titulo ?? '',
      cuerpo: editingItem?.cuerpo ?? '',
    },
  });

  const isEditing = editingItem !== null;

  // El padre remonta con key={editingItem?.id ?? 'new'}; no hace falta sync en effect.

  function resetFormClean() {
    form.reset(EMPTY_VALUES, {
      keepErrors: false,
      keepDirty: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepSubmitCount: false,
    });
    setEditorKey((key) => key + 1);
  }

  async function onSubmit(values: ClausulaFormData) {
    try {
      setIsSubmitting(true);
      if (isEditing && editingItem) {
        await clausulaService.update(editingItem.id, values);
        toast.success('Cláusula actualizada exitosamente');
        onCancelEdit();
      } else {
        await clausulaService.create(values);
        toast.success('Cláusula registrada exitosamente');
        resetFormClean();
      }
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al guardar cláusula'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    resetFormClean();
    onCancelEdit();
  }

  return (
    <Card className="border-border w-full max-w-full min-w-0 overflow-hidden shadow-md">
      <CardHeader className="min-w-0">
        <CardTitle>
          {isEditing ? 'Editar cláusula' : 'Registrar cláusula'}
        </CardTitle>
        <CardDescription className="break-words">
          Indique la denominación o título descriptivo de la cláusula
          personalizada para su registro, catalogación y búsqueda predictiva en
          la biblioteca corporativa. Transcriba de forma íntegra el texto
          normativo que compone el cuerpo de la cláusula.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Título de la cláusula
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={255}
                      placeholder='Ej: "Objeto del contrato"'
                      className="h-12 max-w-full rounded-xl border-2 border-slate-100 text-base shadow-sm focus-visible:border-blue-600 focus-visible:ring-blue-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cuerpo"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Cuerpo de la cláusula
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      key={editorKey}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Transcriba el texto normativo, condiciones, derechos, obligaciones y regulaciones especiales..."
                      disabled={isSubmitting}
                      className="max-w-full"
                    />
                  </FormControl>
                  <FormMessage />
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
                  'ACTUALIZAR CLÁUSULA'
                ) : (
                  'GUARDAR CLÁUSULA'
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
