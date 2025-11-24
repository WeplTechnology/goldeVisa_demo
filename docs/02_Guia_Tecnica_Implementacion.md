# GUÍA TÉCNICA DE IMPLEMENTACIÓN
# PLATAFORMA GOLDEN VISA - STAG FUND MANAGEMENT

**Proyecto:** Sistema de Gestión de Inversores Golden Visa Italia  
**Stack:** Next.js 14 + Supabase + TypeScript  
**Versión:** 1.0  
**Fecha:** Noviembre 2024

---

## 1. SETUP INICIAL DEL PROYECTO

### 1.1 Prerrequisitos

```bash
# Versiones requeridas
Node.js >= 18.17.0
npm >= 9.0.0
Git >= 2.30.0

# Verificar instalación
node --version
npm --version
git --version
```

### 1.2 Crear Proyecto Next.js

```bash
# Crear proyecto con TypeScript y App Router
npx create-next-app@latest golden-visa-platform --typescript --tailwind --app --no-src-dir

cd golden-visa-platform

# Estructura inicial
golden-visa-platform/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

### 1.3 Instalar Dependencias Principales

```bash
# Supabase client
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Shadcn/ui (CLI)
npx shadcn-ui@latest init

# Responder en el wizard:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - React Server Components: Yes
# - components directory: @/components
# - utils directory: @/lib/utils
# - Tailwind config: tailwind.config.ts
# - CSS file: app/globals.css

# Instalar componentes de Shadcn/ui necesarios
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add textarea

# Iconos Lucide
npm install lucide-react

# Gráficos Recharts
npm install recharts

# Internacionalización
npm install i18next react-i18next i18next-browser-languagedetector

# State management
npm install @tanstack/react-query

# Utilidades
npm install date-fns clsx class-variance-authority
npm install -D @types/node
```

### 1.4 Variables de Entorno

Crear archivo `.env.local` en la raíz:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Features (demo)
NEXT_PUBLIC_ENABLE_KYC_AUTO=false
NEXT_PUBLIC_ENABLE_WHATSAPP=false
NEXT_PUBLIC_ENABLE_2FA=false

# i18n
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

**IMPORTANTE:** Agregar `.env.local` al `.gitignore`

---

## 2. CONFIGURACIÓN DE SUPABASE

### 2.1 Crear Proyecto en Supabase

1. Ir a https://supabase.com
2. Crear nueva organización (si no existe)
3. Crear nuevo proyecto:
   - Nombre: golden-visa-stag-demo
   - Database Password: (guardar en lugar seguro)
   - Region: Europe West (Ireland)
   - Plan: Free tier (suficiente para demo)

4. Obtener credenciales:
   - Settings → API
   - Copiar Project URL y anon public key

### 2.2 Configurar Autenticación

En el dashboard de Supabase:

1. Authentication → Settings
2. Site URL: `http://localhost:3000`
3. Redirect URLs: 
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/admin/auth/callback
   ```
4. Email Auth: Enabled
5. Confirm email: Disabled (para demo)

### 2.3 Ejecutar Migraciones SQL

En el dashboard de Supabase → SQL Editor, ejecutar los siguientes scripts:

**Script 1: Extensions y Schema Base**

```sql
-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de fondos
CREATE TABLE funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  country_target VARCHAR(100),
  total_capital_target DECIMAL(15,2),
  total_capital_raised DECIMAL(15,2) DEFAULT 0,
  real_estate_percentage INTEGER DEFAULT 85,
  rd_percentage INTEGER DEFAULT 15,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de inversores
