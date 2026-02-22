# 🔧 INSTRUCCIONES PARA ARREGLAR EL PANEL DE ADMIN

## Problema
El panel de admin no muestra las acusaciones y fotos que se han enviado desde la app principal porque las políticas de RLS de Supabase no permitían que el admin leyera los datos de otros usuarios.

## Solución - 3 Pasos Simples

### PASO 1: Cambiar Políticas de RLS en Supabase
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Abre **SQL Editor** (lado izquierdo)
4. Click en **New Query**
5. Abre el archivo `SQL_ADMIN_SETUP.sql` en este proyecto
6. Copia TODO el código SQL
7. Pégalo en el SQL Editor de Supabase
8. Click en **RUN** (botón azul)

✅ Las políticas RLS se actualizarán automáticamente

### PASO 2: (OPCIONAL) Agregar Service Role Key para Extra Seguridad
Si quieres máxima seguridad (recomendado), obtén la Service Role Key:
1. En Supabase Dashboard → **Settings** → **API**
2. Busca **Service Role** (debajo de "Project API keys")
3. Copia la clave completa
4. En tu archivo `.env.local`, reemplaza la línea:
   ```
   SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY_AQUI
   ```

### PASO 3: Reiniciar la App
1. Presiona `Ctrl+C` en la terminal (si está corriendo npm run dev)
2. Ejecuta de nuevo: `npm run dev`
3. Ve a http://localhost:3000/admin
4. Ingresa PIN: `9255`
5. ¡Deberías ver todas las acusaciones y fotos!

## ¿Qué Cambió?
- ✅ Las políticas RLS ahora permiten lectura pública de acusaciones y fotos
- ✅ El insertar sigue siendo solo de tu usuario (privacidad)
- ✅ El admin puede ver TODO desde el panel
- ✅ Los datos se guardan en Supabase automáticamente

## Troubleshooting
Si aún no ves datos:
1. Verifica que el SQL se ejecutó SIN errores
2. Revisa la consola de navegador (F12) para ver si hay errores
3. Asegúrate de haber hecho logout y login de nuevo en el panel

¡Listo! 🎉
