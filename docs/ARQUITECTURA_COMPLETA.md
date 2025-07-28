# Escape Booking - Arquitectura Completa del Sistema
## Estructura de Páginas, Diseño y Tecnologías

### 🎨 **Identidad Visual Global**

#### Paleta de Colores Oficial
```css
:root {
  /* Colores principales */
  --primary-red: #DC2626;      /* Rojo principal */
  --primary-black: #111827;    /* Negro principal */
  --pure-white: #FFFFFF;       /* Blanco puro */
  
  /* Variaciones de rojo */
  --red-50: #FEF2F2;
  --red-100: #FEE2E2;
  --red-200: #FECACA;
  --red-300: #FCA5A5;
  --red-400: #F87171;
  --red-500: #EF4444;
  --red-600: #DC2626;         /* Principal */
  --red-700: #B91C1C;
  --red-800: #991B1B;
  --red-900: #7F1D1D;
  
  /* Variaciones de negro/gris */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;         /* Principal */
  
  /* Colores de estado */
  --success: #059669;
  --warning: #D97706;
  --error: #DC2626;
  --info: #0284C7;
}
```

#### Tipografías Principales
```css
/* Fuente principal: Inter (moderna, legible) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Fuente secundaria: JetBrains Mono (código/datos) */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.font-code {
  font-family: 'JetBrains Mono', Consolas, 'Liberation Mono', monospace;
}
```

---

## 🏗️ **ESTRUCTURA COMPLETA DEL SISTEMA**

### 🌐 **1. SITIO WEB PÚBLICO (Marketing)**

#### **1.1 Página Principal (Landing)**
```
URL: https://escapebooking.com
Objetivo: Convertir visitantes en clientes B2B
```

**Esquema de colores:**
- Fondo: Gradiente rojo (`--red-600` a `--red-700`)
- Textos principales: Blanco
- Textos secundarios: `--red-100`
- CTAs: Botones blancos con texto negro
- Secciones alternantes: Blanco con texto negro

**Componentes principales:**
```typescript
// Estructura de la landing page
const LandingPage = {
  hero: {
    background: 'gradient-red',
    title: 'Gestiona tu Escape Room como un Pro',
    subtitle: 'IA + Reservas + Pagos en una sola plataforma',
    cta: 'Prueba Gratis 30 Días',
    demo: 'Ver Demo en Vivo'
  },
  features: {
    background: 'white',
    sections: [
      'Reservas Inteligentes',
      'IA para Game Masters', 
      'Pagos Automáticos',
      'Analytics Avanzados'
    ]
  },
  pricing: {
    background: 'gray-50',
    plans: ['Starter', 'Pro', 'Enterprise']
  },
  testimonials: {
    background: 'red-50',
    format: 'carousel'
  },
  footer: {
    background: 'gray-900',
    textColor: 'white'
  }
}
```

**Tecnologías específicas:**
- **Framework**: Next.js 14 con App Router
- **Animaciones**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

#### **1.2 Página de Características**
```
URL: /caracteristicas
Objetivo: Explicar funcionalidades en detalle
```

**Diseño:**
- Fondo: Blanco
- Headers: Negro (`--gray-900`)
- Acentos: Rojo (`--red-600`)
- Code blocks: `--gray-100` de fondo

#### **1.3 Página de Precios**
```
URL: /precios
Objetivo: Mostrar planes y precios transparentes
```

**Esquema:**
- Fondo: `--gray-50`
- Cards de precios: Blanco con borde
- Plan destacado: Borde rojo + badge rojo
- CTAs: Botones rojos

#### **1.4 Blog/Recursos**
```
URL: /blog
Objetivo: SEO y educación del mercado
```

#### **1.5 Páginas Legales**

##### **Política de Privacidad**
```
URL: /privacidad
Template: Página legal estándar
Background: Blanco
Text: --gray-700
Headers: --gray-900
```

##### **Términos de Servicio**
```
URL: /terminos
Template: Página legal estándar
```

##### **Política de Cookies**
```
URL: /cookies
Include: Banner de cookies GDPR compliant
```

##### **Aviso Legal**
```
URL: /legal
Contenido: Información de la empresa, registro mercantil, etc.
```

---

### 🔐 **2. SISTEMA DE AUTENTICACIÓN**

#### **2.1 Página de Login**
```
URL: /login
Layout: Centrado con fondo rojo
```

**Diseño:**
```typescript
const LoginPage = {
  layout: 'split-screen',
  leftSide: {
    background: 'gradient-red',
    content: 'Branding + testimonios'
  },
  rightSide: {
    background: 'white',
    form: {
      title: 'Iniciar Sesión',
      fields: ['email', 'password'],
      cta: 'Entrar',
      alternatives: ['Google SSO', 'Registro']
    }
  }
}
```