CREATE TABLE investors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID REFERENCES funds(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  nationality VARCHAR(100),
  passport_number VARCHAR(100),
  date_of_birth DATE,
  investment_amount DECIMAL(15,2) NOT NULL,
  real_estate_amount DECIMAL(15,2),
  rd_amount DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'onboarding',
  kyc_status VARCHAR(50) DEFAULT 'pending',
  golden_visa_status VARCHAR(50) DEFAULT 'not_started',
  onboarding_date DATE,
  visa_start_date DATE,
  visa_expected_completion DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de propiedades
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID REFERENCES funds(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Italy',
  postal_code VARCHAR(20),
  total_size_sqm DECIMAL(10,2),
  total_units INTEGER,
  acquisition_date DATE,
  acquisition_price DECIMAL(15,2),
  current_value DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'active',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de unidades de propiedad
CREATE TABLE property_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  assigned_investor_id UUID REFERENCES investors(id) ON DELETE SET NULL,
  unit_number VARCHAR(50) NOT NULL,
  floor INTEGER,
  size_sqm DECIMAL(10,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  rental_status VARCHAR(50) DEFAULT 'available',
  monthly_rent DECIMAL(10,2),
  current_tenant_name VARCHAR(255),
  current_tenant_email VARCHAR(255),
  lease_start_date DATE,
  lease_end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de documentos
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de hitos Golden Visa
CREATE TABLE golden_visa_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  milestone_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  due_date DATE,
  completed_date DATE,
  order_number INTEGER,
  documents_required JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reportes
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  period VARCHAR(50),
  type VARCHAR(100),
  title VARCHAR(255),
  data_json JSONB,
  pdf_url TEXT,
  generated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de mensajes
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  from_admin BOOLEAN DEFAULT FALSE,
  from_user_id UUID REFERENCES auth.users(id),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_date TIMESTAMP WITH TIME ZONE,
  parent_message_id UUID REFERENCES messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX idx_investors_fund ON investors(fund_id);
CREATE INDEX idx_investors_user ON investors(user_id);
CREATE INDEX idx_investors_status ON investors(status);
CREATE INDEX idx_properties_fund ON properties(fund_id);
CREATE INDEX idx_property_units_property ON property_units(property_id);
CREATE INDEX idx_property_units_investor ON property_units(assigned_investor_id);
CREATE INDEX idx_documents_investor ON documents(investor_id);
CREATE INDEX idx_milestones_investor ON golden_visa_milestones(investor_id);
CREATE INDEX idx_reports_investor ON reports(investor_id);
CREATE INDEX idx_messages_investor ON messages(investor_id);
```

**Script 2: Row Level Security (RLS)**

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE golden_visa_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas para INVESTORS (los inversores solo ven sus propios datos)

-- Investors: SELECT
CREATE POLICY "Investors can view own data"
ON investors FOR SELECT
USING (auth.uid() = user_id);

-- Investors: UPDATE own profile
CREATE POLICY "Investors can update own profile"
ON investors FOR UPDATE
USING (auth.uid() = user_id);

-- Property Units: SELECT (solo las asignadas a ellos)
CREATE POLICY "Investors can view assigned units"
ON property_units FOR SELECT
USING (
  assigned_investor_id IN (
    SELECT id FROM investors WHERE user_id = auth.uid()
  )
);

-- Documents: SELECT (solo sus propios documentos)
CREATE POLICY "Investors can view own documents"
ON documents FOR SELECT
USING (
  investor_id IN (
    SELECT id FROM investors WHERE user_id = auth.uid()
  )
);

-- Documents: INSERT (pueden subir sus documentos)
CREATE POLICY "Investors can upload documents"
ON documents FOR INSERT
WITH CHECK (
  investor_id IN (
    SELECT id FROM investors WHERE user_id = auth.uid()
  )
);

-- Golden Visa Milestones: SELECT
CREATE POLICY "Investors can view own milestones"
ON golden_visa_milestones FOR SELECT
USING (
  investor_id IN (
    SELECT id FROM investors WHERE user_id = auth.uid()
  )
);

-- Reports: SELECT
CREATE POLICY "Investors can view own reports"
ON reports FOR SELECT
USING (
  investor_id IN (
    SELECT id FROM investors WHERE user_id = auth.uid()
  )
);

-- Messages: SELECT
CREATE POLICY "Investors can view own messages"
ON messages FOR SELECT
USING (
  investor_id IN (
    SELECT id FROM investors WHERE user_id = auth.uid()
  )
);

-- Messages: INSERT (pueden enviar mensajes)
CREATE POLICY "Investors can send messages"
ON messages FOR INSERT
WITH CHECK (
  investor_id IN (
    SELECT id FROM investors WHERE user_id = auth.uid()
  )
);

-- Políticas para ADMINS (pueden ver todo)
-- Nota: En producción, se implementaría un sistema de roles más robusto
-- Para la demo, asumimos que ciertos emails son admins

-- Función helper para verificar si es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email 
    FROM auth.users 
    WHERE id = auth.uid()
  ) LIKE '%@stagfund.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admins: SELECT ALL en todas las tablas
CREATE POLICY "Admins can view all funds"
ON funds FOR ALL
USING (is_admin());

CREATE POLICY "Admins can view all investors"
ON investors FOR ALL
USING (is_admin());

CREATE POLICY "Admins can view all properties"
ON properties FOR ALL
USING (is_admin());

CREATE POLICY "Admins can view all property_units"
ON property_units FOR ALL
USING (is_admin());

CREATE POLICY "Admins can view all documents"
ON documents FOR ALL
USING (is_admin());

CREATE POLICY "Admins can view all milestones"
ON golden_visa_milestones FOR ALL
USING (is_admin());

CREATE POLICY "Admins can view all reports"
ON reports FOR ALL
USING (is_admin());

CREATE POLICY "Admins can view all messages"
ON messages FOR ALL
USING (is_admin());
```

**Script 3: Triggers para updated_at**

```sql
-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_funds_updated_at
BEFORE UPDATE ON funds
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investors_updated_at
BEFORE UPDATE ON investors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_units_updated_at
BEFORE UPDATE ON property_units
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at
BEFORE UPDATE ON golden_visa_milestones
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2.4 Configurar Storage para Documentos

En el dashboard de Supabase → Storage:

1. Crear bucket `documents`
2. Hacer el bucket privado (no público)
3. Configurar políticas:

```sql
-- Policy para que inversores suban sus documentos
CREATE POLICY "Investors can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM investors WHERE user_id = auth.uid()
  )
);

-- Policy para que inversores vean sus documentos
CREATE POLICY "Investors can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM investors WHERE user_id = auth.uid()
  )
);

