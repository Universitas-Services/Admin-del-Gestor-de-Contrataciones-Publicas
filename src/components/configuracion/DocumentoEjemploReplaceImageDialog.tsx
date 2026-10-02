'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FileText, Loader2, Upload } from 'lucide-react';
import {
  replaceDocumentoEjemploImageSchema,
  DOCUMENTO_EJEMPLO_ACCEPT,
  type ReplaceDocumentoEjemploImageFormData,
} from '@/schemas/documentoEjemplo.schema';
import {
  documentoEjemploService,
  type DocumentoEjemplo,
} from '@/services/documentoEjemploService';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DocumentoEjemploReplaceImageDialogProps {
  item: DocumentoEjemplo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

function isPdf(file: File): boolean {
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
}

export function DocumentoEjemploReplaceImageDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: DocumentoEjemploReplaceImageDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ReplaceDocumentoEjemploImageFormData>({
    resolver: zodResolver(replaceDocumentoEjemploImageSchema),
    defaultValues: {
      file: undefined as unknown as File,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form watch
  const selectedFile = form.watch('file');

  useEffect(() => {
    if (!open) {
      form.reset({ file: undefined as unknown as File });
      setPreviewUrl(null);
    }
  }, [open, form]);

  useEffect(() => {
    if (!(selectedFile instanceof File) || !isPdf(selectedFile)) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  async function onSubmit(values: ReplaceDocumentoEjemploImageFormData) {
    if (!item) return;
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('file', values.file);
      await documentoEjemploService.replaceImage(item.id, formData);
      toast.success('Archivo reemplazado exitosamente');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al reemplazar el archivo'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reemplazar archivo</DialogTitle>
          <DialogDescription>
            Reemplace el archivo de{' '}
            <span className="font-medium">{item?.codigo}</span>. Se conservan
            código y metadatos. Formatos: PDF o DOCX (máx. 5 MB).
          </DialogDescription>
        </DialogHeader>

        {item?.url && !previewUrl && (
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Archivo actual</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-teal-700 underline"
            >
              <FileText className="h-4 w-4" />
              Ver archivo actual
            </a>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nuevo archivo</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 transition-colors hover:border-teal-400">
                        <Upload className="h-6 w-6 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          PDF o DOCX (máx. 5 MB)
                        </span>
                        <Input
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          type="file"
                          accept={DOCUMENTO_EJEMPLO_ACCEPT}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                        />
                      </label>
                      {selectedFile instanceof File && (
                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <FileText className="h-4 w-4 shrink-0" />
                          <span className="truncate">{selectedFile.name}</span>
                        </p>
                      )}
                      {previewUrl && (
                        <iframe
                          title="Vista previa PDF"
                          src={previewUrl}
                          className="h-40 w-full rounded-lg border"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#2A5C9A] hover:bg-[#1E4370]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  'Reemplazar archivo'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
