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
      // Mostrar TODOS los entes, sin filtrar los seleccionados
      setAvailableEntes(entes);
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
    // El ente permanece visible en la lista
  }

  // Manejar quitar Ente
  function handleRemove(ente: EnteSinSupervisor) {
    onRemoveEnte(ente.id);
    // El ente sigue visible en la lista
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-100 sm:w-135">
        <SheetHeader className="shrink-0 pb-0">
          <SheetTitle>Entes disponibles</SheetTitle>
          <SheetDescription>
            Selecciona los Entes para asignar a este Supervisor
          </SheetDescription>
        </SheetHeader>

        {/* Contenido del Sheet */}
        <div className="mt-2 mb-2 flex-1 space-y-4 overflow-y-auto px-2">
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
                <Card
                  key={ente.id}
                  className={isSelected ? 'border-2 border-green-500' : ''}
                >
                  <CardContent className="p-4">
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
                    <div className="mt-4 flex justify-end gap-2">
                      {isSelected ? (
                        <>
                          {/* Botón "Quitar" en rojo - aparece primero */}
                          <Button
                            type="button"
                            size="sm"
                            className="cursor-pointer"
                            variant="destructive"
                            onClick={() => handleRemove(ente)}
                          >
                            Quitar
                          </Button>
                          {/* Botón "Agregado" disabled - aparece después */}
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled
                          >
                            Agregado
                          </Button>
                        </>
                      ) : (
                        /* Botón "Agregar" cuando NO está seleccionado */
                        <Button
                          type="button"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => handleAdd(ente)}
                        >
                          Agregar
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
