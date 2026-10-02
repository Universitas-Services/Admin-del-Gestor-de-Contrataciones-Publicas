'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  normativaService,
  type Normativa,
  type NormativaListMeta,
} from '@/services/normativaService';
import { NormativaForm } from '@/components/configuracion/NormativaForm';
import {
  NormativasTable,
  type IndActivoFilter,
} from '@/components/configuracion/NormativasTable';
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

export default function NormativasPage() {
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [normativas, setNormativas] = useState<Normativa[]>([]);
  const [meta, setMeta] = useState<NormativaListMeta>({
    total: 0,
    page: 1,
    lastPage: 1,
  });
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [indActivoFilter, setIndActivoFilter] =
    useState<IndActivoFilter>('all');
  const [editingItem, setEditingItem] = useState<Normativa | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Normativa | null>(null);

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

  const fetchNormativas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await normativaService.getAll({
        page,
        limit: PAGE_LIMIT,
        ...(search ? { search } : {}),
        ...(indActivoFilter === 'all'
          ? {}
          : { indActivo: indActivoFilter === 'true' }),
      });
      setNormativas(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al cargar las normativas'
      );
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [page, search, indActivoFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga listado desde API
    void fetchNormativas();
  }, [fetchNormativas]);

  function handleEdit(item: Normativa) {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingItem(null);
  }

  function handleIndActivoFilterChange(value: IndActivoFilter) {
    setIndActivoFilter(value);
    setPage(1);
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;
    try {
      setDeleting(true);
      await normativaService.delete(itemToDelete.id);
      toast.success('Normativa eliminada exitosamente');
      if (editingItem?.id === itemToDelete.id) {
        setEditingItem(null);
      }
      setItemToDelete(null);
      await fetchNormativas();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al eliminar normativa'
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 overflow-x-hidden">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold text-gray-900">Normativas Legales</h1>
        <p className="mt-2 text-gray-600">
          Gestione el marco jurídico general de rango nacional disponible para
          todos los Entes Públicos.
        </p>
      </div>

      <NormativaForm
        key={editingItem?.id ?? 'new'}
        editingItem={editingItem}
        onSuccess={fetchNormativas}
        onCancelEdit={handleCancelEdit}
      />

      {initialLoad && loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="relative space-y-2">
          {loading && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              Actualizando listado...
            </div>
          )}
          <NormativasTable
            data={normativas}
            page={meta.page}
            lastPage={meta.lastPage}
            total={meta.total}
            search={searchInput}
            indActivoFilter={indActivoFilter}
            onSearchChange={setSearchInput}
            onIndActivoFilterChange={handleIndActivoFilterChange}
            onPageChange={setPage}
            onEdit={handleEdit}
            onDelete={setItemToDelete}
          />
        </div>
      )}

      <Dialog
        open={itemToDelete !== null}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar normativa?</DialogTitle>
            <DialogDescription>
              La normativa dejará de estar disponible en el sistema (borrado
              lógico). Podrás gestionar el resto de normativas desde este
              módulo.
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
