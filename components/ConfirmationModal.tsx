'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
}

export function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmText = 'Aceptar',
  onClose,
  autoClose = true,
  autoCloseDuration = 3000,
}: ConfirmationModalProps) {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);

    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDuration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          setVisible(false);
          onClose();
        }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-slate-950 via-slate-900 to-black border border-white/10 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="text-3xl">✅</div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-3 font-playfair">
          {title}
        </h2>

        {/* Description */}
        <p className="text-center text-white/70 mb-8 text-sm leading-relaxed">
          {description}
        </p>

        {/* Progress bar */}
        {autoClose && (
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-shrink"
              style={{
                animation: `shrink ${autoCloseDuration}ms linear forwards`,
              }}
            />
          </div>
        )}

        {/* Button */}
        <Button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg transition-all hover:scale-105 active:scale-95"
        >
          {confirmText}
        </Button>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
