'use client';

import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 space-y-2 sm:max-w-[420px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slideIn rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${
            toast.variant === 'destructive'
              ? 'border-red-500/20 bg-red-500/10 text-red-200'
              : toast.variant === 'success'
              ? 'border-green-500/20 bg-green-500/10 text-green-200'
              : 'border-white/10 bg-white/5 text-white'
          }`}
        >
          {toast.title && <div className="font-medium">{toast.title}</div>}
          {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
        </div>
      ))}
    </div>
  );
}