#### **2.2 Página de Registro**
```
URL: /registro
Similar a login pero con más campos
```

#### **2.3 Recuperar Contraseña**
```
URL: /recuperar-password
Layout: Simple, centrado
```

---

### 🏢 **3. PANEL DE ADMINISTRACIÓN**

#### **3.1 Dashboard Principal Admin**
```
URL: /admin
Rol requerido: ADMIN, SUPER_ADMIN
```

**Esquema de colores:**
- Sidebar: `--gray-900` (negro)
- Background principal: `--gray-50` 
- Cards: Blanco con sombra sutil
- Acentos: Rojo para métricas importantes
- Gráficos: Combinación rojo/negro/grises

**Layout:**
```typescript
const AdminLayout = {
  sidebar: {
    width: '280px',
    background: '--gray-900',
    textColor: 'white',
    activeItem: '--red-600'
  },
  header: {
    background: 'white',
    height: '64px',
    shadow: 'subtle'
  },
  main: {
    background: '--gray-50',
    padding: '24px'
  }
}
```

**Componentes del Dashboard:**
```typescript
const DashboardComponents = {
  kpiCards: [
    'Reservas Hoy',
    'Ingresos Mes', 
    'Ocupación %',
    'Clientes Nuevos'
  ],
  charts: [
    'Reservas por día (línea)',
    'Ingresos por mes (barras)',
    'Ocupación por sala (dona)',
    'Horas pico (heatmap)'
  ],
  tables: [
    'Últimas reservas',
    'Próximas reservas',
    'Game masters activos'
  ]
}
```

#### **3.2 Gestión de Reservas**
```
URL: /admin/reservas
Features: CRUD completo, filtros, búsqueda
```

**Componentes específicos:**
```typescript
const BookingManagement = {
  filters: {
    date: 'Rango de fechas',
    status: 'Estado de reserva',
    room: 'Sala específica',
    gamemaster: 'Game master asignado'
  },
  actions: {
    create: 'Nueva reserva manual',
    edit: 'Modificar reserva',
    cancel: 'Cancelar con política',
    reassign: 'Reasignar game master'
  },
  bulkActions: [
    'Exportar a CSV',
    'Enviar recordatorios',
    'Marcar como completadas'
  ]
}
```

#### **3.3 Gestión de Salas**
```
URL: /admin/salas
Features: CRUD salas, horarios, precios
```

#### **3.4 Gestión de Game Masters**
```
URL: /admin/gamemasters
Features: CRUD usuarios, asignaciones, performance
```

#### **3.5 Clientes**
```
URL: /admin/clientes
Features: Lista clientes, historial, comunicación
```

#### **3.6 Reportes y Analytics**
```
URL: /admin/reportes
Features: Dashboards avanzados, exportación
```

**Librerías específicas:**
- **Gráficos**: Recharts
- **Tablas**: TanStack Table
- **Exportación**: ExcelJS
- **PDF**: jsPDF

#### **3.7 Configuración del Negocio**
```
URL: /admin/configuracion
Sections: General, Pagos, Notificaciones, IA
```

#### **3.8 Configuración de IA**
```
URL: /admin/ia-configuracion
Features: Prompts, modelos, costos, logs
```

---

### 🎮 **4. PANEL DE GAME MASTER**

#### **4.1 Dashboard Game Master**
```
URL: /gamemaster
Rol requerido: GAME_MASTER, ADMIN
```

**Diseño específico:**
- Colores más suaves para uso diario
- Fondo: `--gray-100`
- Cards: Blanco
- Acentos: Rojo para urgencias/alertas

```typescript
const GameMasterDashboard = {
  todaySchedule: {
    layout: 'timeline',
    colors: {
      current: '--red-600',
      upcoming: '--gray-600',
      completed: '--success'
    }
  },
  aiAssistant: {
    position: 'sticky-bottom-right',
    style: 'chat-bubble',
    primaryColor: '--red-600'
  }
}
```

#### **4.2 Mis Reservas**
```
URL: /gamemaster/mis-reservas
Features: Vista calendario, lista, detalles
```

#### **4.3 Chat con IA**
```
URL: /gamemaster/asistente-ia
Features: Chat completo, historial, comandos rápidos
```

---

### 👤 **5. PORTAL DE CLIENTE**

#### **5.1 Dashboard Cliente**
```
URL: /cliente
Rol requerido: CUSTOMER (logueado)
```

**Diseño orientado al usuario final:**
- Más visual y amigable
- Fondo: Gradiente suave blanco a `--gray-50`
- Cards: Blanco con bordes redondeados
- CTAs: Botones rojos prominentes

