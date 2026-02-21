'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ensureAnonymousAuth } from '@/lib/supabase';

interface AccusationFormProps {
  onSuccess?: () => void;
}

export function AccusationForm({ onSuccess }: AccusationFormProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
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
        throw new Error('Failed to submit accusation');
      }

      toast({
        title: 'Acusación enviada',
        description: 'Tu acusación ha sido registrada exitosamente',
        variant: 'default',
      });

      setText('');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting accusation:', error);
      toast({
        title: 'Error',
        description: 'No pudimos enviar tu acusación. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="relative">
        <Textarea
          placeholder='Ejemplo: "Acuso a Pueyo de comerse un arroz con pollo en la modrollo"'
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[140px] sm:min-h-[160px] w-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm sm:text-base rounded-lg backdrop-blur-sm focus:bg-white/10 focus:border-white/20 transition-all resize-none p-3 sm:p-4"
          disabled={loading}
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={loading || !text.trim()}
          className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-amber-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Enviando...' : '✉️ Enviar acusación'}
        </Button>
      </div>
    </form>
  );
}
