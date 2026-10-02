'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  clausulaService,
  type Clausula,
  type ClausulaListMeta,
} from '@/services/clausulaService';
import { ClausulaForm } from '@/components/configuracion/ClausulaForm';
import { ClausulasTable } from '@/components/configuracion/ClausulasTable';
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

export default function ClausulasPage() {
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [clausulas, setClausulas] = useState<Clausula[]>([]);
  const [meta, setMeta] = useState<ClausulaListMeta>({
    total: 0,
    page: 1,
    lastPage: 1,
  });
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<Clausula | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Clausula | null>(null);

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

  const fetchClausulas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await clausulaService.getAll({
        page,
        limit: PAGE_LIMIT,
        ...(search ? { search } : {}),
      });
      setClausulas(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al cargar las cláusulas'
      );
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [page, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga listado desde API
    void fetchClausulas();
  }, [fetchClausulas]);

  function handleEdit(item: Clausula) {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingItem(null);
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;
    try {
      setDeleting(true);
      await clausulaService.delete(itemToDelete.id);
      toast.success('Cláusula eliminada exitosamente');
      if (editingItem?.id === itemToDelete.id) {
        setEditingItem(null);
      }
      setItemToDelete(null);
      await fetchClausulas();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al eliminar cláusula'
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 overflow-x-hidden">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold text-gray-900">
          Cláusulas Genéricas
        </h1>
        <p className="mt-2 text-gray-600">
          Administre la biblioteca de cláusulas modelo disponibles para todos
          los Entes Públicos al armar el Modelo de Contrato.
        </p>
      </div>

      <ClausulaForm
        key={editingItem?.id ?? 'new'}
        editingItem={editingItem}
        onSuccess={fetchClausulas}
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
          <ClausulasTable
            data={clausulas}
            page={meta.page}
            lastPage={meta.lastPage}
            total={meta.total}
            search={searchInput}
            onSearchChange={setSearchInput}
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
            <DialogTitle>¿Eliminar cláusula?</DialogTitle>
            <DialogDescription>
              La cláusula &quot;{itemToDelete?.titulo}&quot; dejará de estar
              disponible en la biblioteca (borrado lógico).
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
