'use client';

import { Accusation } from '@/lib/schema';
import { Button } from '@/components/ui/button';

interface AdminTableProps {
  accusations: Accusation[];
  onDelete: (id: string) => void;
  adminPin: string;
}

export function AdminTable({ accusations, onDelete }: AdminTableProps) {
  const accusationsList = Array.isArray(accusations) ? accusations : [];
  
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
              A Quién
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
              Motivo
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
              Fecha
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/80">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {accusationsList.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-white/60">
                No hay acusaciones aún
              </td>
            </tr>
          ) : (
            accusationsList.map((accusation) => (
              <tr
                key={accusation.id}
                className="hover:bg-white/5 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-sm text-white font-medium">
                  {accusation.accused_name}
                </td>
                <td className="px-6 py-4 text-sm text-white/80">
                  <p className="max-w-xs truncate" title={accusation.reason}>
                    {accusation.reason}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-white/60">
                  {new Date(accusation.created_at).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    onClick={() => onDelete(accusation.id)}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs"
                  >
                    🗑️ Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
