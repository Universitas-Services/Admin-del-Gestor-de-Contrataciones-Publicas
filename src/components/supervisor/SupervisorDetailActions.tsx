'use client';

import { Edit, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';

interface SupervisorDetailActionsProps {
  /** UUID del supervisor (targetUserId para el cambio de contraseña) */
  targetUserId: string;
  /** Nombre del supervisor (mostrado en el modal) */
  supervisorName: string;
}

/**
 * Componente cliente que renderiza los botones de acción en la página
 * de detalle de un Supervisor (Editar + Nueva Clave Temporal + Suspender).
 * Necesario porque la página de detalle del Supervisor es un Server Component.
 */
export default function SupervisorDetailActions({
  targetUserId,
  supervisorName,
}: SupervisorDetailActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" className="gap-2 border-slate-200">
        <Edit className="h-4 w-4" />
        Editar
      </Button>
      <ChangePasswordModal
        targetUserId={targetUserId}
        userName={supervisorName}
      />
      <Button
        variant="destructive"
        className="gap-2 border-none bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700"
      >
        <Ban className="h-4 w-4" />
        Suspender
      </Button>
    </div>
  );
}
