'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Calendar, FileText } from 'lucide-react';
import { api } from '@/lib/api';

/**
 * Página de Actualización del Valor UCAU
 * Permite visualizar el valor actual y actualizarlo mediante el SDK
 */
export default function UcauPage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [valorActual, setValorActual] = useState<number | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>('');
  const [nuevoValor, setNuevoValor] = useState<string>('');

  // Cargar valor actual al montar
  useEffect(() => {
    fetchUcau();
  }, []);

  async function fetchUcau() {
    try {
      setLoading(true);
      // Usando los métodos reales del SDK: economia.getUCAUU
      const response = await api.economia.getUCAUU();
      // Según los tipos, getUCAUU retorna UCAUUData directamente
      if (response) {
        setValorActual(response.valor);
        setUltimaActualizacion(response.fecha);
      }
    } catch (error) {
      console.error('Error fetching UCAU:', error);
      toast.error('Error al cargar el valor actual de la UCAU');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!nuevoValor || isNaN(parseFloat(nuevoValor.replace(',', '.')))) {
      toast.error('Por favor ingrese un valor válido');
      return;
    }

    try {
      setUpdating(true);
      const valorNumerico = parseFloat(nuevoValor.replace(',', '.'));

      // Usando el método real del SDK: economia.createUCAUU
      await api.economia.createUCAUU(valorNumerico);

      toast.success('UCAU actualizada exitosamente');
      setNuevoValor('');
      await fetchUcau(); // Recargar datos
    } catch (error) {
      console.error('Error updating UCAU:', error);
      toast.error('Error al actualizar la UCAU');
    } finally {
      setUpdating(false);
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-VE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="space-y-8">
      {/* Título de la Página */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Actualización del Valor UCAU
        </h1>
        <p className="mt-2 text-gray-600">
          Gestiona el valor actual de la Unidad para el Cálculo de Aritmética
          Umbral (UCAU)
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Panel Izquierdo: Estado Actual */}
        <div className="space-y-3">
          <span className="ml-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
            ESTADO ACTUAL
          </span>
          <Card className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden border-none bg-gradient-to-br from-white to-slate-50 p-8 shadow-xl">
            <div className="absolute top-0 left-0 h-1 w-full bg-blue-600" />

            {loading ? (
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            ) : (
              <div className="flex flex-col items-center space-y-6 text-center">
                <div className="group relative">
                  <div className="absolute -inset-1 rounded-full bg-blue-600/20 blur transition duration-1000 group-hover:duration-200" />
                  <div className="relative flex h-64 w-64 flex-col items-center justify-center rounded-full border-4 border-blue-600 bg-white shadow-inner">
                    <span className="mb-2 text-xs font-bold tracking-tighter text-blue-600 uppercase">
                      VALOR ACTUAL DE LA UCAU
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-900">
                        Bs.
                      </span>
                      <span className="text-5xl font-black text-slate-900">
                        {valorActual !== null
                          ? formatCurrency(valorActual)
                          : '0,00'}
                      </span>
                    </div>
                    <p className="mt-4 max-w-[180px] px-6 text-[10px] leading-tight font-medium text-slate-500">
                      (Actualizado según Gaceta Oficial 42.703 del 30/08/2023)
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Última Actualización:{' '}
                    {loading ? (
                      <span className="inline-block h-4 animate-pulse rounded bg-slate-200 px-8" />
                    ) : (
                      formatDate(ultimaActualizacion)
                    )}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Panel Derecho: Nueva Actualización */}
        <div className="space-y-3">
          <span className="ml-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
            NUEVA ACTUALIZACIÓN
          </span>
          <Card className="relative flex min-h-[400px] flex-col overflow-hidden border-none bg-white p-8 shadow-xl">
            <div className="absolute top-0 left-0 h-1 w-full bg-slate-200" />

            <div className="flex flex-1 flex-col justify-center space-y-8">
              <div className="space-y-4">
                <Label
                  htmlFor="nuevo-valor"
                  className="text-sm font-bold tracking-tight text-slate-700 uppercase"
                >
                  INGRESE NUEVO VALOR (BS)
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="font-bold text-slate-400">Bs.</span>
                  </div>
                  <Input
                    id="nuevo-valor"
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={nuevoValor}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Validación estricta: solo números y un separador decimal (punto o coma)
                      if (val === '' || /^[0-9]*([.,][0-9]*)?$/.test(val)) {
                        setNuevoValor(val);
                      }
                    }}
                    className="h-16 rounded-xl border-2 border-slate-100 pl-12 text-2xl font-bold shadow-sm transition-all focus:border-blue-600 focus:ring-blue-600"
                  />
                </div>
                <p className="px-1 text-xs text-slate-500 italic">
                  * Use punto o coma para separar los decimales.
                </p>
              </div>

              <Button
                onClick={handleUpdate}
                disabled={updating || loading}
                className="h-16 w-full rounded-xl bg-[#2A5C9A] text-lg font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#1E4370] active:scale-[0.98]"
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ACTUALIZANDO...
                  </>
                ) : (
                  'ACTUALIZAR UCAU'
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