-- Policy para que admins vean todos los documentos
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND is_admin());

-- Policy para que admins suban documentos
CREATE POLICY "Admins can upload all documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND is_admin());
```

---

## 3. ESTRUCTURA DEL PROYECTO

### 3.1 Organización de Carpetas

```
golden-visa-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts
│   ├── (investor)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── my-investment/
│   │   │   └── page.tsx
│   │   ├── golden-visa/
│   │   │   └── page.tsx
│   │   ├── properties/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── documents/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   ├── messages/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── investors/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── properties/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── funds/
│   │   │   └── page.tsx
│   │   ├── documents/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── analytics/
│   │       └── page.tsx
│   ├── api/
│   │   ├── documents/
│   │   │   └── upload/
│   │   │       └── route.ts
│   │   └── reports/
│   │       └── generate/
│   │           └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # Componentes de Shadcn/ui
│   ├── investor/
│   │   ├── dashboard/
│   │   │   ├── KPICard.tsx
│   │   │   ├── InvestmentSummary.tsx
│   │   │   └── NextActions.tsx
│   │   ├── golden-visa/
│   │   │   ├── Timeline.tsx
│   │   │   ├── MilestoneCard.tsx
│   │   │   └── ProgressTracker.tsx
│   │   └── properties/
│   │       ├── PropertyCard.tsx
│   │       ├── PropertyDetail.tsx
│   │       └── PropertyMap.tsx
│   ├── admin/
│   │   ├── dashboard/
│   │   │   ├── GlobalMetrics.tsx
│   │   │   └── ActivityFeed.tsx
│   │   └── investors/
│   │       ├── InvestorTable.tsx
│   │       └── InvestorDetail.tsx
│   ├── shared/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── NotificationCenter.tsx
│   └── layout/
│       ├── InvestorLayout.tsx
│       └── AdminLayout.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Cliente de Supabase (browser)
│   │   ├── server.ts          # Cliente de Supabase (server)
│   │   └── middleware.ts      # Middleware de auth
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useInvestor.ts
│   │   └── useProperties.ts
│   ├── types/
│   │   ├── database.ts        # Tipos generados de Supabase
│   │   ├── investor.ts
│   │   └── property.ts
│   └── utils/
│       ├── formatting.ts
│       ├── calculations.ts
│       └── validators.ts
├── locales/
│   ├── en/
│   │   ├── common.json
│   │   ├── investor.json
│   │   └── admin.json
│   ├── es/
│   ├── it/
│   ├── pt/
│   └── zh/
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   └── properties/
│   └── icons/
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. IMPLEMENTACIÓN DEL CLIENTE SUPABASE

