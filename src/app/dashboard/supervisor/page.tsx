import type { Metadata } from 'next';
import CreateSupervisorForm from '@/components/forms/CreateSupervisorForm';

export const metadata: Metadata = {
  title: 'Crear Supervisor | UNIVERSITAS',
  description: 'Crear un nuevo Supervisor con su organización y asignar Entes',
};

export default function SupervisorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Crear Supervisor</h1>
        <p className="mt-2 text-gray-600">
          Registra un nuevo Supervisor con su organización y asígnale Entes para
          gestionar
        </p>
      </div>

      <CreateSupervisorForm />
    </div>
  );
}
