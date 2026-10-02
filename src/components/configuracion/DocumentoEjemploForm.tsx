'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FileText, Loader2, Upload } from 'lucide-react';
import {
  createDocumentoEjemploSchema,
  DOCUMENTO_EJEMPLO_ACCEPT,
  type CreateDocumentoEjemploFormData,
} from '@/schemas/documentoEjemplo.schema';
import { documentoEjemploService } from '@/services/documentoEjemploService';
import {
  DOCUMENTOS_EJEMPLO_CODIGOS,
  findDocumentoEjemploCodigo,
} from '@/lib/constants/documentosEjemploCodigos';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CODIGO_MANUAL = '__manual__';

interface DocumentoEjemploFormProps {
  onSuccess: () => void;
}

export function DocumentoEjemploForm({ onSuccess }: DocumentoEjemploFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [codigoMode, setCodigoMode] = useState<string>('');

  const form = useForm<CreateDocumentoEjemploFormData>({
    resolver: zodResolver(createDocumentoEjemploSchema),
    defaultValues: {
      nombre: '',
      codigo: '',
      descripcion: '',
      orden: undefined,
      file: undefined as unknown as File,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form watch
  const selectedFile = form.watch('file');

  useEffect(() => {
    if (!(selectedFile instanceof File)) {
      setPreviewUrl(null);
      return;
    }
    if (
      selectedFile.type !== 'application/pdf' &&
      !/\.pdf$/i.test(selectedFile.name)
    ) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function handleCodigoCatalogChange(value: string) {
    setCodigoMode(value);
    if (value === CODIGO_MANUAL) {
      form.setValue('codigo', '');
      return;
    }
    const def = findDocumentoEjemploCodigo(value);
    if (def) {
      form.setValue('codigo', def.codigo);
      form.setValue('nombre', def.nombre);
    }
  }

  async function onSubmit(values: CreateDocumentoEjemploFormData) {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('nombre', values.nombre);
      formData.append('file', values.file);
      formData.append('codigo', values.codigo.trim());
      if (values.descripcion?.trim()) {
        formData.append('descripcion', values.descripcion.trim());
      }
      if (values.orden !== undefined && !Number.isNaN(values.orden)) {
        formData.append('orden', String(values.orden));
      }

      await documentoEjemploService.create(formData);
      toast.success('Documento de ejemplo creado exitosamente');
      form.reset({
        nombre: '',
        codigo: '',
        descripcion: '',
        orden: undefined,
        file: undefined as unknown as File,
      });
      setCodigoMode('');
      setPreviewUrl(null);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al crear el documento de ejemplo'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-border w-full max-w-full min-w-0 overflow-hidden shadow-md">
      <CardHeader className="min-w-0">
        <CardTitle>Registrar documento de ejemplo</CardTitle>
        <CardDescription className="break-words">
          Suba el modelo en PDF o DOCX (máx. 5 MB) asociado al recaudo de
          Calificación Legal. El código en kebab-case es el que usa «Ver modelo»
          en el Gestor.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                Recaudo / código del catálogo *
              </FormLabel>
              <Select
                value={codigoMode}
                onValueChange={handleCodigoCatalogChange}
              >
                <SelectTrigger className="h-12 w-full rounded-xl border-2 border-slate-100">
                  <SelectValue placeholder="Seleccione el recaudo (Sobre 1 o 2)" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value={CODIGO_MANUAL}>
                    Otro (escribir código manualmente)
                  </SelectItem>
                  {DOCUMENTOS_EJEMPLO_CODIGOS.map((item) => (
                    <SelectItem key={item.codigo} value={item.codigo}>
                      {`S${item.sobre}${item.esSustituto ? ' · Sust.' : ''} — ${item.nombre}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Código *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={
                        codigoMode !== '' && codigoMode !== CODIGO_MANUAL
                      }
                      placeholder="mod-carta-manifestacion-voluntad-au-au"
                      className="h-12 rounded-xl border-2 border-slate-100 font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Nombre *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej: Carta de Manifestación de Voluntad"
                      className="h-12 rounded-xl border-2 border-slate-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="orden"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                      Orden (opcional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? undefined : Number(val));
                        }}
                        placeholder="0"
                        className="h-12 rounded-xl border-2 border-slate-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Descripción (opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Notas internas sobre este modelo..."
                      className="rounded-xl border-2 border-slate-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Archivo (PDF / DOCX) *
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 transition-colors hover:border-teal-400 hover:bg-teal-50/30">
                        <Upload className="h-8 w-8 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          Clic para seleccionar PDF o DOCX (máx. 5 MB)
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
                          className="h-64 w-full rounded-lg border"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-[#2A5C9A] text-base font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-[#1E4370] sm:w-auto sm:min-w-[220px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  GUARDANDO...
                </>
              ) : (
                'GUARDAR DOCUMENTO'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
