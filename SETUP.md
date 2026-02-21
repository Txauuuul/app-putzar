# 🎭 La Gala - Setup Final e Instrucciones Completas

## 📋 Resumen de Archivos y Configuración

Todo está preparado. Para que funcione perfectamente, necesitas **SOLO** hacer esto:

### 1️⃣ Crear Proyecto Supabase

1. **Ve a https://supabase.com/ y crea una cuenta**
2. **Crea un nuevo proyecto** (nombre, región, contraseña)
3. **Espera a que se inicialice** (3-5 minutos)
4. **Abre el editor SQL** y copia/pega esto:

```sql
-- Accusations table
CREATE TABLE IF NOT EXISTS accusations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  accused_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  accusation_id UUID REFERENCES accusations(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_accusations_user_id ON accusations(user_id);
CREATE INDEX idx_accusations_created_at ON accusations(created_at);
CREATE INDEX idx_photos_user_id ON photos(user_id);
CREATE INDEX idx_photos_accusation_id ON photos(accusation_id);

-- Enable RLS
ALTER TABLE accusations ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own accusations"
  ON accusations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accusations"
  ON accusations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own photos"
  ON photos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photos"
  ON photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view settings"
  ON settings FOR SELECT
  USING (true);

-- Insert default settings
INSERT INTO settings (notifications_enabled) VALUES (true);
```

5. **Crea un Storage Bucket**:
   - Ve a **Storage** (izquierda)
   - Click **Create new bucket**
   - Nombre: `photos`
   - ✅ Make it public
   - ✅ Sube archivos: permitido
   - **Create bucket**

6. **Obtén tus credenciales**:
   - Ve a **Settings** → **API**
   - Copia:
     - `Project URL` (ej: `https://xxxxx.supabase.co`)
     - `anon public` key (la llave pública anónima)

### 2️⃣ Configurar .env.local

**En el directorio `c:\XAMP\htdocs\app-putzar\`**, edita o crea `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-url-aqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-anon-aqui

NEXT_PUBLIC_ADMIN_PIN=GalaFormal2026

NEXT_PUBLIC_NOTIFICATIONS_ENABLED=true
```

**Reemplaza:**
- `https://tu-url-aqui.supabase.co` → Tu URL real de Supabase
- `tu-key-anon-aqui` → Tu key pública
- `GalaFormal2026` → La contraseña que quieras para el admin

### 3️⃣ Ejecutar en Desarrollo

```bash
cd c:\XAMP\htdocs\app-putzar

# Ejecutar
npm run dev

# Abre en navegador: http://localhost:3000
```

✅ Listo, la app funciona.

---

## 🌐 Desplegar en Vercel (Producción)

1. **Sube tu código a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - La Gala app"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/tu-repo.git
   git push -u origin main
   ```

2. **Ve a https://vercel.com/**
3. **Click "New Project"**
4. **Selecciona tu repo de GitHub**
5. **Configura variables de entorno**:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu key
   - `NEXT_PUBLIC_ADMIN_PIN` = tu contraseña
   - `NEXT_PUBLIC_NOTIFICATIONS_ENABLED` = true

6. **Click "Deploy"** ✨

Vercel te dará una URL pública (ej: `https://la-gala.vercel.app/`)

---

## 📱 Usar en iOS/Android (PWA)

### iOS
1. Abre la app en Safari
2. Botón de compartir (arriba derecha)
3. **"Add to Home Screen"**
4. Dale un nombre
5. **Add** ✨

### Android (Chrome)
1. Abre la app en Chrome
2. Menú (3 puntos arriba derecha)
3. **"Install app"** o **"Add to home screen"**
4. **Install** ✨

---

## 📊 Estructura Completa de la App

```
app-putzar/
├── app/
│   ├── layout.tsx            # Layout con tema elegante
│   ├── page.tsx              # HOME - Usuarios (acusaciones, fotos, galería)
│   ├── globals.css           # CSS global (animaciones, tema)
│   ├── admin/
│   │   └── page.tsx          # ADMIN - Panel (protegido por PIN)
│   ├── success/
│   │   └── page.tsx          # Página de confirmación
│   └── api/
│       ├── acusaciones/
│       │   ├── route.ts       # GET (mis acusaciones) + POST (crear)
│       │   └── [id]/route.ts  # DELETE (eliminar acusación)
│       ├── fotos/
│       │   ├── route.ts       # GET (mis fotos) + POST (crear record)
│       │   └── [id]/route.ts  # DELETE (eliminar foto)
│       └── admin/
│           ├── acusaciones/route.ts  # GET (todas, solo admin)
│           ├── fotos/route.ts        # GET (todas, solo admin)
│           └── settings/route.ts     # GET + PUT (config)
├── components/
│   ├── AccusationForm.tsx    # Formulario de envío
│   ├── PhotoUpload.tsx       # Subir fotos
│   ├── Gallery.tsx           # Galería de usuario
│   ├── AdminDashboard.tsx    # Panel principal admin
│   ├── AdminTable.tsx        # Tabla de acusaciones
│   ├── AdminGallery.tsx      # Galería admin
│   └── ui/
│       ├── button.tsx        # Componente Button
│       ├── textarea.tsx      # Componente Textarea
│       ├── input.tsx         # Componente Input
│       └── toaster.tsx       # Notificaciones
├── hooks/
│   └── use-toast.tsx         # Hook de notificaciones
├── lib/
│   ├── supabase.ts           # Cliente Supabase
│   ├── auth.ts               # Funciones de auth (PIN, sesión)
│   ├── schema.ts             # Tipos y esquema SQL
│   └── utils.ts              # Funciones utilitarias
├── public/
│   └── manifest.json         # Configuración PWA
├── .env.local                # Variables de entorno (NO subir a Git)
├── package.json              # Dependencias
├── tailwind.config.ts        # Configuración de estilos
├── tsconfig.json             # TypeScript
└── README.md                 # Este documento
```

