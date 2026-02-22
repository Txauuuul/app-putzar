import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Moko P&Z - Acusaciones',
  description: 'Plataforma de acusaciones para Moko P&Z',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Moko P&Z - Acusaciones',
    description: 'Plataforma de acusaciones para Moko P&Z',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0e27',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#0a0e27" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="La Gala" />
      </head>
      {/* 1. Al body le añadimos flex y flex-col para que actúe como una columna elástica */}
      <body className={`${inter.className} ${playfair.variable} bg-gradient-to-br from-slate-950 via-black to-slate-900 min-h-screen text-white flex flex-col`}>
        
        {/* Background decoration (Le añadimos pointer-events-none para que no bloquee clics por error) */}
        <div className="fixed inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        {/* 2. EL ARREGLO CLAVE: Este contenedor ahora obliga a los elementos a expandirse con flex-1 y w-full */}
        <div className="relative z-10 flex flex-col flex-1 w-full">
          {children}
        </div>
        
      </body>
    </html>
  );
}