### 4.1 Cliente Browser (`lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/types/database'

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

### 4.2 Cliente Server (`lib/supabase/server.ts`)

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/types/database'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Servidor de edge no puede set cookies
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Servidor de edge no puede set cookies
          }
        },
      },
    }
  )
}
```

### 4.3 Middleware de Autenticación (`middleware.ts`)

Crear en la raíz del proyecto:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Proteger rutas de inversor
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Proteger rutas de admin
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Verificar que admins solo accedan a /admin
  if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: investor } = await supabase
      .from('investors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!investor) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/my-investment/:path*',
    '/golden-visa/:path*',
    '/properties/:path*',
    '/documents/:path*',
    '/reports/:path*',
    '/messages/:path*',
    '/settings/:path*',
  ],
}
```

---

## 5. CONFIGURACIÓN DE INTERNACIONALIZACIÓN (i18n)

### 5.1 Configuración de i18next (`lib/i18n/config.ts`)

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Importar traducciones
import enCommon from '@/locales/en/common.json'
import enInvestor from '@/locales/en/investor.json'
import enAdmin from '@/locales/en/admin.json'

import esCommon from '@/locales/es/common.json'
import esInvestor from '@/locales/es/investor.json'
import esAdmin from '@/locales/es/admin.json'

// ... importar para it, pt, zh

const resources = {
  en: {
    common: enCommon,
    investor: enInvestor,
    admin: enAdmin,
  },
  es: {
    common: esCommon,
    investor: esInvestor,
    admin: esAdmin,
  },
  // ... it, pt, zh
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
```

### 5.2 Estructura de Archivos de Traducción

**`locales/en/common.json`:**

```json
{
  "app": {
    "title": "STAG Golden Visa Platform",
    "tagline": "Your path to Italian citizenship"
  },
  "nav": {
    "dashboard": "Dashboard",
    "myInvestment": "My Investment",
    "goldenVisa": "Golden Visa",
    "properties": "Properties",
    "documents": "Documents",
    "reports": "Reports",
    "messages": "Messages",
    "settings": "Settings",
    "logout": "Logout"
  },
  "auth": {
    "login": "Login",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Forgot password?",
    "dontHaveAccount": "Don't have an account?",
    "signUp": "Sign up"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "view": "View",
    "download": "Download",
    "upload": "Upload"
  },
  "status": {
    "active": "Active",
    "pending": "Pending",
    "completed": "Completed",
    "cancelled": "Cancelled"
  }
}
```

**`locales/en/investor.json`:**

```json
{
  "dashboard": {
    "welcome": "Welcome, {{name}}",
    "investorSince": "Investor since {{date}}",
    "myInvestment": "My Investment",
    "totalCapital": "Total Capital",
    "realEstate": "Real Estate",
    "rdInnovation": "R&D / Innovation",
    "annualROI": "Annual ROI",
    "goldenVisaProgress": "Golden Visa Progress",
    "year": "Year {{current}} of {{total}}",
    "propertiesSummary": "Properties Summary",
    "units": "units in Milano",
    "monthlyRent": "Monthly rent",
    "occupancy": "Occupancy",
    "nextActions": "Next Actions",
    "renewContract": "Renew contract",
    "uploadDeclaration": "Upload Q4 declaration"
  },
  "goldenVisa": {
    "title": "Your Path to Italian Citizenship",
    "timeElapsed": "Time elapsed",
    "timeRemaining": "Time remaining",
    "year": "year",
    "years": "years",
    "month": "month",
    "months": "months",
    "milestones": {
      "investment": "Investment Made",
      "companyIncorporation": "Company Incorporated",
      "propertyAssignment": "Assets Assigned",
      "rentalPeriod": "Rental Period",
      "residencyApplication": "Residency Application",
      "citizenship": "Italian Citizenship"
    },
    "status": {
      "completed": "Completed",
      "inProgress": "In Progress",
      "pending": "Pending",
      "overdue": "Overdue"
    }
  }
}
```

### 5.3 Hook de Traducción (`lib/hooks/useTranslation.ts`)

```typescript
import { useTranslation as useI18nextTranslation } from 'react-i18next'

export const useTranslation = (namespace?: string | string[]) => {
  const { t, i18n } = useI18nextTranslation(namespace)

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language,
  }
}
```

### 5.4 Selector de Idioma (`components/shared/LanguageSelector.tsx`)

```typescript
'use client'