#### **5.2 Mis Reservas**
```
URL: /cliente/reservas
Features: Historial, próximas, cancelar, modificar
```

#### **5.3 Nueva Reserva**
```
URL: /cliente/nueva-reserva
Features: Wizard paso a paso
```

---

### 🔌 **6. SISTEMA DE RESERVAS PÚBLICO**

#### **6.1 Landing de Reserva por Empresa**
```
URL: /book/{empresa-slug}
Audience: Clientes finales (B2C)
```

**Diseño personalizable por empresa:**
```typescript
const BookingLanding = {
  branding: {
    logo: 'client.logo',
    primaryColor: 'client.primaryColor || --red-600',
    secondaryColor: 'client.secondaryColor || --gray-900'
  },
  sections: [
    'Hero con salas destacadas',
    'Selector de sala',
    'Calendario disponibilidad',
    'Información empresa'
  ]
}
```

#### **6.2 Flujo de Reserva**
```
URL: /book/{empresa-slug}/reservar
Steps: Sala → Fecha → Hora → Datos → Pago → Confirmación
```

**Wizard de 6 pasos:**
```typescript
const BookingWizard = {
  steps: [
    {
      name: 'Seleccionar Sala',
      component: 'RoomSelector',
      validation: 'roomRequired'
    },
    {
      name: 'Elegir Fecha', 
      component: 'DatePicker',
      validation: 'dateRequired'
    },
    {
      name: 'Elegir Hora',
      component: 'TimeSlots',
      validation: 'timeRequired'
    },
    {
      name: 'Datos Personales',
      component: 'CustomerForm',
      validation: 'customerInfoSchema'
    },
    {
      name: 'Pago',
      component: 'StripeCheckout',
      validation: 'paymentRequired'
    },
    {
      name: 'Confirmación',
      component: 'BookingConfirmation',
      validation: null
    }
  ]
}
```

---

### 🎛️ **7. WIDGET EMBEBIDO**

#### **7.1 Widget JavaScript**
```
URL: /embed/widget.js
Purpose: Embeber en sitios web externos
```

**Configuración del widget:**
```javascript
// Código de ejemplo para clientes
<script src="https://escapebooking.com/embed/widget.js"></script>
<div id="escape-booking-widget" 
     data-business="mi-escape-room"
     data-theme="light"
     data-primary-color="#DC2626">
</div>
<script>
EscapeBooking.init({
  elementId: 'escape-booking-widget',
  business: 'mi-escape-room',
  compact: true,
  showPrices: true
});
</script>
```

#### **7.2 Configurador de Widget**
```
URL: /admin/widget-configurator
Features: Generador de código, preview, customización
```

---

### 🔧 **8. PÁGINAS DE SISTEMA**

#### **8.1 Página de Mantenimiento**
```
URL: /mantenimiento
Display: Durante updates/deployments
```

#### **8.2 Página 404**
```
URL: /404
Design: Consistent con brand, con navegación útil
```

#### **8.3 Página 500**
```
URL: /500
Design: Error amigable con opciones de contacto
```

#### **8.4 Health Check**
```
URL: /api/health
Purpose: Monitoring sistema
```

---

## 🛠️ **TECNOLOGÍAS POR SECCIÓN**

### **Frontend Global**
```json
{
  "framework": "Next.js 14.0+",
  "typescript": "5.0+",
  "styling": {
    "css": "Tailwind CSS 3.4+",
    "components": "Shadcn/ui",
    "icons": "Lucide React",
    "animations": "Framer Motion"
  },
  "forms": {
    "library": "React Hook Form",
    "validation": "Zod",
    "components": "Custom + Shadcn"
  },
  "state": {
    "global": "Zustand",
    "server": "TanStack Query (React Query)",
    "forms": "React Hook Form"
  }
}
```

### **Componentes UI Específicos**
```json
{
  "calendar": {
    "library": "FullCalendar",
    "customization": "CSS custom + Tailwind"
  },
  "charts": {
    "library": "Recharts",
    "theme": "Custom con colores brand"
  },
  "tables": {
    "library": "TanStack Table",
    "features": ["sorting", "filtering", "pagination"]
  },
  "date-picker": {
    "library": "React Day Picker",
    "styling": "Custom theme"
  },
  "rich-text": {
    "library": "Tiptap",
    "usage": "Configuración templates email"
  }
}
```

