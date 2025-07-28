# Configuración de Supabase - Escape Booking

## 🚀 Pasos para configurar Supabase

### 1. Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crear cuenta / iniciar sesión
3. Click en "New Project"
4. Configuración del proyecto:
   - **Name**: `escape-booking`
   - **Database Password**: Genera una contraseña segura
   - **Region**: Europe (West) - `eu-west-1`
   - **Plan**: Free tier

### 2. Obtener credenciales

Una vez creado el proyecto, ve a **Settings → API**:

- **Project URL**: `https://your-project-id.supabase.co`
- **API Key (anon public)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **API Key (service_role)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ⚠️ **SECRETO**

### 3. Configurar variables de entorno

Edita el archivo `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Ejecutar migraciones de base de datos

#### Opción A: SQL Editor en Supabase Dashboard

1. Ve a **SQL Editor** en tu dashboard de Supabase
2. Ejecuta cada archivo en orden:
   1. `supabase/migrations/20250728000001_initial_schema.sql`
   2. `supabase/migrations/20250728000002_rls_policies.sql`
   3. `supabase/migrations/20250728000003_functions_triggers.sql`

#### Opción B: Supabase CLI (Recomendado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto local
supabase init

# Conectar con tu proyecto
supabase link --project-ref your-project-id

# Aplicar migraciones
supabase db push
```

### 5. Configurar autenticación

En **Authentication → Settings**:

1. **Site URL**: `http://localhost:3000` (desarrollo) / `https://yourdomain.com` (producción)
2. **Redirect URLs**: 
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`

#### Providers sociales (opcional):

**Google OAuth**:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear proyecto / seleccionar proyecto
3. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
4. Authorized redirect URIs: `https://your-project-id.supabase.co/auth/v1/callback`
5. Copiar Client ID y Client Secret a Supabase

### 6. Configurar Row Level Security (RLS)

Las políticas RLS ya están incluidas en las migraciones. Verificar en **Database → Policies** que todas las tablas tienen políticas activas.

### 7. Datos de prueba (opcional)

Crear una organización de prueba:

```sql
-- Insertar organización de prueba
INSERT INTO organizations (name, slug, email, city, country) VALUES 
('Escape Room Demo', 'demo', 'demo@escapebooking.com', 'Madrid', 'Spain');

-- Insertar escape room de prueba
INSERT INTO escape_rooms (organization_id, name, slug, description, difficulty_level, duration_minutes, min_players, max_players, price_per_person) VALUES 
((SELECT id FROM organizations WHERE slug = 'demo'), 'El Misterio del Pharaón', 'misterio-pharaon', 'Una aventura egipcia llena de enigmas y tesoros ocultos', 3, 60, 2, 6, 25.00);
```

## 🔧 Estructura de la base de datos

### Tablas principales:

- **organizations**: Multi-tenant, cada escape room es una organización
- **profiles**: Usuarios extendidos de Supabase Auth
- **escape_rooms**: Salas de escape con configuración
- **bookings**: Reservas de clientes
- **game_masters**: Game masters asignables
- **payments**: Pagos con Stripe
- **availability_slots**: Horarios disponibles
- **ai_chat_sessions**: Sesiones de chat con IA
- **analytics_events**: Eventos para analytics

### Funciones útiles:

- `check_room_availability()`: Verificar disponibilidad de sala
- `get_organization_stats()`: Estadísticas de la organización
- `get_booking_recommendations()`: Recomendaciones de IA

## 🧪 Testing de la configuración

```bash
# Verificar conexión
npm run dev

# Debería funcionar sin errores de conexión a Supabase
```

## 🚨 Troubleshooting

### Error: "Invalid API key"
- Verificar que las keys en `.env.local` sean correctas
- Reiniciar el servidor de desarrollo (`npm run dev`)

### Error: "Database connection failed"  
- Verificar que el proyecto esté activo en Supabase
- Verificar la URL del proyecto

### Error: "RLS policy violation"
- Verificar que las políticas RLS se hayan aplicado correctamente
- Verificar que el usuario tenga una organización asignada

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de autenticación Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
