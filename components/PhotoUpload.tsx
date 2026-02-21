'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ensureAnonymousAuth } from '@/lib/supabase';

interface PhotoUploadProps {
  onSuccess?: () => void;
}

export function PhotoUpload({ onSuccess }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadFile = async (file: File): Promise<boolean> => {
    try {
      console.log('🔐 Iniciando autenticación anónima...');
      
      // Ensure anonymous auth
      const userId = await ensureAnonymousAuth();
      console.log('✅ Usuario autenticado:', userId);
      
      if (!userId) {
        throw new Error('No se pudo autenticar al usuario');
      }

      // Prepare file
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log('📁 Subiendo archivo:', filePath);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Error de Supabase Storage:', uploadError);
        throw new Error(`Error de almacenamiento: ${uploadError.message}`);
      }

      console.log('✅ Archivo subido a storage');

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      const photoUrl = urlData.publicUrl;
      console.log('🔗 URL pública:', photoUrl);

      // Save photo record to database
      console.log('💾 Guardando registro en base de datos...');
      const response = await fetch('/api/fotos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_url: photoUrl }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ Error al guardar en DB:', error);
        throw new Error(`Error en la base de datos: ${response.status}`);
      }

      console.log('✅ Registro guardado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error completo:', error);
      throw error;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    
    console.log('📸 Archivos seleccionados:', files?.length);
    
    if (!files || files.length === 0) {
      console.log('⚠️ No hay archivos seleccionados');
      return;
    }

    setUploading(true);
    let uploadedCount = 0;
    const totalFiles = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`\n📤 Procesando archivo ${i + 1}/${totalFiles}:`, file.name);

        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.warn('⚠️ Archivo no es imagen:', file.name);
          toast({
            title: 'Error',
            description: `"${file.name}" no es una imagen válida`,
            variant: 'destructive',
          });
          continue;
        }

        // Validate file size (máximo 100MB)
        if (file.size > 100 * 1024 * 1024) {
          console.warn('⚠️ Archivo muy grande:', file.name);
          toast({
            title: 'Error',
            description: `"${file.name}" es demasiado grande (máximo 100MB)`,
            variant: 'destructive',
          });
          continue;
        }

        // Upload
        await uploadFile(file);
        uploadedCount++;
        const progress = Math.round(((uploadedCount) / totalFiles) * 100);
        setUploadProgress(progress);
        console.log(`✅ Progreso: ${progress}%`);
      }

      if (uploadedCount > 0) {
        console.log('🎉 Todas las fotos subidas exitosamente');
        toast({
          title: '¡Éxito! 🎉',
          description: `${uploadedCount} foto${uploadedCount > 1 ? 's' : ''} subida${uploadedCount > 1 ? 's' : ''} exitosamente`,
          variant: 'default',
        });
        setUploadProgress(0);
        onSuccess?.();
      } else {
        console.log('⚠️ No se subió ninguna foto');
        toast({
          title: 'Aviso',
          description: 'No se subió ninguna foto válida',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Error general:', error);
      toast({
        title: 'Error fatal',
        description: error instanceof Error ? error.message : 'No pudimos subir las fotos. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Limpiar inputs
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Botones principales */}
      <div className="flex gap-2 sm:gap-3 flex-wrap">
        <Button
          onClick={() => {
            console.log('👆 Botón "Seleccionar Fotos" clickeado');
            fileInputRef.current?.click();
          }}
          disabled={uploading}
          className="flex-1 min-w-[120px] sm:min-w-[150px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? '⏳ Subiendo...' : '🖼️ Fotos'}
        </Button>
        <Button
          onClick={() => {
            console.log('👆 Botón "Tomar Foto" clickeado');
            cameraInputRef.current?.click();
          }}
          disabled={uploading}
          className="flex-1 min-w-[120px] sm:min-w-[150px] bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? '⏳ Subiendo...' : '📷 Cámara'}
        </Button>
      </div>

      {/* Input de archivo - Hidden */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
        aria-label="Seleccionar fotos"
      />

      {/* Input de cámara - Hidden */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
        aria-label="Tomar foto con cámara"
      />

      {/* Barra de progreso */}
      {uploading && (
        <div className="space-y-3 bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-full transition-all duration-300 animate-pulse"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-sm text-white/70 font-medium">
              ⏳ Subiendo fotos...
            </p>
            <p className="text-xs sm:text-sm font-bold text-purple-400">
              {uploadProgress}%
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de instrucción */}
      <div className="text-center text-white/50 text-xs sm:text-sm">
        <p>💡 Múltiples fotos a la vez</p>
        <p className="text-xs mt-1">Max 100MB • JPG, PNG</p>
      </div>
    </div>
  );
}
