'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PhotoComments } from '@/components/PhotoComments';

interface GalleryProps {
  isAdmin?: boolean;
  adminPin?: string;
}

export function Gallery({ isAdmin = false, adminPin }: GalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const headers: HeadersInit = {};

      if (isAdmin && adminPin) {
        headers['x-admin-pin'] = adminPin;
      }

      const endpoint = isAdmin ? '/api/admin/fotos' : '/api/fotos';
      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }

      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: 'Error',
        description: 'No pudimos cargar las fotos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta foto?')) return;

    try {
      const headers: HeadersInit = {};
      if (isAdmin && adminPin) {
        headers['x-admin-pin'] = adminPin;
      }

      const response = await fetch(`/api/fotos/${photoId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }

      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      toast({
        title: 'Foto eliminada',
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

  if (loading) {
    return <div className="text-center py-12 text-white/60">Cargando fotos...</div>;
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16 space-y-3 text-white/60">
        <p className="text-lg">📸 Aún no hay fotos</p>
        <p className="text-sm">Sube fotos para que aparezcan aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
            onClick={() => {
              setSelectedPhoto(photo.photo_url);
              setSelectedPhotoId(photo.id);
            }}
          >
            <img
              src={photo.photo_url}
              alt="Photo"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePhoto(photo.id);
                }}
                className="bg-red-500/80 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg"
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

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4 cursor-pointer overflow-y-auto"
          onClick={() => {
            setSelectedPhoto(null);
            setSelectedPhotoId(null);
          }}
        >
          <div
            className="bg-black/50 rounded-xl border border-white/10 backdrop-blur-sm p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto cursor-default my-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto}
              alt="Full size"
              className="w-full rounded-lg"
            />
            {selectedPhotoId && <PhotoComments photoId={selectedPhotoId} />}
            <button
              onClick={() => {
                setSelectedPhoto(null);
                setSelectedPhotoId(null);
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white text-base font-bold py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
