'use client';

import { useEffect, useState } from 'react';
import { AccusationForm } from '@/components/AccusationForm';
import { PhotoUpload } from '@/components/PhotoUpload';
import { Gallery } from '@/components/Gallery';
import { Toaster } from '@/components/ui/toaster';
import { ensureAnonymousAuth } from '@/lib/supabase';

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [refreshGallery, setRefreshGallery] = useState(0);
  const [activeTab, setActiveTab] = useState<'acusacion' | 'fotos' | 'galeria'>('acusacion');

  useEffect(() => {
    // Initialize anonymous auth
    ensureAnonymousAuth().then(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Inicializando...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-white/10 py-12 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-playfair bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-300 bg-clip-text text-transparent mb-4">
             Putero & Zarigüeya 
          </h1>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-4">
            En esta plataforma podréis hacer acusaciones a lo largo del año de manera anónima y aportar fotografías + acusaciones para una mayor veracidad.
          </p>
          <p className="text-white/50 text-sm sm:text-base">
            Todo para seguir haciendo que esta sea la mejor noche del puto año. 🎉
          </p>
          <p className="text-white/40 text-xs sm:text-sm mt-4 backdrop-blur-sm bg-white/5 rounded-lg py-3 px-4 inline-block">
            🔐 Anonimato total • ⚡ Envíos directos • 📸 Sin límites
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('acusacion')}
            className={`px-6 py-4 font-semibold border-b-2 transition-all duration-300 whitespace-nowrap text-center ${
              activeTab === 'acusacion'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            📋 Enviar Acusación
          </button>
          <button
            onClick={() => setActiveTab('fotos')}
            className={`px-6 py-4 font-semibold border-b-2 transition-all duration-300 whitespace-nowrap text-center ${
              activeTab === 'fotos'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            📸 Subir Fotos
          </button>
          <button
            onClick={() => setActiveTab('galeria')}
            className={`px-6 py-4 font-semibold border-b-2 transition-all duration-300 whitespace-nowrap text-center ${
              activeTab === 'galeria'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            🖼️ Mi Galería
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'acusacion' && (
          <div className="space-y-8 animate-slideIn">
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 sm:p-10 backdrop-blur-sm">
              <div className="mb-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Envía Una Acusación</h2>
                <p className="text-white/60 text-base leading-relaxed max-w-2xl mx-auto">
                  Escribe libremente tu acusación. Formato sugerido: "Acuso a [nombre] por [motivo]"
                </p>
                <div className="mt-4 inline-block text-xs text-white/40 bg-white/5 rounded-full px-4 py-2">
                  💡 Tu identidad está completamente protegida
                </div>
              </div>
              <AccusationForm
                onSuccess={() => {
                  setRefreshGallery((prev) => prev + 1);
                  setTimeout(() => setActiveTab('galeria'), 1500);
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'fotos' && (
          <div className="space-y-8 animate-slideIn">
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 sm:p-10 backdrop-blur-sm">
              <div className="mb-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Sube Tus Fotos 📸</h2>
                <p className="text-white/60 text-base leading-relaxed max-w-2xl mx-auto">
                  Comparte fotografías sin límites. Todas las fotos se almacenan de forma segura y pueden ser comentadas por otros usuarios.
                </p>
                <div className="mt-4 inline-block text-xs text-white/40 bg-white/5 rounded-full px-4 py-2">
                  ✨ Formato sugerido: JPG, PNG • Máximo 100MB por foto
                </div>
              </div>
              <PhotoUpload
                onSuccess={() => {
                  setRefreshGallery((prev) => prev + 1);
                  setTimeout(() => setActiveTab('galeria'), 1500);
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'galeria' && (
          <div className="space-y-8 animate-slideIn">
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 sm:p-10 backdrop-blur-sm">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 text-center">Tu Galería Personal</h2>
              <p className="text-white/50 text-center text-sm mb-8">
                Aquí se muestran todas las fotos que has subido. Puedes verlas en grande y leer los comentarios.
              </p>
              <Gallery key={refreshGallery} />
            </div>
          </div>
        )}
      </div>

      {/* Floating Admin Link */}
      <a
        href="/admin"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 flex items-center justify-center shadow-lg hover:shadow-amber-500/50 transition-all duration-300 text-white/80 hover:text-white"
        title="Ir a panel de administrador"
      >
        ⚙️
      </a>

      <Toaster />
    </main>
  );
}