---

## 🎨 Personalización

### Cambiar contraseña admin
Edita `.env.local`:
```env
NEXT_PUBLIC_ADMIN_PIN=MiContraseña123
```

### Cambiar colores
Edita `tailwind.config.ts` → `colors` → secciones de gradientes

### Cambiar textos
- Home: `app/page.tsx`
- Admin: `app/admin/page.tsx`
- Componentes: `components/*`

### Deshabilitar notificaciones
Edita `.env.local`:
```env
NEXT_PUBLIC_NOTIFICATIONS_ENABLED=false
```

---

## 🔐 Cómo Funciona la Seguridad

1. **Autenticación Anónima**: Cada usuario obtiene un ID único sin datos personales
2. **RLS (Row Level Security)**: Supabase solo devuelve datos del usuario actual (excepto admin)
3. **PIN Admin**: Protege el panel administrativo con una contraseña
4. **Storage**: Las fotos se almacenan en buckets públicos de Supabase

---

## 🚨 Troubleshooting

### Error: "Cannot find module @supabase/supabase-js"
```bash
npm install
```

### Error: "NEXT_PUBLIC_SUPABASE_URL is undefined"
- Verifica que `.env.local` exista
- Reinicia el servidor (`Ctrl+C` y `npm run dev`)

### Las fotos no se suben
- Verifica que el bucket `photos` existe en Supabase Storage
- Verifica que está marcado como **public**
- Verifica los permisos RLS

### Admin PIN no funciona
- Asegúrate de escribir exactamente lo que tienen en `.env.local`
- Ten en cuenta mayúsculas/minúsculas

### La app se ve rara en móvil
- Limpia caché del navegador
- Recarga la página (Ctrl+Shift+R o Cmd+Shift+R)

---

## 📝 API Reference

### Para Usuarios

**Enviar acusación:**
```bash
POST /api/acusaciones
Content-Type: application/json

{
  "accused_name": "Juan",
  "reason": "Se comió todo el pastel"
}
```

**Obtener mis acusaciones:**
```bash
GET /api/acusaciones
```

**Eliminar acusación (solo mía):**
```bash
DELETE /api/acusaciones/[ID]
```

**Subir foto:**
```bash
POST /api/fotos
Content-Type: application/json

{
  "photo_url": "https://supabase.co/.../foto.jpg"
}
```

### Para Admin

**Obtener todas las acusaciones:**
```bash
GET /api/admin/acusaciones
Header: x-admin-pin: GalaFormal2026
```

**Obtener todas las fotos:**
```bash
GET /api/admin/fotos
Header: x-admin-pin: GalaFormal2026
```

**Eliminar acusación (como admin):**
```bash
DELETE /api/acusaciones/[ID]
Header: x-admin-pin: GalaFormal2026
```

---

## 🎯 Features Completas

✅ **Home Page**
- Tabs: Acusación / Fotos / Galería
- Formulario elegante para acusaciones
- Sistema de carga de fotos (galería o cámara)
- Galería personal del usuario
- Animaciones suaves

✅ **Admin Panel** (`/admin`)
- Login con PIN
- Tabla de acusaciones (elegante, responsiva)
- Galería de fotos (grid)
- Estadísticas (total acusaciones, fotos, usuarios)
- Toggle de notificaciones
- Botones para eliminar contenido
- Diseño oscuro profesional

✅ **PWA (Progressive Web App)**
- Funciona sin internet (offline)
- Se instala como app en iOS y Android
- Icono en home screen
- Notificaciones push opcionales

✅ **Seguridad**
- Anonimato total (no se piden emails)
- Autenticación anónima de Supabase
- RLS para privacidad de datos
- PIN para admin

---

## 🚀 Próximos Pasos

1. **Configura Supabase** (punto 1 arriba)
2. **Edita `.env.local`** (punto 2)
3. **Ejecuta `npm run dev`** (punto 3)
4. **Prueba en móvil** (http://tu-ip-local:3000)
5. **Cuando esté listo, deploy a Vercel**

---

## ❤️ Disfruta tu gala! 

Todos los amigos verán un panel elegante, misterioso y divertido. **¡Qué comience la votación de acusaciones!** 

✨🎭✨
