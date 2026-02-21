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
    <div className="space-y-8 w-full">
      {/* Botones principales */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-4">
        <Button
          onClick={() => {
            console.log('👆 Botón "Seleccionar Fotos" clickeado');
            fileInputRef.current?.click();
          }}
          disabled={uploading}
          className="flex-1 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 hover:from-purple-600 hover:via-purple-500 hover:to-purple-600 text-white font-bold py-4 sm:py-5 text-base sm:text-lg rounded-xl shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        >
          {uploading ? '⏳ Subiendo...' : '🖼️ Seleccionar Fotos'}
        </Button>
        <Button
          onClick={() => {
            console.log('👆 Botón "Tomar Foto" clickeado');
            cameraInputRef.current?.click();
          }}
          disabled={uploading}
          className="flex-1 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 hover:from-cyan-600 hover:via-cyan-500 hover:to-cyan-600 text-white font-bold py-4 sm:py-5 text-base sm:text-lg rounded-xl shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        >
          {uploading ? '⏳ Subiendo...' : '📷 Tomar Foto'}
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
        <div className="space-y-4 bg-white/5 border border-white/10 rounded-lg p-5">
          <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-full transition-all duration-300 animate-pulse rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-white/70 font-medium">
              ⏳ Subiendo fotos...
            </p>
            <p className="text-sm font-bold text-purple-300">
              {uploadProgress}%
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de instrucción */}
      <div className="text-center space-y-2 pt-4">
        <p className="text-white/60 text-sm font-medium">
          💡 Puedes subir múltiples fotos a la vez
        </p>
        <p className="text-white/50 text-xs">
          Máximo 100MB por foto • JPG, PNG
        </p>
      </div>
    </div>
  );
}
