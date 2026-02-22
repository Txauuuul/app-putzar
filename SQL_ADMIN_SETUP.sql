-- EJECUTA ESTO EN TU DASHBOARD DE SUPABASE
-- Supabase Dashboard → SQL Editor → New Query
-- Esto permitirá que el panel de admin vea todos los registros

-- 1. Primero, elimina las políticas RLS restrictivas existentes
DROP POLICY IF EXISTS "Users can view own accusations" ON accusations;
DROP POLICY IF EXISTS "Users can insert own accusations" ON accusations;
DROP POLICY IF EXISTS "Users can view own photos" ON photos;
DROP POLICY IF EXISTS "Users can insert own photos" ON photos;

-- 2. Crea nuevas políticas que permitan al admin leer todo
-- Mantén la restricción para insertar (solo tu propio usuario_id)

-- ACCUSATIONS TABLE POLICIES
-- Política: Cualquiera puede leer todas las acusaciones
CREATE POLICY "Anyone can view all accusations"
  ON accusations FOR SELECT
  USING (true);

-- Política: Solo usuarios autenticados pueden crear sus propias acusaciones
CREATE POLICY "Users can insert own accusations"
  ON accusations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Solo pode borrar sus propias acusaciones (ni admin)
CREATE POLICY "Users can delete own accusations"
  ON accusations FOR DELETE
  USING (auth.uid() = user_id);

-- PHOTOS TABLE POLICIES
-- Política: Cualquiera puede ver todas las fotos
CREATE POLICY "Anyone can view all photos"
  ON photos FOR SELECT
  USING (true);

-- Política: Solo usuarios autenticados pueden uploadar sus propias fotos
CREATE POLICY "Users can insert own photos"
  ON photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Solo puede borrar sus propias fotos
CREATE POLICY "Users can delete own photos"
  ON photos FOR DELETE
  USING (auth.uid() = user_id);

-- SETTINGS TABLE POLICIES (sin cambios)
-- Política: Todos pueden leer settings
CREATE POLICY IF NOT EXISTS "Everyone can view settings"
  ON settings FOR SELECT
  USING (true);

-- Política: Solo admins pueden actualizar (manejado en la app)
CREATE POLICY IF NOT EXISTS "Settings are read-only from app"
  ON settings FOR UPDATE
  USING (false);

-- ✅ Listo! Ahora el admin puede ver todas las acusaciones y fotos
-- Presiona "RUN" para ejecutar este script
