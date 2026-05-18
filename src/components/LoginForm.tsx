'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Lock, Mail } from 'lucide-react';

/**
 * Componente de Formulario de Login
 * Componente reutilizable para el inicio de sesión
 *
 * Flujo:
 * 1. Usuario ingresa email y password
 * 2. Valida campos y formato de email
 * 3. Llama a useAuthStore.login() que hace POST al backend
 * 4. Si éxito: Guarda cookies y redirige a /dashboard
 * 5. Si error: Muestra toast con mensaje de error
 */
export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación básica de campos
    if (!email || !password) {
      toast.error('Campos requeridos', {
        description: 'Por favor complete todos los campos',
      });
      return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email inválido', {
        description: 'Por favor ingrese un email válido',
      });
      return;
    }

    try {
      // Intentar login
      await login(email, password);

      // Si llegamos aquí, el login fue exitoso
      toast.success('¡Bienvenido!', {
        description: 'Inicio de sesión exitoso',
      });

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (error: unknown) {
      // Manejar errores de autenticación
      let errorMessage =
        'Credenciales inválidas. Por favor intente nuevamente.';

      if (error && typeof error === 'object') {
        if (
          'response' in error &&
          error.response &&
          typeof error.response === 'object'
        ) {
          if (
            'data' in error.response &&
            error.response.data &&
            typeof error.response.data === 'object'
          ) {
            if (
              'message' in error.response.data &&
              typeof error.response.data.message === 'string'
            ) {
              errorMessage = error.response.data.message;
            }
          }
        } else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }

      toast.error('Error de autenticación', {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-purple-600 to-blue-600">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
              Bienvenido
            </CardTitle>
            <CardDescription className="text-base">
              Sistema de Gestión de Contrataciones Públicas
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@universitas.gob.ve"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              {/* Campo Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              {/* Botón Submit */}
              <Button
                type="submit"
                className="h-11 w-full bg-linear-to-r from-purple-600 to-blue-600 font-medium text-white shadow-lg shadow-purple-500/50 transition-all hover:from-purple-700 hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            {/* Mensaje informativo */}
            <p className="mt-6 text-center text-xs text-gray-500">
              Solo usuarios con rol{' '}
              <span className="font-semibold text-purple-600">UNIVERSITAS</span>{' '}
              pueden acceder
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-white/70">
          © 2026 Sistema de Contrataciones Públicas
        </p>
      </div>
    </div>
  );
}
