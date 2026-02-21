# 🎭 La Gala - Plataforma de Acusaciones

Una aplicación moderna, elegante y responsiva para gestionar acusaciones y fotos en una gala de amigos. Construida con **Next.js**, **TailwindCSS**, **Supabase** y desplegable en **Vercel**.

## ✨ Características

✅ **Anonimato Total** - Sin registro, autenticación anónima de dispositivo  
✅ **Acusaciones Rápidas** - Formulario simple y directo  
✅ **Galería de Fotos** - Sin límite de subidas  
✅ **Panel de Admin** - Protegido por PIN, responsivo (móvil y PC)  
✅ **PWA** - Funciona como app en iOS y Android  
✅ **Tema Elegante** - Diseño noir/gala formal con detalles dorados  
✅ **Notificaciones Toggle** - Activables/desactivables desde admin  

## 🚀 Setup Rápido

### 1. Configurar Supabase

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ejecuta el SQL siguiente en el SQL Editor:

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

-- Settings table (global)
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
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

4. **Crea un Storage Bucket**:
   - Ve a Storage → Create a new bucket
   - Nombre: `photos`
   - Make it public ✓
   - Sube archivos: ✓

5. **Obtén tus credenciales**:
   - Ve a Settings → API
   - Copia `Project URL` y `anon public key`

### 2. Configurar Variables de Entorno

Crea o edita `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-aqui

# Admin PIN (cambiar por tu contraseña elegida)
NEXT_PUBLIC_ADMIN_PIN=GalaFormal2026

# Notificaciones (true/false)
NEXT_PUBLIC_NOTIFICATIONS_ENABLED=true
```

### 3. Instalar Dependencias y Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000
```

### 4. Desplegar en Vercel

```bash
# Conectar repositorio de Git
git init
git add .
git commit -m "Initial commit"

# O directamente en Vercel:
# 1. Ve a vercel.com
# 2. Importa este repositorio
# 3. Configura las variables de entorno
# 4. Deploy
```

## 📱 URLs Principales

- **Home (Usuarios)**: `/` - Enviar acusaciones y fotos
- **Admin Dashboard**: `/admin` - Panel de control (requiere PIN)
- **Success**: `/success` - Confirmación de envío

## 🎨 Diseño

- **Tema**: Negro elegante con detalles dorados
- **Animaciones**: Suaves y sutiles (blob, fade, slide)
- **Responsivo**: Móvil, tablet y desktop
- **Accesibilidad**: Contrastes altos, navegación clara

## 🔐 Seguridad

✅ **Autenticación Anónima** - No se recopilan datos personales  
✅ **RLS (Row Level Security)** - Usuarios solo ven sus propios datos  
✅ **PIN Admin** - Protección de panel administrativo  
✅ **Storage Seguro** - Tokens firmados, URLs temporales opcionales  

## 📊 API Endpoints

### Usuarios
- `GET /api/acusaciones` - Mis acusaciones
- `POST /api/acusaciones` - Enviar acusación
- `DELETE /api/acusaciones/[id]` - Eliminar mi acusación
- `GET /api/fotos` - Mis fotos
- `POST /api/fotos` - Guardar referencia de foto
- `DELETE /api/fotos/[id]` - Eliminar mi foto

### Admin (requiere header `x-admin-pin`)
- `GET /api/admin/acusaciones` - Todas las acusaciones
- `GET /api/admin/fotos` - Todas las fotos
- `GET /api/admin/settings` - Configuración
- `PUT /api/admin/settings` - Actualizar configuración

## 🛠️ Estructura de Carpetas

```
app-putzar/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Home
│   ├── globals.css         # Estilos globales
│   ├── admin/
│   │   └── page.tsx        # Panel admin
│   ├── success/
│   │   └── page.tsx        # Página de éxito
│   └── api/
│       ├── acusaciones/    # API acusaciones
│       ├── fotos/          # API fotos
│       └── admin/          # API admin
├── components/
│   ├── AccusationForm.tsx  # Formulario de acusación
│   ├── PhotoUpload.tsx     # Subida de fotos
│   ├── Gallery.tsx         # Galería
│   ├── AdminDashboard.tsx  # Dashboard admin
│   ├── AdminTable.tsx      # Tabla de acusaciones
│   ├── AdminGallery.tsx    # Galería admin
│   └── ui/                 # Componentes UI
├── lib/
│   ├── supabase.ts         # Cliente Supabase
│   ├── auth.ts             # Funciones de auth
│   ├── schema.ts           # Tipos y esquema
│   └── utils.ts            # Utilidades
├── public/
│   └── manifest.json       # Configuración PWA
└── .env.local              # Variables de entorno
```

## 🧑‍💻 Desarrollo

### Agregar nueva característica

1. Crear componente en `components/`
2. Si necesita API, crear ruta en `app/api/`
3. Agregar tipos en `lib/schema.ts`
4. Importar y usar en las páginas

### Cambiar PIN

Edita `.env.local`:
```env
NEXT_PUBLIC_ADMIN_PIN=TuNuevoPin2026
```

### Personalizar Colores

Edita `tailwind.config.ts`:
```typescript
colors: {
  gold: { 500: '#tu-color' },
}
```

## 📦 Dependencias Principales

- **next**: Framework React
- **@supabase/supabase-js**: Cliente Supabase
- **tailwindcss**: Utilidades CSS
- **typescript**: Tipado estático
- **next-pwa**: Soporte PWA

## 🚨 Troubleshooting

### "Error: NEXT_PUBLIC_SUPABASE_URL is undefined"
→ Verifica que `.env.local` exista y tenga las variables correctas

### "Rows returned 403 Forbidden"
→ Verifica las políticas RLS en Supabase. El usuario podría no estar autenticado

### "Photos no se suben"
→ Verifica que el bucket `photos` existe en Supabase Storage y es public

### "Admin PIN no funciona"
→ Verifica que la contraseña coincida con `NEXT_PUBLIC_ADMIN_PIN`

## 📝 Notas

- Las acusaciones/fotos son anónimas, solo el admin ve a quién pertenecen
- Los timestamps se almacenan en UTC
- Las fotos se eliminan de Storage al eliminar el registro
- La sesión admin expira en 24 horas

## 📞 Soporte

Para problemas:
1. Revisa el console del navegador (F12)
2. Verifica los logs en Vercel/terminal
3. Consulta la documentación de [Supabase](https://supabase.com/docs)

---

**Hecho con ❤️ para una gala inolvidable** ✨

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
