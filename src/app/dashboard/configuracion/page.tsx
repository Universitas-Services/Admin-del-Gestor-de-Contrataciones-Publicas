import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ImageIcon, Scale, TrendingUp } from 'lucide-react';
import Link from 'next/link';

/**
 * Página de Configuración
 */
export default function ConfiguracionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-2 text-gray-600">
          Ajustes y configuración del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/configuracion/ucau">
          <Card className="group h-full cursor-pointer border-l-4 border-l-blue-600 bg-blue-50/50 transition-all hover:bg-blue-100/50">
            <CardHeader className="px-4 py-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm font-bold">
                  Actualización del valor UCAU
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/configuracion/normativas">
          <Card className="group h-full cursor-pointer border-l-4 border-l-indigo-600 bg-indigo-50/50 transition-all hover:bg-indigo-100/50">
            <CardHeader className="px-4 py-3">
              <div className="flex items-center space-x-2">
                <Scale className="h-4 w-4 text-indigo-600" />
                <CardTitle className="text-sm font-bold">
                  Normativas Legales
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/configuracion/clausulas">
          <Card className="group h-full cursor-pointer border-l-4 border-l-amber-600 bg-amber-50/50 transition-all hover:bg-amber-100/50">
            <CardHeader className="px-4 py-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-amber-600" />
                <CardTitle className="text-sm font-bold">
                  Cláusulas Genéricas
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/configuracion/documentos-ejemplo">
          <Card className="group h-full cursor-pointer border-l-4 border-l-teal-600 bg-teal-50/50 transition-all hover:bg-teal-100/50">
            <CardHeader className="px-4 py-3">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4 text-teal-600" />
                <CardTitle className="text-sm font-bold">
                  Documentos de Ejemplo
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
