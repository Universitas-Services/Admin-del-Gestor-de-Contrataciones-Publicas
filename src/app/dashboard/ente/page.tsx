import type { Metadata } from 'next';
import CreateEnteForm from '@/components/forms/CreateEnteForm';

export const metadata: Metadata = {
  title: 'Crear Ente | UNIVERSITAS',
  description: 'Crear un nuevo Ente Público con su usuario administrador',
};

export default function EntePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Crear Ente</h1>
        <p className="mt-2 text-gray-600">
          Registra un nuevo Ente Público con su usuario administrador asociado
        </p>
      </div>

      <CreateEnteForm />
    </div>
  );
}
