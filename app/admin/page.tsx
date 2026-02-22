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
      // ✅ NO limpiar el PIN - lo necesita AdminDashboard para las llamadas API
    } else {
      setError('PIN incorrecto');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-white/60 text-lg font-medium">Verificando acceso...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-black">
        <form
          onSubmit={handleSubmit}
          style={{ padding: '50px 40px' }}
          className="w-full max-w-md flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        >
          <div className="text-center mb-8 w-full">
            <h1 style={{ marginBottom: '15px', paddingBottom: '10px' }} className="text-4xl sm:text-5xl font-bold font-playfair bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              🔐 Panel Admin
            </h1>
            <p className="text-white/60 text-base">Ingresa la contraseña para continuar</p>
          </div>

          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200 text-sm text-center mb-6 animate-fadeIn">
              {error}
            </div>
          )}

          <div className="w-full mb-8">
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/50 border-white/20 text-white text-center text-2xl py-6 rounded-xl focus:border-amber-500 focus:ring-amber-500 transition-all"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            style={{ padding: '24px 32px' }}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-lg rounded-xl transform hover:-translate-y-1 active:scale-95 transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)] mb-8"
          >
            Acceder al Panel
          </Button>

          <a
            href="/"
            className="block text-center text-white/50 hover:text-white transition-colors text-sm font-medium"
          >
            ← Volver al inicio
          </a>
        </form>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-black flex flex-col items-center pb-20">
      {/* Header Centrado */}
      <div style={{ paddingTop: '40px', paddingBottom: '40px' }} className="w-full border-b border-white/10 px-4 sm:px-6 lg:px-8 backdrop-blur-sm flex flex-col items-center">
        <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold font-playfair bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              🔐 Panel de Control
            </h1>
            <p className="text-white/60 text-sm sm:text-base">Gestión integral de la Gala</p>
          </div>
          <Button
            onClick={() => {
              setIsAuthenticated(false);
              setPin('');
              router.push('/');
            }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-sm px-6 py-5 rounded-xl transition-all"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>

      {/* Dashboard Content Centrado */}
      <div style={{ paddingTop: '60px' }} className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full">
          <AdminDashboard adminPin={pin} />
        </div>
      </div>
    </main>
  );
}