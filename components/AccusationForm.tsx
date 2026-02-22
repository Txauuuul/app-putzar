'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { useToast } from '@/hooks/use-toast';
import { ensureAnonymousAuth } from '@/lib/supabase';

interface AccusationFormProps {
  onSuccess?: () => void;
}

export function AccusationForm({ onSuccess }: AccusationFormProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor, escribe una acusación',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const userId = await ensureAnonymousAuth();
      if (!userId) throw new Error('Not authenticated');

      // Parse the text to extract accused name and reason
      // Format: "Acuso a [nombre] por [motivo]" or just write freely
      const parts = text.split(' por ');
      let accusedName = '';
      let reason = '';

      if (parts.length >= 2) {
        accusedName = parts[0].replace(/^Acuso a\s+/i, '').trim();
        reason = parts.slice(1).join(' por ').trim();
      } else {
        // If no clear format, use first part as name and rest as reason
        const lines = text.split('\n').filter((l) => l.trim());
        accusedName = lines[0]?.substring(0, 50) || 'Anónimo';
        reason = text;
      }

      if (!accusedName || !reason) {
        toast({
          title: 'Error',
          description: 'Por favor, especifica a quién acusas y el motivo',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/acusaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accused_name: accusedName,
          reason: reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit accusation');
      }

      // ✅ Show confirmation modal
      setShowConfirmation(true);

      setText('');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting accusation:', error);
      toast({
        title: 'Error',
        description: `No pudimos enviar tu acusación: ${String(error)}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        <div className="relative">
          <Textarea
            placeholder='Ejemplo: "Acuso a Pueyo de comerse un arroz con pollo en la modrollo"'
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[160px] sm:min-h-[180px] w-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm sm:text-base rounded-lg backdrop-blur-sm focus:bg-white/10 focus:border-white/30 transition-all resize-none p-4 sm:p-5 focus:ring-2 focus:ring-amber-500/30"
            disabled={loading}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading || !text.trim()}
            className="flex-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-black font-bold py-4 sm:py-5 text-base sm:text-lg rounded-xl shadow-lg shadow-amber-500/40 hover:shadow-amber-500/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            {loading ? '⏳ Enviando...' : '✉️ Enviar acusación'}
          </Button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        title="✅ ¡Acusación Enviada!"
        description="Tu acusación ha sido registrada exitosamente en la plataforma."
        confirmText="Aceptar"
        onClose={() => setShowConfirmation(false)}
        autoClose={true}
        autoCloseDuration={3000}
      />
    </>
  );
}
