'use client';

import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';

interface EnteDetailActionsProps {
  /** UUID del usuario admin del ente (targetUserId para el cambio de contraseña) */
  targetUserId: string;
  /** Nombre del ente (mostrado en el modal) */
  enteName: string;
}

/**
 * Componente cliente que renderiza los botones de acción en la página
 * de detalle de un Ente (Editar + Nueva Clave Temporal).
 * Necesario porque la página de detalle del Ente es un Server Component.
 */
export default function EnteDetailActions({
  targetUserId,
  enteName,
}: EnteDetailActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        className="bg-background border-border gap-2 shadow-sm"
      >
        <Edit className="h-4 w-4" />
        Editar
      </Button>
      <ChangePasswordModal targetUserId={targetUserId} userName={enteName} />
    </div>
  );
}
