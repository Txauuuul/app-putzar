'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { verifyAdminPin, setAdminSession, getAdminSession } from '@/lib/auth';
import { AdminDashboard } from '@/components/AdminDashboard';

export default function AdminPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { isAdmin } = await getAdminSession();
      if (isAdmin) {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pin.trim()) {
      setError('Por favor ingresa el PIN');
      return;
    }

    if (setAdminSession(pin)) {
      setIsAuthenticated(true);
      setPin('');
    } else {
      setError('PIN incorrecto');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 bg-white/5 border border-white/10 rounded-lg p-8 backdrop-blur-sm"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold font-playfair bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              🔐 Panel Admin
            </h1>
            <p className="text-white/60">Ingresa la contraseña para continuar</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-white mb-2">
              Contraseña
            </label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Ingresa la contraseña"
              className="w-full"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-3 rounded-lg"
          >
            Acceder
          </Button>

          <a
            href="/"
            className="block text-center text-white/60 hover:text-white transition-colors text-sm"
          >
            ← Volver al inicio
          </a>
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-playfair bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              🔐 Panel de Control
            </h1>
            <p className="text-white/60 mt-1">Gestión de la Gala</p>
          </div>
          <Button
            onClick={() => {
              setIsAuthenticated(false);
              setPin('');
              router.push('/');
            }}
            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard adminPin={pin} />
      </div>
    </main>
  );
}