import { useTranslation } from '@/lib/hooks/useTranslation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
]

export function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useTranslation()

  return (
    <Select value={currentLanguage} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[180px]">
        <Globe className="mr-2 h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

---

## 6. COMPONENTES PRINCIPALES

### 6.1 Layout de Inversor (`components/layout/InvestorLayout.tsx`)

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/hooks/useTranslation'
import {
  Home,
  TrendingUp,
  Building2,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from '@/components/shared/LanguageSelector'
import { NotificationCenter } from '@/components/shared/NotificationCenter'

const navigation = [
  { name: 'dashboard', href: '/dashboard', icon: Home },
  { name: 'myInvestment', href: '/my-investment', icon: TrendingUp },
  { name: 'goldenVisa', href: '/golden-visa', icon: TrendingUp },
  { name: 'properties', href: '/properties', icon: Building2 },
  { name: 'documents', href: '/documents', icon: FileText },
  { name: 'reports', href: '/reports', icon: FileText },
  { name: 'messages', href: '/messages', icon: MessageSquare },
  { name: 'settings', href: '/settings', icon: Settings },
]

export function InvestorLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useTranslation('common')

  const handleLogout = async () => {
    // Implementar logout
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-primary-navy text-white">
        <div className="flex items-center justify-center h-16 border-b border-primary-blue">
          <h1 className="text-xl font-bold">STAG</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-blue text-white'
                    : 'text-gray-300 hover:bg-primary-blue/50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {t(`nav.${item.name}`)}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-primary-blue">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-primary-blue/50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            {t('nav.logout')}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
          
          <div className="flex-1" />
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <NotificationCenter />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-primary-navy text-white">
            {/* Same content as desktop sidebar */}
          </aside>
        </div>
      )}
    </div>
  )
}
```

### 6.2 Dashboard Card Component (`components/investor/dashboard/KPICard.tsx`)

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function KPICard({ title, value, subtitle, icon: Icon, trend }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className={`text-xs mt-2 ${trend.isPositive ? 'text-success' : 'text-error'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

### 6.3 Golden Visa Timeline (`components/investor/golden-visa/Timeline.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Check, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from '@/lib/hooks/useTranslation'

interface Milestone {
  id: string
  type: string
  title: string
  description: string
  status: 'completed' | 'in_progress' | 'pending' | 'overdue'
  dueDate?: string
  completedDate?: string
  orderNumber: number
  documentsRequired?: string[]
}

interface TimelineProps {
  milestones: Milestone[]
  totalDuration: number
  elapsedTime: number
}

export function Timeline({ milestones, totalDuration, elapsedTime }: TimelineProps) {
  const { t } = useTranslation('investor')
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null)

  const progress = (elapsedTime / totalDuration) * 100

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-6 h-6 text-success" />
      case 'in_progress':
        return <Clock className="w-6 h-6 text-primary-blue" />
      case 'overdue':
        return <AlertCircle className="w-6 h-6 text-error" />
      default:
        return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success'
      case 'in_progress':
        return 'bg-primary-blue'
      case 'overdue':
        return 'bg-error'
      default:
        return 'bg-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t('goldenVisa.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{t('goldenVisa.timeElapsed')}: {elapsedTime} {t('goldenVisa.months')}</span>
            <span>{t('goldenVisa.timeRemaining')}: {totalDuration - elapsedTime} {t('goldenVisa.months')}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {milestones
            .sort((a, b) => a.orderNumber - b.orderNumber)
            .map((milestone, index) => {
              const isExpanded = expandedMilestone === milestone.id
              const isLast = index === milestones.length - 1

              return (
                <div key={milestone.id} className="relative pl-20">
                  {/* Icon */}
                  <div className="absolute left-5 top-0 flex items-center justify-center w-12 h-12 rounded-full bg-white border-4 border-background">
                    {getStatusIcon(milestone.status)}
                  </div>

                  {/* Content */}
                  <Card
                    className={`cursor-pointer transition-shadow hover:shadow-md ${
                      milestone.status === 'in_progress' ? 'border-primary-blue border-2' : ''
                    }`}
                    onClick={() =>
                      setExpandedMilestone(isExpanded ? null : milestone.id)
                    }
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge
                              variant={milestone.status === 'completed' ? 'default' : 'secondary'}
                              className={getStatusColor(milestone.status)}
                            >
                              {t(`goldenVisa.status.${milestone.status}`)}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{milestone.title}</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon">
                          {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{milestone.description}</p>

                        {milestone.completedDate && (
                          <div className="text-sm">
                            <span className="font-medium">Completed:</span>{' '}
                            {new Date(milestone.completedDate).toLocaleDateString()}
                          </div>
                        )}

                        {milestone.dueDate && !milestone.completedDate && (
                          <div className="text-sm">
                            <span className="font-medium">Due date:</span>{' '}
                            {new Date(milestone.dueDate).toLocaleDateString()}
                          </div>
                        )}

                        {milestone.documentsRequired && milestone.documentsRequired.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Required documents:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {milestone.documentsRequired.map((doc, i) => (
                                <li key={i}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
```

---

## 7. SEED DE DATOS MOCKUP

### 7.1 Script de Seed (`scripts/seed.sql`)

```sql
-- IMPORTANTE: Ejecutar este script en el SQL Editor de Supabase
-- después de haber ejecutado las migraciones principales

-- Limpiar datos existentes (opcional, solo para demo)
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE reports CASCADE;
TRUNCATE TABLE golden_visa_milestones CASCADE;
TRUNCATE TABLE documents CASCADE;
TRUNCATE TABLE property_units CASCADE;
TRUNCATE TABLE properties CASCADE;
TRUNCATE TABLE investors CASCADE;
TRUNCATE TABLE funds CASCADE;

-- Insertar fondo
INSERT INTO funds (id, name, description, country_target, total_capital_target, total_capital_raised, status, created_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'Italia - China I',
  'Fondo de inversión Golden Visa para inversores chinos',
  'China',
  2000000.00,
  1750000.00,
  'active',
  '2024-10-01'
);

-- Insertar inversores (Nota: user_id debe coincidir con usuarios reales de Supabase Auth)
-- Primero crear usuarios en Auth UI, luego actualizar estos IDs

INSERT INTO investors (id, fund_id, user_id, full_name, email, nationality, investment_amount, real_estate_amount, rd_amount, status, kyc_status, golden_visa_status, onboarding_date, visa_start_date, visa_expected_completion)
VALUES
(
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  NULL, -- Actualizar con user_id real
  'Zhang Wei',
  'zhang.wei@email.com',
  'China',
  250000.00,
  212500.00,
  37500.00,
  'active',
  'approved',
  'in_progress',
  '2024-11-15',
  '2024-12-20',
  '2029-11-15'
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  NULL,
  'Li Ming',
  'li.ming@email.com',
  'China',
  250000.00,
  212500.00,
  37500.00,
  'active',
  'approved',
  'in_progress',
  '2024-11-10',
  '2024-12-15',
  '2029-11-10'
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440001',
  NULL,
  'Wang Fang',
  'wang.fang@email.com',
  'China',
  250000.00,
  212500.00,
  37500.00,
  'onboarding',
  'in_review',
  'not_started',
  '2024-11-20',
  NULL,
  NULL
);

-- Insertar propiedades
INSERT INTO properties (id, fund_id, name, address, city, total_size_sqm, total_units, acquisition_date, acquisition_price, current_value, latitude, longitude)
VALUES
(
  '770e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'Via Garibaldi 23',
  'Via Garibaldi 23, 20121 Milano, Italia',
  'Milano',
  300.00,
  12,
  '2024-12-01',
  1200000.00,
  1320000.00,
  45.4654219,
  9.1859243
),
(
  '770e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  'Corso Buenos Aires 45',
  'Corso Buenos Aires 45, 20124 Milano, Italia',
  'Milano',
  350.00,
  15,
  '2024-12-05',
  1500000.00,
  1650000.00,
  45.4773543,
  9.2051436
);

-- Insertar unidades de propiedad
INSERT INTO property_units (id, property_id, assigned_investor_id, unit_number, floor, size_sqm, bedrooms, bathrooms, rental_status, monthly_rent, current_tenant_name, current_tenant_email, lease_start_date, lease_end_date)
VALUES
-- Via Garibaldi 23 - Unidades para Zhang Wei
(
  '880e8400-e29b-41d4-a716-446655440001',
  '770e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  '4B',
  4,
  22.00,
  1,
  1,
  'rented',
  850.00,
  'Marco Rossi',
  'marco.rossi@email.it',
  '2024-12-20',
  '2025-12-19'
),
(
  '880e8400-e29b-41d4-a716-446655440002',
  '770e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  '4C',
  4,
  23.00,
  1,
  1,
  'rented',
  870.00,
  'Sofia Bianchi',
  'sofia.bianchi@email.it',
  '2024-12-20',
  '2025-12-19'
);

-- Insertar hitos Golden Visa para Zhang Wei
INSERT INTO golden_visa_milestones (investor_id, milestone_type, title, description, status, due_date, completed_date, order_number)
VALUES
(
  '660e8400-e29b-41d4-a716-446655440001',
  'investment',
  'Investment Made',
  'Capital of €250,000 transferred and verified',
  'completed',
  '2024-11-15',
  '2024-11-15',
  1
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  'company_incorporation',
  'Company Incorporated',
  'Zhang Wei SRL registered in Italy',
  'completed',
  '2024-12-02',
  '2024-12-02',
  2
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  'property_assignment',
  'Assets Assigned',
  'Units 4B and 4C assigned',
  'completed',
  '2024-12-15',
  '2024-12-15',
  3
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  'rental_year_1',
  'Rental Period - Year 1 of 5',
  'Maintaining investment and generating returns',
  'in_progress',
  '2025-12-20',
  NULL,
  4
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  'residency_application',
  'Residency Application',
  'Formal application for Italian residency',
  'pending',
  '2025-06-15',
  NULL,
  5
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  'citizenship',
  'Italian Citizenship',
  'Obtaining Italian citizenship',
  'pending',
  '2029-11-15',
  NULL,
  8
);

-- Verificar datos insertados
SELECT 'Funds' as table_name, COUNT(*) as count FROM funds
UNION ALL
SELECT 'Investors', COUNT(*) FROM investors
UNION ALL
SELECT 'Properties', COUNT(*) FROM properties
UNION ALL
SELECT 'Property Units', COUNT(*) FROM property_units
UNION ALL
SELECT 'Golden Visa Milestones', COUNT(*) FROM golden_visa_milestones;
```

### 7.2 Crear Usuarios de Prueba

En Supabase Dashboard → Authentication → Users:

1. Crear usuario inversor:
   - Email: `zhang.wei@email.com`
   - Password: `Demo2024!`
   - Guardar el `id` generado

2. Crear usuario admin:
   - Email: `admin@stagfund.com`
   - Password: `Admin2024!`

3. Actualizar la tabla `investors` con el `user_id` correcto:

```sql
UPDATE investors 
SET user_id = 'USER_ID_DE_ZHANG_WEI'
WHERE email = 'zhang.wei@email.com';
```

---

## 8. TESTING Y DEPLOYMENT

### 8.1 Comandos de Desarrollo

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Iniciar producción local
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

### 8.2 Deployment en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy a preview
vercel

# Deploy a production
vercel --prod
```

### 8.3 Variables de Entorno en Vercel

En Vercel Dashboard → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## 9. TROUBLESHOOTING COMÚN

### 9.1 Errores de Autenticación

**Problema:** "Auth session missing"

**Solución:**
- Verificar que las cookies están habilitadas
- Revisar middleware.ts
- Verificar que las redirect URLs están configuradas en Supabase

### 9.2 Errores de RLS

**Problema:** "Row Level Security policy violation"

**Solución:**
```sql
-- Verificar policies
SELECT * FROM pg_policies WHERE tablename = 'investors';

-- Verificar que el usuario tiene user_id correcto
SELECT * FROM investors WHERE email = 'tu_email@example.com';
```

### 9.3 Errores de i18n

**Problema:** Traducciones no se cargan

**Solución:**
- Verificar que los archivos JSON están en `/locales`
- Verificar importaciones en `lib/i18n/config.ts`
- Revisar namespace en el componente

### 9.4 Errores de Build

**Problema:** "Module not found"

**Solución:**
```bash
# Limpiar cache y reinstalar
rm -rf .next node_modules
npm install
npm run dev
```

---

## 10. PRÓXIMOS PASOS

### 10.1 Checklist de Implementación

```
SETUP
☐ Crear proyecto Next.js
☐ Instalar dependencias
☐ Configurar Supabase
☐ Ejecutar migraciones SQL
☐ Configurar Storage
☐ Ejecutar seed de datos
☐ Configurar variables de entorno

AUTENTICACIÓN
☐ Implementar cliente Supabase
☐ Crear middleware
☐ Crear páginas de login
☐ Implementar logout

INTERNACIONALIZACIÓN
☐ Configurar i18next
☐ Crear archivos de traducción
☐ Implementar selector de idioma
☐ Traducir todos los textos

PORTAL INVERSOR
☐ Layout base
☐ Dashboard
☐ Golden Visa Roadmap
☐ Propiedades
☐ Documentos
☐ Reportes
☐ Mensajes
☐ Configuración

BACKOFFICE ADMIN
☐ Layout base
☐ Dashboard global
☐ Gestión de inversores
☐ Gestión de propiedades
☐ Gestión de documentos
☐ Generación de reportes
☐ Analytics

TESTING
☐ Testing manual completo
☐ Testing cross-browser
☐ Testing responsive
☐ Testing i18n

DEPLOYMENT
☐ Deploy a Vercel staging
☐ Testing en staging
☐ Deploy a producción
```

### 10.2 Recursos Adicionales

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Shadcn/ui:** https://ui.shadcn.com
- **TypeScript:** https://www.typescriptlang.org/docs

---

**FIN DE LA GUÍA TÉCNICA**

¿Dudas? Contactar con el equipo de WepL Technology.
