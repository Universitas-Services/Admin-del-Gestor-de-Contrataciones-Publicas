'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  documentoEjemploService,
  type DocumentoEjemplo,
  type DocumentoEjemploListMeta,
} from '@/services/documentoEjemploService';
import { DocumentoEjemploForm } from '@/components/configuracion/DocumentoEjemploForm';
import {
  DocumentosEjemploTable,
  type ActivoFilter,
} from '@/components/configuracion/DocumentosEjemploTable';
import { DocumentoEjemploEditDialog } from '@/components/configuracion/DocumentoEjemploEditDialog';
import { DocumentoEjemploReplaceImageDialog } from '@/components/configuracion/DocumentoEjemploReplaceImageDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const PAGE_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 300;

export default function DocumentosEjemploPage() {
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [documentos, setDocumentos] = useState<DocumentoEjemplo[]>([]);
  const [meta, setMeta] = useState<DocumentoEjemploListMeta>({
    total: 0,
    page: 1,
    lastPage: 1,
  });
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [activoFilter, setActivoFilter] = useState<ActivoFilter>('all');
  const [itemToEdit, setItemToEdit] = useState<DocumentoEjemplo | null>(null);
  const [itemToReplace, setItemToReplace] = useState<DocumentoEjemplo | null>(
    null
  );
  const [itemToDelete, setItemToDelete] = useState<DocumentoEjemplo | null>(
    null
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = searchInput.trim();
      setSearch((prev) => {
        if (prev !== nextSearch) {
          setPage(1);
        }
        return nextSearch;
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchDocumentos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await documentoEjemploService.getAll({
        page,
        limit: PAGE_LIMIT,
        ...(search ? { search } : {}),
        ...(activoFilter === 'all' ? {} : { activo: activoFilter === 'true' }),
      });
      setDocumentos(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al cargar los documentos de ejemplo'
      );
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [page, search, activoFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga listado desde API
    void fetchDocumentos();
  }, [fetchDocumentos]);

  function handleActivoFilterChange(value: ActivoFilter) {
    setActivoFilter(value);
    setPage(1);
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;
    try {
      setDeleting(true);
      const result = await documentoEjemploService.delete(itemToDelete.id);
      toast.success(result.message || 'Documento eliminado exitosamente');
      setItemToDelete(null);
      await fetchDocumentos();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al eliminar el documento'
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 overflow-x-hidden">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold text-gray-900">
          Documentos de Ejemplo
        </h1>
        <p className="mt-2 text-gray-600">
          Catálogo global de guías visuales. UNIVERSITAS administra las capturas
          que los Entes consultan como referencia al llenar formularios.
        </p>
      </div>

      <DocumentoEjemploForm onSuccess={fetchDocumentos} />

      {initialLoad && loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      ) : (
        <div className="relative space-y-2">
          {loading && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
              Actualizando listado...
            </div>
          )}
          <DocumentosEjemploTable
            data={documentos}
            page={meta.page}
            lastPage={meta.lastPage}
            total={meta.total}
            search={searchInput}
            activoFilter={activoFilter}
            onSearchChange={setSearchInput}
            onActivoFilterChange={handleActivoFilterChange}
            onPageChange={setPage}
            onEdit={setItemToEdit}
            onReplaceImage={setItemToReplace}
            onDelete={setItemToDelete}
          />
        </div>
      )}

      <DocumentoEjemploEditDialog
        item={itemToEdit}
        open={itemToEdit !== null}
        onOpenChange={(open) => !open && setItemToEdit(null)}
        onSuccess={fetchDocumentos}
      />

      <DocumentoEjemploReplaceImageDialog
        item={itemToReplace}
        open={itemToReplace !== null}
        onOpenChange={(open) => !open && setItemToReplace(null)}
        onSuccess={fetchDocumentos}
      />

      <Dialog
        open={itemToDelete !== null}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar documento de ejemplo?</DialogTitle>
            <DialogDescription>
              El documento &quot;{itemToDelete?.codigo}&quot; (
              {itemToDelete?.nombre}) dejará de estar disponible (borrado
              lógico).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setItemToDelete(null)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
