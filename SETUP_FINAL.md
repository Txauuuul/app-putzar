# 🚀 GUÍA FINAL - HACER QUE TODO FUNCIONE

## ✅ ESTADO ACTUAL

**Lo bueno (YA FUNCIONA):**
- ✅ Las acusaciones SE GUARDAN en la BD cuando las envías
- ✅ Las fotos SE GUARDAN en la BD cuando las subes
- ✅ El modal bonito verde aparece confirmando que se envió
- ✅ Los endpoint de envío (POST) funcionan perfectamente

**Lo que FALTA (UN PASO):**
- ⚠️ El panel de admin aún retorna **403 Prohibido** cuando intenta leer los datos
- ⚠️ Esto es porque las políticas de seguridad Supabase (RLS) no permiten la lectura cruzada

---

## 🔧 SOLUCIÓN - 2 OPCIONES (Elige una)

### ⭐ OPCIÓN 1: RECOMENDADA (5 minutos)

Ejecutar el script SQL que cambia las políticas de RLS:

#### Paso 1: Ve a Supabase
1. Abre https://supabase.com/dashboard
2. Selecciona tu proyecto "czmbewilcrwerebhxnmo"

#### Paso 2: Abre SQL Editor
1. En el menú izquierdo, busca **SQL Editor**
2. Haz click en **New Query**

#### Paso 3: Copia el SQL
1. En tu proyecto local, abre el archivo: **SQL_ADMIN_SETUP.sql**
2. **Copia TODO el contenido**

#### Paso 4: Ejecuta en Supabase
1. Pega el código en el SQL Editor
2. Haz click en el botón **RUN** (azul, parte superior derecha)
3. ⏳ Espera 3-5 segundos
4. Deberías ver ✅ "Success" al final

#### ¿QUÉ HACE ESTE SQL?
- Permite que TODOS lean acusaciones y fotos (para el admin)
- Sigue permitiendo que cada usuario solo INSERT sus propios datos
- Los usuarios aún pueden BORRAR solo sus propios datos

---

### 🔐 OPCIÓN 2: EXTRA SEGURIDAD (Recomendado + esto)

Si quieres máxima seguridad (combina con Opción 1):

#### Paso 1: Obtén Service Role Key
1. En Supabase → **Settings** → **API**
2. Bajo "Project API keys", encuentra **Service Role Secret**
3. Haz click en el ícono de copiar (copia la clave completa)

#### Paso 2: Agrega a .env.local
1. Abre tu proyecto local
2. Abre el archivo `.env.local`
3. Busca esta línea:
   ```
   # SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui_REEMPLAZA_ESTO
   ```
4. Reemplázala con:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (tu service role key aquí)
   ```
5. ⚠️ **IMPORTANTE**: No publiques esta clave. Es como una contraseña super poderosa.

#### Paso 3: Reinicia
1. Presiona `Ctrl+C` en la terminal
2. Corre: `npm run dev`
3. Ya está

---

## 🧪 VERIFICAR QUE FUNCIONA

### Prueba 1: Enviar acusación desde la app
1. Ve a http://localhost:3000/
2. Escribe una acusación (ej: "Acuso a Juan por algo")
3. Haz click en "Enviar acusación"
4. **DEBERÍAS VER** un modal verde que dice "✅ ¡Acusación Enviada!"

### Prueba 2: Ver en panel de admin
1. Ve a http://localhost:3000/admin
2. Ingresa el PIN: `9255`
3. **DEBERÍAS VER** las acusaciones que acabas de enviar en la tabla
4. Haz click en la pestaña "🖼️ Fotos" y sube una foto
5. **DEBERÍAS VER** la foto en la galería del admin

---

## ❓ TROUBLESHOOTING

### P: Ejecuté el SQL pero el admin panel SIGUE mostrando 403
**R:** Has esto:
1. Cierra el navegador completamente
2. Limpia la caché del navegador (Ctrl+Shift+Supr)
3. Abre una pestana incógnita
4. Ve a http://localhost:3000/admin
5. Si sigue sin funcionar, escríbeme el error exacto que ves

### P: No veo el modal verde cuando envío acusación
**R:** 
1. Abre la consola del navegador (F12)
2. Ve a la tab "Console"
3. Envía una acusación
4. ¿Qué dice la consola? (envía la pantalla)

### P: Las fotos se suben pero no aparecen en el admin
**R:** Mismo que el anterior - el SQL script debería arreglarlo. Si no, es el mismo 403.

### P: Quiero agregar más validaciones o cambiar cosas
**R:** Escríbeme qué quieres cambiar y lo hacemos juntos

---

## 📋 RESUMEN RÁPIDO

1. ✅ Acusaciones se guardan → YA FUNCIONA
2. ✅ Fotos se guardan → YA FUNCIONA  
3. ⚠️ Admin panel lee datos → **NECESITA SQL SCRIPT (Opción 1)**
4. 🔐 Max seguridad → **OPCIONAL (Opción 2)**

---

## 🎯 PRÓXIMOS PASOS

1. **Ahora mismo**: Ejecuta el SQL script de Supabase (Opción 1)
2. **En 3-5 min**: Recarga el panel de admin
3. **¡Listo!**: Deberías verlo todo funcionando

**Cuéntame cuando lo hayas hecho y verificaré que todo está perfecto.** 💪

---

## 📞 PREGUNTAS?

Si algo no funciona o tienes dudas, cuéntame exactamente:
- ¿Qué paso es el que falla?
- ¿Qué error ves exactamente?
- ¿Qué esperabas ver?

¡Vamos a arreglarlo! 🚀
