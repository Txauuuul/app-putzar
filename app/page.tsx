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
    <main className="w-full min-h-screen bg-black flex flex-col items-center">
      {/* HEADER */}
      <div style={{ paddingTop: '40px', paddingBottom: '40px' }} className="w-full border-b border-white/10 px-3 sm:px-6 lg:px-8 backdrop-blur-sm flex flex-col items-center">
        <div className="mx-auto max-w-4xl text-center flex flex-col items-center justify-center">
          
          <h1 style={{ marginBottom: '20px', paddingBottom: '15px', lineHeight: '1.2' }} className="text-4xl sm:text-5xl lg:text-7xl font-bold font-playfair bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
            Putero & Zarigüeya 
          </h1>

          <p style={{ marginBottom: '15px' }} className="text-white/60 text-sm sm:text-base lg:text-lg leading-relaxed px-2 text-center max-w-2xl">
            En esta plataforma podréis hacer acusaciones a lo largo del año de manera anónima y aportar fotografías + acusaciones para una mayor veracidad.
          </p>

          <p style={{ marginBottom: '25px' }} className="text-white/60 text-sm sm:text-base lg:text-lg leading-relaxed px-2 text-center max-w-2xl">
            Todo para seguir haciendo que esta sea la mejor noche del puto año. 🎉
          </p>

          <div style={{ marginTop: '10px' }} className="flex justify-center w-full">
            <div className="inline-block bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border border-amber-400/50 rounded-lg px-6 py-3 backdrop-blur-md">
              <p className="text-amber-200 text-sm sm:text-base font-semibold text-center">
                🔐 Anonimato total • ⚡ Envíos directos • 📸 Sin límites
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ paddingTop: '40px', paddingBottom: '60px' }} className="mx-auto w-full max-w-5xl px-3 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* TABS - BOTONES CON RELLENO INTERIOR FORZADO */}
        <div style={{ marginBottom: '40px' }} className="w-full max-w-4xl">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button
              onClick={() => setActiveTab('acusacion')}
              style={{ padding: '24px 32px' }}
              className={`flex-1 font-bold border-2 transition-all duration-300 rounded-2xl text-base sm:text-lg text-center transform hover:-translate-y-1 active:scale-95 ${
                activeTab === 'acusacion'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.3)]'
                  : 'border-white/10 text-white/60 hover:border-amber-400/50 hover:text-amber-200 hover:bg-amber-500/10 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]'
              }`}
            >
              📋 Enviar Acusación
            </button>
            <button
              onClick={() => setActiveTab('fotos')}
              style={{ padding: '24px 32px' }}
              className={`flex-1 font-bold border-2 transition-all duration-300 rounded-2xl text-base sm:text-lg text-center transform hover:-translate-y-1 active:scale-95 ${
                activeTab === 'fotos'
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_25px_rgba(192,132,252,0.3)]'
                  : 'border-white/10 text-white/60 hover:border-purple-500/50 hover:text-purple-300 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(192,132,252,0.2)]'
              }`}
            >
              📸 Subir Fotos
            </button>
            <button
              onClick={() => setActiveTab('galeria')}
              style={{ padding: '24px 32px' }}
              className={`flex-1 font-bold border-2 transition-all duration-300 rounded-2xl text-base sm:text-lg text-center transform hover:-translate-y-1 active:scale-95 ${
                activeTab === 'galeria'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.3)]'
                  : 'border-white/10 text-white/60 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
              }`}
            >
              🖼️ Mi Galería
            </button>
          </div>
        </div>

        {/* TAB CONTENEDOR GENERAL */}
        <div className="w-full max-w-3xl flex flex-col items-center">
          
          {/* TAB: ACUSACIÓN */}
          {activeTab === 'acusacion' && (
            <div style={{ marginTop: '20px' }} className="animate-slideIn w-full">
              <div style={{ padding: '30px 20px' }} className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm flex flex-col items-center">
                <h2 style={{ marginBottom: '20px' }} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center w-full">
                  Envía Una Acusación
                </h2>

                <p style={{ marginBottom: '15px' }} className="text-white/60 text-base sm:text-lg leading-relaxed text-center max-w-xl">
                  Escribe libremente tu acusación.
                </p>

                <p style={{ marginBottom: '30px' }} className="text-white/50 text-sm sm:text-base text-center w-full">
                  Tu identidad está completamente protegida
                </p>

                <div style={{ marginTop: '10px' }} className="w-full flex justify-center">
                  <div className="w-full max-w-xl">
                    <AccusationForm
                      onSuccess={() => {
                        setRefreshGallery((prev) => prev + 1);
                        setTimeout(() => setActiveTab('galeria'), 1500);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FOTOS */}
          {activeTab === 'fotos' && (
            <div style={{ marginTop: '20px' }} className="animate-slideIn w-full">
              <div style={{ padding: '30px 20px' }} className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm flex flex-col items-center">
                <h2 style={{ marginBottom: '20px' }} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center w-full">
                  Sube Tus Fotos 📸
                </h2>

                <p style={{ marginBottom: '15px' }} className="text-white/60 text-base sm:text-lg leading-relaxed text-center max-w-xl">
                  Comparte fotografías sin límites. Todas se almacenan de forma segura y pueden ser comentadas.
                </p>

                <p style={{ marginBottom: '30px' }} className="text-white/50 text-sm sm:text-base text-center w-full">
                  Formato: JPG, PNG • Máximo 100MB por foto
                </p>

                <div style={{ marginTop: '10px' }} className="w-full flex justify-center">
                  <div className="w-full max-w-xl">
                    <PhotoUpload
                      onSuccess={() => {
                        setRefreshGallery((prev) => prev + 1);
                        setTimeout(() => setActiveTab('galeria'), 1500);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GALERÍA */}
          {activeTab === 'galeria' && (
            <div style={{ marginTop: '20px' }} className="animate-slideIn w-full">
              <div style={{ padding: '30px 20px' }} className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm flex flex-col items-center">
                <h2 style={{ marginBottom: '20px' }} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center w-full">
                  Tu Galería Personal
                </h2>

                <p style={{ marginBottom: '30px' }} className="text-white/60 text-base sm:text-lg text-center max-w-xl">
                  Todas tus fotos subidas. Toca para agrandar y comentar.
                </p>

                <div style={{ marginTop: '10px' }} className="w-full">
                  <Gallery key={refreshGallery} />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Floating Admin Link */}
      <a
        href="/admin"
        className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 w-14 sm:w-12 h-14 sm:h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 flex items-center justify-center shadow-lg hover:shadow-amber-500/50 transition-all duration-300 text-white/80 hover:text-white text-lg sm:text-base hover:scale-110 z-50"
        title="Ir a panel de administrador"
      >
        ⚙️
      </a>

      <Toaster />
    </main>
  );
}