# Escape Booking - Sistema de Reservas con IA

## Documentación Técnica y Funcional

### Índice

1. [Visión General del Proyecto](#vision-general)
2. [Arquitectura del Sistema](#arquitectura)
3. [Funcionalidades Core](#funcionalidades-core)
4. [Funcionalidades con Inteligencia Artificial](#ia-features)
5. [Stack Tecnológico](#stack-tecnologico)
6. [Estructura del Proyecto](#estructura-proyecto)
7. [Modelos de Datos](#modelos-datos)
8. [APIs y Endpoints](#apis-endpoints)
9. [Autenticación y Autorización](#auth)
10. [Interfaz de Usuario](#ui-ux)
11. [Integración de Calendario Embebido](#calendario-embebido)
12. [Sistema de Notificaciones](#notificaciones)
13. [Panel de Administración](#admin-panel)
14. [Optimización para Costos](#optimizacion-costos)
15. [Despliegue y DevOps](#deployment)
16. [Testing y Calidad](#testing)
17. [Mantenimiento y Actualizaciones](#mantenimiento)

---

## 1. Visión General del Proyecto {#vision-general}

### Objetivo

Desarrollar un sistema de reservas moderno y escalable para escape rooms que incluya funcionalidades de inteligencia artificial para optimizar la gestión de reservas, asignación automática de game masters, y personalización completa para diferentes empresas.

### Características Principales

- **Sistema de Reservas Multi-Sala**: Gestión de múltiples salas con diferentes horarios
- **IA para Game Masters**: Asignación automática y asistente de consultas
- **Calendario Embebido**: Integración en sitios web externos
- **Panel de Administración**: Configuración completa del negocio
- **Multi-tenant**: Un sistema para múltiples empresas de escape rooms
- **Optimizado para Costos**: Arquitectura eficiente para presupuestos limitados

---

## 2. Arquitectura del Sistema {#arquitectura}

### Arquitectura General

```
Frontend (Next.js)
├── Public Website (Landing + Booking)
├── Admin Dashboard
├── Game Master Panel
└── Customer Portal

Backend (Next.js API Routes)
├── Authentication Service
├── Booking Management
├── AI Services
├── Notification System
└── Integration APIs

Database (PostgreSQL)
├── Users & Authentication
├── Businesses & Configurations
├── Rooms & Schedules
├── Bookings & Payments
└── AI Training Data

External Services
├── OpenAI/Anthropic (IA)
├── Stripe (Pagos)
├── SendGrid (Email)
├── Vercel (Hosting)
└── Supabase (Database)
```

### Principios de Diseño

- **Modular**: Componentes reutilizables e independientes
- **Escalable**: Arquitectura que crece con el negocio
- **Costo-Eficiente**: Uso inteligente de recursos
- **Multi-Tenant**: Un sistema, múltiples clientes

---

## 3. Funcionalidades Core {#funcionalidades-core}

### 3.1 Gestión de Reservas

- **Calendario Inteligente**: Visualización clara de disponibilidad
- **Reserva en Tiempo Real**: Actualizaciones instantáneas
- **Gestión de Conflictos**: Prevención de doble reservas
- **Modificación de Reservas**: Cambio de fecha/hora fácil
- **Cancelaciones**: Sistema flexible de cancelaciones

### 3.2 Gestión de Salas

- **Configuración Flexible**: Número de salas personalizable
- **Horarios Personalizados**: Diferentes horarios por sala
- **Capacidad Variable**: Configuración de personas por sala
- **Mantenimiento**: Bloqueo de salas para mantenimiento
- **Precios Dinámicos**: Diferentes precios por sala/horario

### 3.3 Gestión de Usuarios

- **Clientes**: Registro, perfil, historial
- **Game Masters**: Asignación, horarios, performance
- **Administradores**: Control total del sistema
- **Staff**: Acceso limitado a funciones específicas

### 3.4 Sistema de Pagos

- **Múltiples Métodos**: Tarjeta, PayPal, transferencia
- **Pagos Anticipados**: Reserva con pago inmediato
- **Reembolsos**: Sistema automatizado de reembolsos
- **Reportes Financieros**: Dashboard de ingresos

---

## 4. Funcionalidades con Inteligencia Artificial {#ia-features}

### 4.1 Asistente IA para Game Masters

```typescript
// Ejemplo de consulta IA
interface AIQuery {
  question: string;
  context: {
    currentTime: Date;
    gamemaster: string;
    businessId: string;
  };
}

// Respuestas típicas:
// "¿Cuál es mi próxima reserva?"
// "¿Hay alguna reserva para las 3 PM?"
// "¿Cuántas personas esperamos hoy?"
```

### 4.2 Asignación Automática de Game Masters

```typescript
interface AutoAssignment {
  criteria: {
    experience: number;
    availability: Date[];
    roomSpecialty: string[];
    workload: number;
    customerRating: number;
  };
  algorithm: "balanced" | "experience" | "availability";
}
```

### 4.3 Predicción de Demanda

- **Análisis de Patrones**: Identificación de horas pico
- **Recomendaciones de Precios**: Precios dinámicos por demanda
- **Optimización de Horarios**: Sugerencias de horarios óptimos
- **Alertas Predictivas**: Notificaciones de alta demanda

### 4.4 Chatbot de Atención al Cliente

- **Consultas Comunes**: Respuestas automáticas
- **Información de Reservas**: Estado de reservas
- **Recomendaciones**: Salas sugeridas por preferencias
- **Escalación Humana**: Transferencia a staff cuando es necesario

---

## 5. Stack Tecnológico {#stack-tecnologico}

### Frontend

```json
{
  "framework": "Next.js 14",
  "ui": "Tailwind CSS + Shadcn/ui",
  "state": "Zustand",
  "forms": "React Hook Form + Zod",
  "calendar": "FullCalendar",
  "charts": "Recharts",
  "animations": "Framer Motion"
}
```

### Backend

```json
{
  "api": "Next.js API Routes",
  "database": "Supabase (PostgreSQL)",
  "orm": "Prisma",
  "auth": "NextAuth.js",
  "payments": "Stripe",
  "ai": "OpenAI API / Anthropic",
  "email": "Resend",
  "storage": "Supabase Storage"
}
```

### DevOps y Hosting

```json
{
  "hosting": "Vercel",
  "database": "Supabase",
  "monitoring": "Vercel Analytics",
  "errors": "Sentry (opcional)",
  "domain": "Namecheap/Cloudflare"
}
```

---

## 6. Estructura del Proyecto {#estructura-proyecto}

```
escape-rooms-system/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── .env.example
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── admin/
│   │   │   ├── gamemaster/
│   │   │   └── customer/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── bookings/
│   │   │   ├── rooms/
│   │   │   ├── ai/
│   │   │   └── webhooks/
│   │   ├── booking/
│   │   │   └── [businessId]/
│   │   ├── embed/
│   │   │   └── calendar/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── booking/
│   │   ├── admin/
│   │   ├── gamemaster/
│   │   └── shared/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── ai.ts
│   │   ├── payments.ts
│   │   └── utils.ts
│   ├── hooks/
│   ├── types/
│   └── store/
├── docs/
│   ├── api.md
│   ├── deployment.md
│   └── user-guide.md
└── tests/
    ├── __mocks__/
    ├── components/
    └── api/
```

---

## 7. Modelos de Datos {#modelos-datos}

### 7.1 Schema Principal (Prisma)

```prisma
model Business {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  email       String
  phone       String?
  address     String?
  logo        String?
  primaryColor String  @default("#000000")
  settings    Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  rooms       Room[]
  users       User[]
  bookings    Booking[]

  @@map("businesses")
}

model Room {
  id          String   @id @default(cuid())
  name        String
  description String?
  capacity    Int
  duration    Int      // minutos
  price       Decimal
  isActive    Boolean  @default(true)
  images      String[]
  businessId  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  business    Business @relation(fields: [businessId], references: [id])
  bookings    Booking[]
  schedules   RoomSchedule[]

  @@map("rooms")
}

model RoomSchedule {
  id        String    @id @default(cuid())
  roomId    String
  dayOfWeek Int       // 0-6 (domingo-sábado)
  startTime String    // "09:00"
  endTime   String    // "22:00"
  interval  Int       // minutos entre slots
  isActive  Boolean   @default(true)

  room      Room      @relation(fields: [roomId], references: [id])

  @@map("room_schedules")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String
  phone       String?
  role        UserRole @default(CUSTOMER)
  businessId  String?
  settings    Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  business    Business? @relation(fields: [businessId], references: [id])
  bookings    Booking[]
  assignments GameMasterAssignment[]

  @@map("users")
}

model Booking {
  id           String        @id @default(cuid())
  customerId   String
  roomId       String
  businessId   String
  date         DateTime
  startTime    String
  participants Int
  totalPrice   Decimal
  status       BookingStatus @default(PENDING)
  paymentId    String?
  notes        String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  customer     User          @relation(fields: [customerId], references: [id])
  room         Room          @relation(fields: [roomId], references: [id])
  business     Business      @relation(fields: [businessId], references: [id])
  assignment   GameMasterAssignment?

  @@map("bookings")
}

model GameMasterAssignment {
  id          String   @id @default(cuid())
  bookingId   String   @unique
  gameMasterId String
  assignedAt  DateTime @default(now())
  assignedBy  String?  // manual vs auto

  booking     Booking  @relation(fields: [bookingId], references: [id])
  gameMaster  User     @relation(fields: [gameMasterId], references: [id])

  @@map("gamemaster_assignments")
}

enum UserRole {
  CUSTOMER
  GAME_MASTER
  ADMIN
  SUPER_ADMIN
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}
```

---

## 8. APIs y Endpoints {#apis-endpoints}

### 8.1 Estructura de APIs

```typescript
// /api/auth/*
POST / api / auth / signup;
POST / api / auth / signin;
POST / api / auth / signout;
GET / api / auth / me;

// /api/businesses/*
GET / api / businesses;
POST / api / businesses;
GET / api / businesses / [id];
PUT / api / businesses / [id];
DELETE / api / businesses / [id];
GET / api / businesses / [id] / settings;

// /api/rooms/*
GET / api / rooms;
POST / api / rooms;
GET / api / rooms / [id];
PUT / api / rooms / [id];
DELETE / api / rooms / [id];
GET / api / rooms / [id] / availability;

// /api/bookings/*
GET / api / bookings;
POST / api / bookings;
GET / api / bookings / [id];
PUT / api / bookings / [id];
DELETE / api / bookings / [id];
POST / api / bookings / [id] / cancel;

// /api/ai/*
POST / api / ai / chat;
POST / api / ai / assign - gamemaster;
GET / api / ai / predictions;
POST / api / ai / recommendations;

// /api/payments/*
POST / api / payments / create - intent;
POST / api / payments / confirm;
POST / api / payments / refund;
GET / api / payments / [id] / status;

// /api/embed/*
GET / api / embed / calendar / [businessId];
GET / api / embed / availability / [businessId];
POST / api / embed / booking / [businessId];
```

### 8.2 Ejemplos de Endpoints

#### Crear Reserva

```typescript
// POST /api/bookings
interface CreateBookingRequest {
  roomId: string;
  date: string; // "2024-07-28"
  startTime: string; // "14:00"
  participants: number;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  notes?: string;
}

interface CreateBookingResponse {
  booking: {
    id: string;
    confirmationCode: string;
    totalPrice: number;
    paymentUrl?: string;
  };
}
```

#### Consulta IA

```typescript
// POST /api/ai/chat
interface AIChatRequest {
  message: string;
  context: {
    userId: string;
    businessId: string;
    currentTime: string;
  };
}

interface AIChatResponse {
  response: string;
  action?: {
    type: "show_bookings" | "create_booking" | "call_human";
    data?: any;
  };
}
```

---

## 9. Autenticación y Autorización {#auth}

### 9.1 Configuración NextAuth.js

```typescript
// lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Lógica de autenticación
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.businessId = user.businessId;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.role = token.role;
      session.user.businessId = token.businessId;
      return session;
    },
  },
};
```

### 9.2 Middleware de Autorización

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Lógica de autorización por rutas
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Rutas públicas
        if (pathname.startsWith("/booking/")) return true;
        if (pathname.startsWith("/embed/")) return true;

        // Rutas que requieren autenticación
        if (pathname.startsWith("/admin/")) {
          return token?.role === "ADMIN" || token?.role === "SUPER_ADMIN";
        }

        if (pathname.startsWith("/gamemaster/")) {
          return token?.role === "GAME_MASTER" || token?.role === "ADMIN";
        }

        return !!token;
      },
    },
  }
);
```

---

## 10. Interfaz de Usuario {#ui-ux}

### 10.1 Diseño del Sistema

- **Design System**: Consistencia visual con Shadcn/ui
- **Responsive**: Mobile-first approach
- **Accesibilidad**: Cumplimiento WCAG 2.1
- **Dark Mode**: Soporte para tema oscuro
- **Personalización**: Branding por empresa

### 10.2 Componentes Principales

#### Calendario de Reservas

```typescript
// components/booking/BookingCalendar.tsx
interface BookingCalendarProps {
  businessId: string;
  roomId?: string;
  onDateSelect: (date: Date, time: string) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function BookingCalendar({
  businessId,
  roomId,
  onDateSelect,
  minDate = new Date(),
  maxDate,
}: BookingCalendarProps) {
  // Implementación del calendario
}
```

#### Panel de Game Master

```typescript
// components/gamemaster/GameMasterDashboard.tsx
export function GameMasterDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <TodaySchedule />
        <UpcomingBookings />
      </div>
      <div>
        <AIAssistant />
        <QuickActions />
      </div>
    </div>
  );
}
```

### 10.3 Experiencia de Usuario

#### Flujo de Reserva

1. **Selección de Sala**: Grid visual de salas disponibles
2. **Selección de Fecha**: Calendario con disponibilidad
3. **Selección de Hora**: Slots disponibles del día
4. **Información Personal**: Formulario mínimo
5. **Pago**: Integración con Stripe
6. **Confirmación**: Email y SMS automáticos

#### Dashboard de Admin

1. **Overview**: KPIs principales y gráficos
2. **Reservas**: Lista filtrable y paginada
3. **Salas**: Gestión completa de salas
4. **Game Masters**: Asignaciones y performance
5. **Configuración**: Settings del negocio
6. **Reportes**: Analytics detallados

---

## 11. Integración de Calendario Embebido {#calendario-embebido}

### 11.1 Widget Embebido

```html
<!-- Código para insertar en sitios web externos -->
<script src="https://tu-dominio.com/embed/widget.js"></script>
<div
  id="escape-room-booking"
  data-business="business-slug"
  data-theme="light"
  data-primary-color="#007bff"
></div>
<script>
  EscapeRoomBooking.init({
    elementId: "escape-room-booking",
    business: "business-slug",
    onBookingComplete: (booking) => {
      console.log("Reserva completada:", booking);
    },
  });
</script>
```

### 11.2 API para Widget

```typescript
// pages/api/embed/widget.js
export default function handler(req, res) {
  const { business, theme, primaryColor } = req.query;

  const widgetCode = generateWidgetCode({
    business,
    theme: theme || "light",
    primaryColor: primaryColor || "#007bff",
  });

  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(widgetCode);
}
```

### 11.3 Configuración del Widget

```typescript
// components/embed/BookingWidget.tsx
interface BookingWidgetProps {
  businessId: string;
  theme: "light" | "dark";
  primaryColor: string;
  compact?: boolean;
  showPrices?: boolean;
  allowMultipleRooms?: boolean;
}
```

---

## 12. Sistema de Notificaciones {#notificaciones}

### 12.1 Tipos de Notificaciones

- **Email**: Confirmaciones, recordatorios, cambios
- **SMS**: Notificaciones urgentes (opcional)
- **Push**: Notificaciones web (service worker)
- **In-App**: Notificaciones del dashboard

### 12.2 Templates de Email

```typescript
// lib/email-templates.ts
export const emailTemplates = {
  bookingConfirmation: {
    subject: "Confirmación de reserva - {{roomName}}",
    template: `
      <h1>¡Reserva confirmada!</h1>
      <p>Hola {{customerName}},</p>
      <p>Tu reserva para {{roomName}} ha sido confirmada.</p>
      <div class="booking-details">
        <p><strong>Fecha:</strong> {{date}}</p>
        <p><strong>Hora:</strong> {{time}}</p>
        <p><strong>Participantes:</strong> {{participants}}</p>
        <p><strong>Total:</strong> ${{ totalPrice }}</p>
      </div>
      <p>Código de confirmación: <strong>{{confirmationCode}}</strong></p>
    `,
  },
  bookingReminder: {
    subject: "Recordatorio: Tu escape room es mañana",
    template: `...`,
  },
  gameMasterAssignment: {
    subject: "Nueva asignación - {{roomName}}",
    template: `...`,
  },
};
```

### 12.3 Automatización

```typescript
// lib/notifications.ts
import { scheduleEmailReminder } from "./email";

export async function scheduleBookingNotifications(booking: Booking) {
  // Recordatorio 24 horas antes
  await scheduleEmailReminder(
    booking.customer.email,
    "bookingReminder",
    booking,
    new Date(booking.date.getTime() - 24 * 60 * 60 * 1000)
  );

  // Recordatorio 2 horas antes
  await scheduleEmailReminder(
    booking.customer.email,
    "bookingReminder",
    booking,
    new Date(booking.date.getTime() - 2 * 60 * 60 * 1000)
  );
}
```

---

## 13. Panel de Administración {#admin-panel}

### 13.1 Dashboard Principal

```typescript
// components/admin/AdminDashboard.tsx
export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Reservas Hoy" value={todayBookings} />
        <StatsCard title="Ingresos Mes" value={monthlyRevenue} />
        <StatsCard title="Ocupación %" value={occupancyRate} />
        <StatsCard title="Clientes Nuevos" value={newCustomers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingsChart />
        <RevenueChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentBookings />
        <TopRooms />
        <GameMasterPerformance />
      </div>
    </div>
  );
}
```

### 13.2 Gestión de Configuración

```typescript
// components/admin/BusinessSettings.tsx
interface BusinessSettings {
  general: {
    name: string;
    email: string;
    phone: string;
    address: string;
    timezone: string;
  };
  booking: {
    advanceBookingDays: number;
    cancellationPolicy: string;
    minimumAdvanceHours: number;
    allowSameDayBooking: boolean;
  };
  payments: {
    requirePayment: boolean;
    depositPercentage: number;
    currency: string;
    paymentMethods: string[];
  };
  notifications: {
    sendConfirmationEmail: boolean;
    sendReminderEmail: boolean;
    reminderHoursBefore: number;
    emailTemplates: EmailTemplates;
  };
  ai: {
    enableAutoAssignment: boolean;
    assignmentCriteria: AssignmentCriteria;
    enableChatbot: boolean;
    chatbotPersonality: string;
  };
}
```

---

## 14. Optimización para Costos {#optimizacion-costos}

### 14.1 Estrategia de Costos Bajos

```typescript
// Costos estimados mensuales para un negocio pequeño:
const monthlyCosts = {
  hosting: {
    vercel: 0, // Plan gratuito hasta cierto límite
    upgradeCost: 20, // Pro plan si es necesario
  },
  database: {
    supabase: 0, // Plan gratuito hasta 2GB
    upgradeCost: 25, // Pro plan
  },
  ai: {
    openai: 10, // $10-50 dependiendo del uso
    claude: 15, // Alternativa
  },
  payments: {
    stripe: "2.9% + $0.30 por transacción",
  },
  email: {
    resend: 0, // 3k emails gratis
    upgradeCost: 20,
  },
  domain: 15, // Anual
  total: "Aproximadamente $50-100/mes",
};
```

### 14.2 Optimizaciones Técnicas

```typescript
// Configuración optimizada para costos
export const optimizedConfig = {
  // Edge computing para reducir latencia sin costos extra
  runtime: "edge",

  // Cacheo agresivo
  caching: {
    staticAssets: "365d",
    apiResponses: "5m",
    businessSettings: "1h",
  },

  // Imágenes optimizadas
  images: {
    loader: "custom",
    formats: ["webp", "avif"],
    quality: 80,
  },

  // Bundle splitting
  bundleAnalyzer: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@/components", "@/lib"],
  },
};
```

### 14.3 Estrategia de Escalado

```typescript
// Plan de escalado por etapas
const scalingPlan = {
  stage1: {
    users: "0-100 reservas/mes",
    costs: "$0-20/mes",
    features: "Core functionality",
  },
  stage2: {
    users: "100-1000 reservas/mes",
    costs: "$50-100/mes",
    features: "IA básica, notificaciones",
  },
  stage3: {
    users: "1000+ reservas/mes",
    costs: "$100-300/mes",
    features: "IA avanzada, analytics, multi-tenant",
  },
};
```

---

## 15. Despliegue y DevOps {#deployment}

### 15.1 Configuración de Despliegue

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 15.2 Variables de Entorno

```bash
# .env.example
# Base URL
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Payments
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Email
RESEND_API_KEY=re_...

# External Services
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...

# App Settings
APP_ENV=production
APP_DEBUG=false
```

### 15.3 Monitoreo y Logging

```typescript
// lib/monitoring.ts
import { Analytics } from "@vercel/analytics";

export const trackEvent = (name: string, properties?: any) => {
  if (process.env.NODE_ENV === "production") {
    Analytics.track(name, properties);
  }
};

// Eventos importantes a trackear
export const events = {
  bookingCreated: "booking_created",
  bookingCancelled: "booking_cancelled",
  userRegistered: "user_registered",
  paymentCompleted: "payment_completed",
  aiQueryMade: "ai_query_made",
};
```

---

## 16. Testing y Calidad {#testing}

### 16.1 Estrategia de Testing

```typescript
// tests/setup.ts
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 16.2 Tests de Componentes

```typescript
// tests/components/BookingCalendar.test.tsx
import { render, screen } from "@testing-library/react";
import { BookingCalendar } from "@/components/booking/BookingCalendar";

describe("BookingCalendar", () => {
  it("should display available time slots", async () => {
    render(
      <BookingCalendar businessId="test-business" onDateSelect={jest.fn()} />
    );

    expect(screen.getByText("Selecciona una fecha")).toBeInTheDocument();
  });
});
```

### 16.3 Tests de API

```typescript
// tests/api/bookings.test.ts
import { createMocks } from "node-mocks-http";
import handler from "@/pages/api/bookings";

describe("/api/bookings", () => {
  it("should create a booking", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        roomId: "room-1",
        date: "2024-07-28",
        startTime: "14:00",
        participants: 4,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
  });
});
```

---

## 17. Mantenimiento y Actualizaciones {#mantenimiento}

### 17.1 Plan de Mantenimiento

```typescript
// Tareas regulares
const maintenanceTasks = {
  daily: [
    "Monitor error rates",
    "Check payment reconciliation",
    "Review AI query logs",
  ],
  weekly: [
    "Update dependencies",
    "Review performance metrics",
    "Backup database",
  ],
  monthly: [
    "Security audit",
    "Cost optimization review",
    "Feature usage analysis",
  ],
};
```

### 17.2 Roadmap de Funcionalidades

```typescript
// Próximas funcionalidades
const roadmap = {
  q1_2024: ["Multi-idioma", "App móvil PWA", "Integración WhatsApp"],
  q2_2024: ["Analytics avanzados", "Programa de lealtad", "Integración POS"],
  q3_2024: [
    "IA predictiva avanzada",
    "Marketplace de escape rooms",
    "API pública",
  ],
};
```

---

## Conclusión

Este sistema de reservas de escape rooms está diseñado para ser moderno, escalable y costo-eficiente. La arquitectura basada en Next.js y Supabase permite un desarrollo rápido y un mantenimiento sencillo, mientras que las funcionalidades de IA proporcionan un valor diferencial significativo.

La implementación por fases permite comenzar con un MVP funcional y ir agregando características avanzadas según el crecimiento del negocio, manteniendo siempre un enfoque en la optimización de costos y la experiencia del usuario.

El sistema está diseñado para manejar múltiples empresas de escape rooms desde una sola instancia, lo que permite monetizar la solución como SaaS en el futuro si se desea.
