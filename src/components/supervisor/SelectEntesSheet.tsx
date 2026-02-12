'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { enteService, type EnteSinSupervisor } from '@/services/enteService';

interface SelectEntesSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEntes: EnteSinSupervisor[];
  onAddEnte: (ente: EnteSinSupervisor) => void;
  onRemoveEnte: (enteId: string) => void;
}

/**
 * Componente Sheet para seleccionar Entes disponibles (sin Supervisor asignado)
 *
 * Características:
 * - Carga automática de Entes al abrir
 * - Filtra Entes ya seleccionados
 * - Botones "Agregar" / "Quitar" dinámicos
 * - Manejo de campos null con "No especificado"
 */
export default function SelectEntesSheet({
  isOpen,
  onOpenChange,
  selectedEntes,
  onAddEnte,
  onRemoveEnte,
}: SelectEntesSheetProps) {
  const [availableEntes, setAvailableEntes] = useState<EnteSinSupervisor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar Entes disponibles cuando se abre el Sheet
  useEffect(() => {
    if (isOpen) {
      fetchAvailableEntes();
    }
  }, [isOpen]);

  // Función para cargar Entes disponibles
  async function fetchAvailableEntes() {
    setIsLoading(true);
    try {
      const entes = await enteService.getEntesSinSupervisor();
      // Filtrar entes que ya están seleccionados
      const filtered = entes.filter(
        (ente) => !selectedEntes.some((selected) => selected.id === ente.id)
      );
      setAvailableEntes(filtered);
    } catch (error) {
      toast.error('Error al cargar Entes disponibles', {
        description:
          error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Verificar si un Ente está seleccionado
  function isEnteSelected(enteId: string): boolean {
    return selectedEntes.some((ente) => ente.id === enteId);
  }

  // Manejar agregar Ente
  function handleAdd(ente: EnteSinSupervisor) {
    onAddEnte(ente);
    // Remover de la lista disponible
    setAvailableEntes((prev) => prev.filter((e) => e.id !== ente.id));
  }

  // Manejar quitar Ente
  function handleRemove(ente: EnteSinSupervisor) {
    onRemoveEnte(ente.id);
    // Agregar de vuelta a la lista disponible
    setAvailableEntes((prev) => [...prev, ente]);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Entes disponibles</SheetTitle>
          <SheetDescription>
            Selecciona los Entes para asignar a este Supervisor
          </SheetDescription>
        </SheetHeader>

        {/* Contenido del Sheet */}
        <div className="mt-6 max-h-[calc(100vh-150px)] space-y-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
          ) : availableEntes.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No hay Entes disponibles para asignar
            </p>
          ) : (
            availableEntes.map((ente) => {
              const isSelected = isEnteSelected(ente.id);

              return (
                <Card key={ente.id}>
                  <CardContent className="pt-6">
                    <h4 className="text-lg font-semibold">{ente.nombre}</h4>
                    <div className="mt-3 space-y-1.5 text-sm">
                      <p className={ente.rif ? '' : 'text-muted-foreground'}>
                        <span className="font-medium">RIF:</span>{' '}
                        {ente.rif || 'No especificado'}
                      </p>
                      <p className={ente.estado ? '' : 'text-muted-foreground'}>
                        <span className="font-medium">Estado:</span>{' '}
                        {ente.estado || 'No especificado'}
                      </p>
                      <p
                        className={
                          ente.municipio ? '' : 'text-muted-foreground'
                        }
                      >
                        <span className="font-medium">Municipio:</span>{' '}
                        {ente.municipio || 'No especificado'}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      {!isSelected ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleAdd(ente)}
                        >
                          Agregar
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemove(ente)}
                        >
                          Quitar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
