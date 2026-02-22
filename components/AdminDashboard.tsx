'use client';

import { useState, useEffect } from 'react';
import { Accusation, Photo } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AdminTable } from '@/components/AdminTable';
import { AdminGallery } from '@/components/AdminGallery';

interface AdminDashboardProps {
  adminPin: string;
}

export function AdminDashboard({ adminPin }: AdminDashboardProps) {
  const [accusations, setAccusations] = useState<Accusation[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'accusations' | 'photos'>('accusations');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔐 [AdminDashboard] adminPin prop value:', adminPin ? `${adminPin.substring(0, 5)}...` : 'UNDEFINED/EMPTY');
      const headers = { 'x-admin-pin': adminPin };

      // Fetch accusations
      console.log('📡 [AdminDashboard] Sending headers:', { 'x-admin-pin': adminPin ? `${adminPin.substring(0, 5)}...` : 'EMPTY' });
      const accusationsRes = await fetch('/api/admin/acusaciones', { headers });
      if (!accusationsRes.ok) {
        throw new Error(`Failed to fetch accusations: ${accusationsRes.statusText}`);
      }
      const accusationsData = await accusationsRes.json();
      console.log('✅ [AdminDashboard] Accusations fetched:', Array.isArray(accusationsData) ? `${accusationsData.length} records` : 'error');
      setAccusations(Array.isArray(accusationsData) ? accusationsData : []);

      // Fetch photos
      const photosRes = await fetch('/api/admin/fotos', { headers });
      if (!photosRes.ok) {
        throw new Error(`Failed to fetch photos: ${photosRes.statusText}`);
      }
      const photosData = await photosRes.json();
      console.log('✅ [AdminDashboard] Photos fetched:', Array.isArray(photosData) ? `${photosData.length} records` : 'error');
      setPhotos(Array.isArray(photosData) ? photosData : []);

      // Fetch settings (non-critical - don't fail if this one fails)
      try {
        const settingsRes = await fetch('/api/admin/settings', { headers });
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          console.log('✅ [AdminDashboard] Settings fetched');
          setNotificationsEnabled(settingsData?.notifications_enabled ?? true);
        } else {
          console.warn('⚠️ [AdminDashboard] Settings fetch failed, using defaults');
          setNotificationsEnabled(true);
        }
      } catch (settingsError) {
        console.warn('⚠️ [AdminDashboard] Settings error (non-critical):', settingsError);
        setNotificationsEnabled(true); // Use default
      }
    } catch (error) {
      console.error('❌ [AdminDashboard] Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'No pudimos cargar los datos',
        variant: 'destructive',
      });
      // Set default empty arrays
      setAccusations([]);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotifications = async () => {
    try {
      const headers = { 'x-admin-pin': adminPin, 'Content-Type': 'application/json' };
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ notifications_enabled: !notificationsEnabled }),
      });

      if (!response.ok) throw new Error('Failed to update settings');

      setNotificationsEnabled(!notificationsEnabled);
      toast({
        title: '✨ Ajustes actualizados',
        description: `Notificaciones ${!notificationsEnabled ? 'activadas' : 'desactivadas'}`,
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Error',
        description: 'No pudimos actualizar los ajustes',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccusation = async (accusationId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta acusación?')) return;

    try {
      const response = await fetch(`/api/acusaciones/${accusationId}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': adminPin },
      });

      if (!response.ok) throw new Error('Failed to delete accusation');

      setAccusations((prev) => prev.filter((a) => a.id !== accusationId));
      toast({
        title: '✨ Acusación eliminada',
        description: 'La acusación ha sido eliminada exitosamente',
      });
    } catch (error) {
      console.error('Error deleting accusation:', error);
      toast({
        title: 'Error',
        description: 'No pudimos eliminar la acusación',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white/60">Cargando panel de administrador...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-2">
          Panel de Administrador
        </h1>
        <p className="text-white/60">Gestiona acusaciones y fotos de la gala</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
          <div className="text-white/60 text-sm font-medium">Total Acusaciones</div>
          <div className="text-4xl font-bold text-amber-400 mt-2">{Array.isArray(accusations) ? accusations.length : 0}</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
          <div className="text-white/60 text-sm font-medium">Total Fotos</div>
          <div className="text-4xl font-bold text-purple-400 mt-2">{Array.isArray(photos) ? photos.length : 0}</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
          <div className="text-white/60 text-sm font-medium">Usuarios Únicos</div>
          <div className="text-4xl font-bold text-cyan-400 mt-2">
            {Array.isArray(accusations) ? new Set(accusations.map((a) => a.user_id)).size : 0}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
          <div className="text-white/60 text-sm font-medium">Notificaciones</div>
          <Button
            onClick={handleToggleNotifications}
            className={`mt-2 w-full ${
              notificationsEnabled
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            }`}
          >
            {notificationsEnabled ? '✓ Activadas' : '✗ Desactivadas'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('accusations')}
          className={`px-6 py-3 font-medium border-b-2 transition-all duration-300 ${
            activeTab === 'accusations'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          📋 Acusaciones ({accusations.length})
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-6 py-3 font-medium border-b-2 transition-all duration-300 ${
            activeTab === 'photos'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          🖼️ Fotos ({photos.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'accusations' && (
        <AdminTable
          accusations={accusations}
          onDelete={handleDeleteAccusation}
          adminPin={adminPin}
        />
      )}

      {activeTab === 'photos' && (
        <AdminGallery photos={photos} adminPin={adminPin} />
      )}
    </div>
  );
}
