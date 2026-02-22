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
    ensureAnonymousAuth().then(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-base font-medium">Inicializando...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-black">
      {/* HEADER */}
      <div className="border-b border-white/10 pt-24 pb-24 sm:pt-40 sm:pb-40 px-3 sm:px-6 lg:px-8 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl text-center">
          {/* Título principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-playfair bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-300 bg-clip-text text-transparent mb-20 sm:mb-24">
            Putero & Zarigüeya 
          </h1>

          {/* Párrafo 1 */}
          <p className="text-white/60 text-sm sm:text-base lg:text-base leading-relaxed px-2 mb-6 sm:mb-8">
            En esta plataforma podréis hacer acusaciones a lo largo del año de manera anónima y aportar fotografías + acusaciones para una mayor veracidad.
          </p>

          {/* Párrafo 2 */}
          <p className="text-white/60 text-sm sm:text-base lg:text-base leading-relaxed px-2 mb-12 sm:mb-16">
            Todo para seguir haciendo que esta sea la mejor noche del puto año. 🎉
          </p>

          {/* Badge */}
          <div className="mb-0">
            <div className="inline-block bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border border-amber-400/50 rounded-lg px-6 py-3 backdrop-blur-md">
              <p className="text-amber-200 text-xs sm:text-sm font-semibold">
                🔐 Anonimato total • ⚡ Envíos directos • 📸 Sin límites
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mx-auto w-full max-w-4xl px-3 sm:px-6 lg:px-8 py-20 sm:py-32">
        {/* TABS */}
        <div className="mb-24 sm:mb-32">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
            <button
              onClick={() => setActiveTab('acusacion')}
              className={`flex-1 px-6 sm:px-8 py-5 sm:py-6 font-bold border-2 transition-all duration-300 rounded-lg text-base sm:text-lg ${
                activeTab === 'acusacion'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/30'
                  : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              📋 Enviar Acusación
            </button>
            <button
              onClick={() => setActiveTab('fotos')}
              className={`flex-1 px-6 sm:px-8 py-5 sm:py-6 font-bold border-2 transition-all duration-300 rounded-lg text-base sm:text-lg ${
                activeTab === 'fotos'
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/30'
                  : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              📸 Subir Fotos
            </button>
            <button
              onClick={() => setActiveTab('galeria')}
              className={`flex-1 px-6 sm:px-8 py-5 sm:py-6 font-bold border-2 transition-all duration-300 rounded-lg text-base sm:text-lg ${
                activeTab === 'galeria'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/30'
                  : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              🖼️ Mi Galería
            </button>
          </div>
        </div>

        {/* TAB: ACUSACIÓN */}
        {activeTab === 'acusacion' && (
          <div className="animate-slideIn">
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 sm:p-12 backdrop-blur-sm">
              {/* Título de sección */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12">
                Envía Una Acusación
              </h2>

              {/* Descripción 1 */}
              <p className="text-white/60 text-sm sm:text-base leading-relaxed text-center mb-4 sm:mb-6">
                Escribe libremente tu acusación. Formato sugerido: "Acuso a [nombre] por [motivo]"
              </p>

              {/* Descripción 2 */}
              <p className="text-white/50 text-xs sm:text-sm text-center mb-12 sm:mb-16">
                💡 Tu identidad está completamente protegida
              </p>

              {/* Formulario */}
              <div className="mt-8 sm:mt-12">
                <AccusationForm
                  onSuccess={() => {
                    setRefreshGallery((prev) => prev + 1);
                    setTimeout(() => setActiveTab('galeria'), 1500);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: FOTOS */}
        {activeTab === 'fotos' && (
          <div className="animate-slideIn">
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 sm:p-12 backdrop-blur-sm">
              {/* Título de sección */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12">
                Sube Tus Fotos 📸
              </h2>

              {/* Descripción 1 */}
              <p className="text-white/60 text-sm sm:text-base leading-relaxed text-center mb-4 sm:mb-6">
                Comparte fotografías sin límites. Todas se almacenan de forma segura y pueden ser comentadas.
              </p>

              {/* Descripción 2 */}
              <p className="text-white/50 text-xs sm:text-sm text-center mb-12 sm:mb-16">
                ✨ Formato: JPG, PNG • Máximo 100MB por foto
              </p>

              {/* Componente de carga */}
              <div className="mt-8 sm:mt-12">
                <PhotoUpload
                  onSuccess={() => {
                    setRefreshGallery((prev) => prev + 1);
                    setTimeout(() => setActiveTab('galeria'), 1500);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: GALERÍA */}
        {activeTab === 'galeria' && (
          <div className="animate-slideIn">
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 sm:p-12 backdrop-blur-sm">
              {/* Título de sección */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-6 sm:mb-8">
                Tu Galería Personal
              </h2>

              {/* Descripción */}
              <p className="text-white/60 text-sm sm:text-base text-center mb-12 sm:mb-16">
                Todas tus fotos subidas. Toca para agrandar y comentar.
              </p>

              {/* Galería */}
              <div className="mt-8 sm:mt-12">
                <Gallery key={refreshGallery} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Admin Link */}
      <a
        href="/admin"
        className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 w-14 sm:w-12 h-14 sm:h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 flex items-center justify-center shadow-lg hover:shadow-amber-500/50 transition-all duration-300 text-white/80 hover:text-white text-lg sm:text-base hover:scale-110"
        title="Ir a panel de administrador"
      >
        ⚙️
      </a>

      <Toaster />
    </main>
  );
}