### **Backend y APIs**
```json
{
  "framework": "Next.js API Routes",
  "database": {
    "primary": "Supabase (PostgreSQL)",
    "orm": "Prisma",
    "migrations": "Prisma Migrate"
  },
  "authentication": {
    "library": "NextAuth.js",
    "providers": ["credentials", "google"],
    "session": "JWT"
  },
  "payments": {
    "provider": "Stripe",
    "features": ["checkout", "webhooks", "refunds"]
  },
  "ai": {
    "primary": "OpenAI GPT-4",
    "fallback": "Anthropic Claude",
    "caching": "Redis (Upstash)"
  },
  "email": {
    "provider": "Resend",
    "templates": "React Email"
  }
}
```

### **DevOps y Hosting**
```json
{
  "hosting": "Vercel",
  "database": "Supabase",
  "cdn": "Vercel Edge Network",
  "monitoring": {
    "analytics": "Vercel Analytics",
    "errors": "Sentry (opcional)",
    "uptime": "Built-in health checks"
  },
  "ci-cd": "GitHub Actions + Vercel",
  "environment": {
    "development": "Local + Supabase local",
    "staging": "Vercel Preview",
    "production": "Vercel Pro"
  }
}
```

---

## 📱 **RESPONSIVE DESIGN**

### **Breakpoints Estándar**
```css
/* Mobile First Approach */
:root {
  --breakpoint-sm: 640px;   /* Tablets pequeñas */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Desktop pequeño */
  --breakpoint-xl: 1280px;  /* Desktop */
  --breakpoint-2xl: 1536px; /* Desktop grande */
}
```

### **Adaptaciones por Dispositivo**

#### **Mobile (< 640px)**
- Sidebar → Bottom navigation
- Cards en columna única
- Formularios simplificados
- Calendarios adaptados

#### **Tablet (640px - 1024px)**
- Sidebar colapsable
- Grid 2 columnas
- Formularios optimizados

#### **Desktop (> 1024px)**
- Layout completo
- Sidebar fija
- Grid multi-columna
- Tooltips y shortcuts

---

## 🎨 **COMPONENTES REUTILIZABLES**

### **Sistema de Componentes**
```typescript
// Estructura de componentes
const ComponentSystem = {
  base: {
    Button: 'variants: primary, secondary, outline, ghost',
    Input: 'variants: text, email, password, search',
    Card: 'variants: default, outlined, elevated',
    Badge: 'variants: default, success, warning, error'
  },
  business: {
    BookingCard: 'Tarjeta de reserva con estados',
    RoomCard: 'Tarjeta de sala con disponibilidad',
    GameMasterCard: 'Tarjeta de game master con status',
    RevenueChart: 'Gráfico de ingresos personalizable'
  },
  layout: {
    DashboardLayout: 'Layout con sidebar y header',
    AuthLayout: 'Layout para páginas de auth',
    PublicLayout: 'Layout para páginas públicas',
    EmbedLayout: 'Layout para widget embebido'
  }
}
```

### **Design Tokens**
```typescript
// tokens/design-tokens.ts
export const designTokens = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  }
}
```

---

## 🌐 **SEO Y PERFORMANCE**

### **Configuración SEO**
```typescript
// Metadata por página
const seoConfig = {
  default: {
    title: 'Escape Booking - Sistema de Reservas para Escape Rooms',
    description: 'Gestiona tu escape room con IA. Reservas, pagos y analytics en una plataforma.',
    keywords: 'escape room, reservas, gestión, IA, pagos'
  },
  pages: {
    '/caracteristicas': {
      title: 'Características - Escape Booking',
      description: 'Descubre todas las funcionalidades de Escape Booking'
    },
    '/precios': {
      title: 'Precios - Escape Booking', 
      description: 'Planes flexibles para escape rooms de cualquier tamaño'
    }
  }
}
```

### **Optimizaciones Performance**
```typescript
const performanceConfig = {
  images: {
    formats: ['webp', 'avif'],
    quality: 80,
    placeholder: 'blur'
  },
  bundling: {
    splitChunks: true,
    treeshaking: true,
    compression: 'gzip + brotli'
  },
  caching: {
    static: '365d',
    api: '5m',
    images: '30d'
  }
}
```

---

## 📊 **ANALYTICS Y TRACKING**

### **Eventos de Tracking**
```typescript
const trackingEvents = {
  marketing: [
    'landing_page_view',
    'cta_clicked',
    'demo_requested',
    'pricing_viewed'
  ],
  booking: [
    'booking_started',
    'room_selected',
    'date_selected',
    'payment_completed',
    'booking_cancelled'
  ],
  admin: [
    'dashboard_viewed',
    'report_generated',
    'setting_changed',
    'user_created'
  ],
  ai: [
    'ai_query_made',
    'auto_assignment_triggered',
    'prediction_generated'
  ]
}
```

**Con esta arquitectura completa, Escape Booking será un sistema robusto, escalable y visualmente consistente, listo para capturar el mercado de escape rooms! 🚀**