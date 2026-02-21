'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl mb-4">✨</div>
        <h1 className="text-4xl font-bold font-playfair bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
          ¡Listo!
        </h1>
        <p className="text-white/80 text-lg">
          Tu acusación ha sido registrada exitosamente y aparecerá en la gala.
        </p>
        <p className="text-white/60">
          Solo tú y el administrador podrán ver que fue tu envío.
        </p>

        <div className="pt-4 space-y-3">
          <Link href="/">
            <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold">
              🏠 Volver al Inicio
            </Button>
          </Link>
          <Link href="/?tab=fotos">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold">
              📸 Subir Fotos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
