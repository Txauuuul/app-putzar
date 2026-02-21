'use client';

import { useState } from 'react';
import { Photo } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdminGalleryProps {
  photos: Photo[];
  adminPin: string;
}

export function AdminGallery({ photos, adminPin }: AdminGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photosList, setPhotosList] = useState<Photo[]>(photos);
  const { toast } = useToast();

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta foto?')) return;

    try {
      const response = await fetch(`/api/fotos/${photoId}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': adminPin },
      });

      if (!response.ok) throw new Error('Failed to delete photo');

      setPhotosList((prev) => prev.filter((p) => p.id !== photoId));
      toast({
        title: '✨ Foto eliminada',
        description: 'La foto ha sido eliminada exitosamente',
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: 'Error',
        description: 'No pudimos eliminar la foto',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      {photosList.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <p className="mb-2">📸 Aún no hay fotos</p>
          <p className="text-sm">Las fotos subidas aparecerán aquí</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {photosList.map((photo) => (
            <div
              key={photo.id}
              className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300"
              onClick={() => setSelectedPhoto(photo.photo_url)}
            >
              <img
                src={photo.photo_url}
                alt="Photo"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePhoto(photo.id);
                  }}
                  className="bg-red-500/80 hover:bg-red-600 text-white text-xs"
                >
                  🗑️ Eliminar
                </Button>
              </div>

              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs text-white/70">
                {new Date(photo.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Full size"
            className="max-w-full max-h-[90vh] rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
