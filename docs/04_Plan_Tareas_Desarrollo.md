# PLAN DE TAREAS DE DESARROLLO
# PLATAFORMA GOLDEN VISA - STAG FUND MANAGEMENT

**Proyecto:** Sistema de Gestión de Inversores Golden Visa Italia  
**Tipo:** Guía paso a paso para agente de desarrollo  
**Duración estimada:** 8 semanas  
**Fecha:** Noviembre 2024

---

## 📋 ÍNDICE DE FASES

1. [FASE 0: Setup y Configuración Inicial](#fase-0-setup-y-configuración-inicial)
2. [FASE 1: Base de Datos y Backend](#fase-1-base-de-datos-y-backend)
3. [FASE 2: Autenticación y Middleware](#fase-2-autenticación-y-middleware)
4. [FASE 3: Design System y Componentes Base](#fase-3-design-system-y-componentes-base)
5. [FASE 4: Portal del Inversor - Core](#fase-4-portal-del-inversor---core)
6. [FASE 5: Portal del Inversor - Features Avanzados](#fase-5-portal-del-inversor---features-avanzados)
7. [FASE 6: Backoffice Admin](#fase-6-backoffice-admin)
8. [FASE 7: Internacionalización y Polish](#fase-7-internacionalización-y-polish)
9. [FASE 8: Testing y Deployment](#fase-8-testing-y-deployment)

---

## INSTRUCCIONES PARA EL AGENTE

### Cómo usar este documento

1. **Sigue el orden secuencial**: Cada fase debe completarse antes de pasar a la siguiente
2. **Verifica cada tarea**: Marca ✅ cuando completes cada subtarea
3. **Prueba después de cada fase**: Ejecuta `npm run dev` y verifica que todo funciona
4. **Commit frecuente**: Haz commit después de cada tarea completada
5. **Lee los documentos de referencia**: Consulta los otros documentos cuando se mencionen

### Criterios de aceptación

Cada tarea tiene criterios específicos de aceptación. Una tarea solo está completa cuando:
- ✅ El código compila sin errores
- ✅ Los tests pasan (si aplica)
- ✅ La funcionalidad se puede probar visualmente
- ✅ Se hace commit del código

### Comandos útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Build de producción
npm run lint             # Verificar linting
npm run type-check       # Verificar TypeScript

# Supabase
npx supabase start       # Iniciar Supabase local (opcional)
npx supabase status      # Ver estado
```

---

## FASE 0: Setup y Configuración Inicial
**Duración:** 1 día  
**Objetivo:** Tener el proyecto base configurado y listo para desarrollo

### TAREA 0.1: Crear proyecto Next.js

```bash
# Ejecutar este comando
npx create-next-app@latest golden-visa-platform \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd golden-visa-platform
```

**Criterios de aceptación:**
- ✅ Proyecto creado con TypeScript
- ✅ Tailwind CSS configurado
- ✅ App Router habilitado
- ✅ Servidor de desarrollo funciona en http://localhost:3000

---

### TAREA 0.2: Instalar dependencias principales

```bash
# Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Shadcn/ui CLI
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

# Iconos y gráficos
npm install lucide-react recharts

# Internacionalización
npm install i18next react-i18next i18next-browser-languagedetector

# State management
npm install @tanstack/react-query

# Utilidades
npm install date-fns clsx class-variance-authority

# Dev dependencies
npm install -D @types/node
```

**Criterios de aceptación:**
- ✅ Todas las dependencias instaladas sin errores
- ✅ `package.json` actualizado
- ✅ `node_modules` creado

---

### TAREA 0.3: Configurar variables de entorno

**Paso 1:** Crear archivo `.env.local` en la raíz:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_ENABLE_KYC_AUTO=false
NEXT_PUBLIC_ENABLE_WHATSAPP=false
NEXT_PUBLIC_ENABLE_2FA=false

NEXT_PUBLIC_DEFAULT_LOCALE=en
```

**Paso 2:** Agregar `.env.local` a `.gitignore`:

```bash
# En .gitignore, verificar que existe:
.env*.local
```

**Paso 3:** Crear `.env.example` para referencia:

```bash
# Copiar .env.local a .env.example y vaciar los valores
cp .env.local .env.example
# Luego editar .env.example y dejar valores vacíos
```

**Criterios de aceptación:**
- ✅ Archivo `.env.local` creado
- ✅ Archivo `.env.example` creado
- ✅ `.gitignore` incluye `.env*.local`

---

### TAREA 0.4: Configurar colores STAG en Tailwind

**Paso 1:** Editar `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          navy: "#1B365D",
          blue: "#6B9BD1",
          light: "#E8F0F9",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "#28A745",
        warning: "#FFC107",
        error: "#DC3545",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

**Paso 2:** Editar `app/globals.css` para agregar variables STAG:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
}
```

**Criterios de aceptación:**
- ✅ Colores STAG agregados a Tailwind config
- ✅ Variables CSS actualizadas
- ✅ Servidor de desarrollo muestra los estilos correctamente

---

### TAREA 0.5: Crear estructura de carpetas

```bash
# Crear estructura de carpetas
mkdir -p app/{auth,\(investor\),admin,api}
mkdir -p components/{ui,investor,admin,shared,layout}
mkdir -p lib/{supabase,hooks,types,utils}
mkdir -p locales/{en,es,it,pt,zh}
mkdir -p public/{images,icons}
```

**Estructura esperada:**

```
golden-visa-platform/
├── app/
│   ├── auth/
│   ├── (investor)/
│   ├── admin/
│   └── api/
├── components/
│   ├── ui/
│   ├── investor/
│   ├── admin/
│   ├── shared/
│   └── layout/
├── lib/
│   ├── supabase/
│   ├── hooks/
│   ├── types/
│   └── utils/
├── locales/
│   ├── en/
│   ├── es/
│   ├── it/
│   ├── pt/
│   └── zh/
└── public/
    ├── images/
    └── icons/
```

**Criterios de aceptación:**
- ✅ Todas las carpetas creadas
- ✅ Estructura visible en el explorador de archivos

---

### TAREA 0.6: Instalar componentes Shadcn/ui necesarios

```bash
# Instalar todos los componentes necesarios
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
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
```

**Criterios de aceptación:**
- ✅ Todos los componentes en `components/ui/`
- ✅ No hay errores de importación
- ✅ Los componentes se pueden importar correctamente

---

### TAREA 0.7: Commit inicial

```bash
git add .
git commit -m "chore: initial project setup with Next.js, Tailwind, Shadcn/ui and dependencies"
```

**Criterios de aceptación:**
- ✅ Commit realizado exitosamente
- ✅ Todos los archivos rastreados por Git

---

## FASE 1: Base de Datos y Backend
**Duración:** 2-3 días  
**Objetivo:** Configurar Supabase con schema completo y datos de prueba

### TAREA 1.1: Crear proyecto en Supabase

**Paso 1:** Ir a https://supabase.com y crear cuenta (si no existe)

**Paso 2:** Crear nueva organización (o usar existente)

**Paso 3:** Crear nuevo proyecto:
- Nombre: `golden-visa-stag-demo`
- Database Password: (generar password fuerte y guardarlo)
- Region: `Europe West (Ireland)`
- Plan: `Free tier`

**Paso 4:** Esperar a que el proyecto termine de crear (~2 minutos)

**Paso 5:** Obtener credenciales:
- Ir a Settings → API
- Copiar `Project URL` y `anon public` key
- Ir a Settings → Database → Connection string
- Copiar connection string

**Paso 6:** Actualizar `.env.local` con las credenciales:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Criterios de aceptación:**
- ✅ Proyecto Supabase creado
- ✅ Credenciales copiadas a `.env.local`
- ✅ Puedes acceder al dashboard de Supabase

---

### TAREA 1.2: Configurar autenticación en Supabase

**Paso 1:** En Supabase Dashboard → Authentication → Configuration

**Paso 2:** Configurar URLs:
- Site URL: `http://localhost:3000`
- Redirect URLs: Agregar:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/admin/auth/callback`

**Paso 3:** Configurar Email Auth:
- Enable Email provider: ✅ Activado
- Confirm email: ❌ Desactivado (para demo)
- Secure email change: ✅ Activado

**Criterios de aceptación:**
- ✅ Site URL configurada
- ✅ Redirect URLs agregadas
- ✅ Email auth habilitado

---

### TAREA 1.3: Ejecutar migrations SQL - Parte 1 (Schema base)

**Paso 1:** Ir a Supabase Dashboard → SQL Editor

**Paso 2:** Click en "New query"

**Paso 3:** Copiar y pegar el siguiente SQL (ejecutar en orden):

**Script 1: Extensions**

```sql
-- Habilitar UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verificar
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';
```

**Script 2: Tabla funds**

```sql
CREATE TABLE IF NOT EXISTS funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  country_target VARCHAR(100),
  total_capital_target DECIMAL(15,2),
  total_capital_raised DECIMAL(15,2) DEFAULT 0,
  real_estate_percentage INTEGER DEFAULT 85 CHECK (real_estate_percentage BETWEEN 0 AND 100),
  rd_percentage INTEGER DEFAULT 15 CHECK (rd_percentage BETWEEN 0 AND 100),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT check_percentages CHECK (real_estate_percentage + rd_percentage = 100)
);
```

**Script 3: Tabla investors**

```sql
CREATE TABLE IF NOT EXISTS investors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  nationality VARCHAR(100),
  passport_number VARCHAR(100),
  date_of_birth DATE,
  investment_amount DECIMAL(15,2) NOT NULL CHECK (investment_amount > 0),
  real_estate_amount DECIMAL(15,2),
  rd_amount DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'onboarding' CHECK (status IN ('onboarding', 'active', 'completed', 'suspended')),
  kyc_status VARCHAR(50) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'in_review', 'approved', 'rejected')),
  golden_visa_status VARCHAR(50) DEFAULT 'not_started' CHECK (golden_visa_status IN ('not_started', 'in_progress', 'approved', 'completed')),
  onboarding_date DATE,
  visa_start_date DATE,
  visa_expected_completion DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Script 4: Tablas properties y property_units**

```sql
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS property_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_unit_per_property UNIQUE (property_id, unit_number)
);
```

**Script 5: Tablas documents, milestones, reports, messages**

```sql
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS golden_visa_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  milestone_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  due_date DATE,
  completed_date DATE,
  order_number INTEGER NOT NULL,
  documents_required JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  period VARCHAR(50),
  type VARCHAR(100),
  title VARCHAR(255),
  data_json JSONB,
  pdf_url TEXT,
  generated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  from_admin BOOLEAN DEFAULT FALSE,
  from_user_id UUID REFERENCES auth.users(id),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_date TIMESTAMP WITH TIME ZONE,
  parent_message_id UUID REFERENCES messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Script 6: Verificar tablas creadas**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Criterios de aceptación:**
- ✅ Todas las queries ejecutadas sin errores
- ✅ 8 tablas creadas: funds, investors, properties, property_units, documents, golden_visa_milestones, reports, messages
- ✅ Query de verificación muestra todas las tablas

---

### TAREA 1.4: Ejecutar migrations SQL - Parte 2 (Índices y triggers)

**Script 7: Índices**

```sql
-- Índices en investors
CREATE INDEX IF NOT EXISTS idx_investors_fund ON investors(fund_id);
CREATE INDEX IF NOT EXISTS idx_investors_user ON investors(user_id);
CREATE INDEX IF NOT EXISTS idx_investors_email ON investors(email);
CREATE INDEX IF NOT EXISTS idx_investors_status ON investors(status);

-- Índices en properties
CREATE INDEX IF NOT EXISTS idx_properties_fund ON properties(fund_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);

-- Índices en property_units
CREATE INDEX IF NOT EXISTS idx_property_units_property ON property_units(property_id);
CREATE INDEX IF NOT EXISTS idx_property_units_investor ON property_units(assigned_investor_id);
CREATE INDEX IF NOT EXISTS idx_property_units_rental_status ON property_units(rental_status);

-- Índices en documents
CREATE INDEX IF NOT EXISTS idx_documents_investor ON documents(investor_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);

-- Índices en golden_visa_milestones
CREATE INDEX IF NOT EXISTS idx_milestones_investor ON golden_visa_milestones(investor_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON golden_visa_milestones(status);

-- Índices en reports
CREATE INDEX IF NOT EXISTS idx_reports_investor ON reports(investor_id);

-- Índices en messages
CREATE INDEX IF NOT EXISTS idx_messages_investor ON messages(investor_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
```

**Script 8: Triggers para updated_at**

```sql
-- Función para actualizar updated_at
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
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investors_updated_at
  BEFORE UPDATE ON investors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_units_updated_at
  BEFORE UPDATE ON property_units
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON golden_visa_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Criterios de aceptación:**
- ✅ Todos los índices creados
- ✅ Función update_updated_at_column creada
- ✅ Todos los triggers creados

---

### TAREA 1.5: Ejecutar migrations SQL - Parte 3 (RLS)

**Script 9: Habilitar RLS**

```sql
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE golden_visa_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

**Script 10: Función helper is_admin**

```sql
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
```

**Script 11: Policies para investors**

```sql
-- Inversores pueden ver solo sus propios datos
CREATE POLICY "Investors can view own data"
  ON investors
  FOR SELECT
  USING (user_id = auth.uid());

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to investors"
  ON investors
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

**Script 12: Policies para property_units**

```sql
-- Inversores pueden ver solo unidades asignadas
CREATE POLICY "Investors can view assigned units"
  ON property_units
  FOR SELECT
  USING (
    assigned_investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
  );

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to property_units"
  ON property_units
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

**Script 13: Policies para documents**

```sql
-- Inversores pueden ver sus documentos
CREATE POLICY "Investors can view own documents"
  ON documents
  FOR SELECT
  USING (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
  );

-- Inversores pueden subir documentos
CREATE POLICY "Investors can upload documents"
  ON documents
  FOR INSERT
  WITH CHECK (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
  );

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to documents"
  ON documents
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

**Script 14: Policies para milestones, reports, messages**

```sql
-- Golden Visa Milestones
CREATE POLICY "Investors can view own milestones"
  ON golden_visa_milestones FOR SELECT
  USING (investor_id IN (SELECT id FROM investors WHERE user_id = auth.uid()));

CREATE POLICY "Admins full access to milestones"
  ON golden_visa_milestones FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- Reports
CREATE POLICY "Investors can view own reports"
  ON reports FOR SELECT
  USING (investor_id IN (SELECT id FROM investors WHERE user_id = auth.uid()));

CREATE POLICY "Admins full access to reports"
  ON reports FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- Messages
CREATE POLICY "Investors can view own messages"
  ON messages FOR SELECT
  USING (investor_id IN (SELECT id FROM investors WHERE user_id = auth.uid()));

CREATE POLICY "Investors can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    investor_id IN (SELECT id FROM investors WHERE user_id = auth.uid()) AND
    from_admin = FALSE
  );

CREATE POLICY "Admins full access to messages"
  ON messages FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());
```

**Script 15: Policies para properties y funds**

```sql
-- Properties
CREATE POLICY "Investors can view fund properties"
  ON properties FOR SELECT
  USING (
    fund_id IN (SELECT fund_id FROM investors WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins full access to properties"
  ON properties FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- Funds
CREATE POLICY "Investors can view their fund"
  ON funds FOR SELECT
  USING (
    id IN (SELECT fund_id FROM investors WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins full access to funds"
  ON funds FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());
```

**Criterios de aceptación:**
- ✅ RLS habilitado en todas las tablas
- ✅ Función is_admin() creada
- ✅ Todas las policies creadas sin errores
- ✅ Query `SELECT * FROM pg_policies WHERE schemaname = 'public'` muestra todas las policies

---

### TAREA 1.6: Crear usuarios de prueba en Supabase

**Paso 1:** Ir a Supabase Dashboard → Authentication → Users

**Paso 2:** Click en "Add user" → "Create new user"

**Paso 3:** Crear usuario inversor:
- Email: `zhang.wei@email.com`
- Password: `Demo2024!`
- Auto Confirm User: ✅ (activar)

**Paso 4:** Copiar el `id` del usuario creado (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

**Paso 5:** Crear usuario admin:
- Email: `admin@stagfund.com`
- Password: `Admin2024!`
- Auto Confirm User: ✅ (activar)

**Paso 6:** Guardar ambos IDs de usuario en un archivo temporal

**Criterios de aceptación:**
- ✅ Usuario inversor creado con email `zhang.wei@email.com`
- ✅ Usuario admin creado con email `admin@stagfund.com`
- ✅ Ambos IDs guardados para uso posterior

---

### TAREA 1.7: Seed de datos mockup

**Script 16: Insertar fondo**

```sql
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
```

**Script 17: Insertar inversor Zhang Wei**

IMPORTANTE: Reemplazar `USER_ID_DE_ZHANG_WEI` con el ID real del usuario creado

```sql
INSERT INTO investors (
  id, 
  fund_id, 
  user_id, 
  full_name, 
  email, 
  nationality, 
  investment_amount, 
  real_estate_amount, 
  rd_amount, 
  status, 
  kyc_status, 
  golden_visa_status, 
  onboarding_date, 
  visa_start_date, 
  visa_expected_completion
)
VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'USER_ID_DE_ZHANG_WEI',  -- REEMPLAZAR AQUÍ
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
);
```

**Script 18: Insertar propiedades**

```sql
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
```

**Script 19: Insertar unidades de propiedad**

```sql
INSERT INTO property_units (
  id, property_id, assigned_investor_id, unit_number, floor, 
  size_sqm, bedrooms, bathrooms, rental_status, monthly_rent, 
  current_tenant_name, current_tenant_email, lease_start_date, lease_end_date
)
VALUES
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
```

**Script 20: Insertar hitos Golden Visa**

```sql
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
```

**Script 21: Verificar datos insertados**

```sql
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

**Resultado esperado:**
```
Funds                     1
Investors                 1
Properties                2
Property Units            2
Golden Visa Milestones    6
```

**Criterios de aceptación:**
- ✅ 1 fondo insertado
- ✅ 1 inversor insertado con user_id correcto
- ✅ 2 propiedades insertadas
- ✅ 2 unidades insertadas
- ✅ 6 hitos insertados
- ✅ Query de verificación muestra los conteos correctos

---

### TAREA 1.8: Configurar Storage para documentos

**Paso 1:** Ir a Supabase Dashboard → Storage

**Paso 2:** Click en "Create a new bucket"

**Paso 3:** Configurar bucket:
- Name: `documents`
- Public bucket: ❌ (desactivado - debe ser privado)
- Allowed MIME types: Dejar vacío (permitir todos)
- File size limit: 10 MB

**Paso 4:** Click "Create bucket"

**Paso 5:** Ir a Supabase Dashboard → SQL Editor y ejecutar policies para storage:

```sql
-- Policy: Inversores pueden subir a su carpeta
CREATE POLICY "Investors can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM investors WHERE user_id = auth.uid()
  )
);

-- Policy: Inversores pueden ver sus documentos
CREATE POLICY "Investors can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM investors WHERE user_id = auth.uid()
  )
);

-- Policy: Admins pueden ver todos los documentos
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND is_admin());

-- Policy: Admins pueden subir documentos
CREATE POLICY "Admins can upload all documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND is_admin());
```

**Criterios de aceptación:**
- ✅ Bucket `documents` creado
- ✅ Bucket es privado (no público)
- ✅ 4 políticas de storage creadas

---

### TAREA 1.9: Commit de base de datos

```bash
# Crear archivo README con instrucciones de setup de DB
cat > docs/DATABASE_SETUP.md << 'EOF'
# Database Setup Completed

## Credentials
- Project URL: [recorded in .env.local]
- Anon Key: [recorded in .env.local]

## Tables Created
- funds
- investors
- properties
- property_units
- documents
- golden_visa_milestones
- reports
- messages

## Test Users
- Investor: zhang.wei@email.com / Demo2024!
- Admin: admin@stagfund.com / Admin2024!

## Seed Data
- 1 fund (Italia - China I)
- 1 investor (Zhang Wei)
- 2 properties in Milano
- 2 property units
- 6 Golden Visa milestones

## Next Steps
- Implement Supabase client in application
- Create authentication flow
- Build investor portal
EOF

git add .
git commit -m "feat: setup Supabase database with complete schema and seed data"
```

**Criterios de aceptación:**
- ✅ Archivo docs/DATABASE_SETUP.md creado
- ✅ Commit realizado

---

## FASE 2: Autenticación y Middleware
**Duración:** 1-2 días  
**Objetivo:** Implementar autenticación completa con Supabase

### TAREA 2.1: Crear cliente Supabase para browser

**Paso 1:** Crear archivo `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

**Paso 2:** Verificar que las variables de entorno están definidas

**Criterios de aceptación:**
- ✅ Archivo `lib/supabase/client.ts` creado
- ✅ No hay errores de TypeScript
- ✅ Cliente se puede importar correctamente

---

### TAREA 2.2: Crear cliente Supabase para server

**Paso 1:** Crear archivo `lib/supabase/server.ts`:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
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
            // Server component cannot set cookies
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Server component cannot remove cookies
          }
        },
      },
    }
  )
}
```

**Criterios de aceptación:**
- ✅ Archivo `lib/supabase/server.ts` creado
- ✅ No hay errores de TypeScript

---

### TAREA 2.3: Crear middleware de autenticación

**Paso 1:** Crear archivo `middleware.ts` en la raíz del proyecto:

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

**Criterios de aceptación:**
- ✅ Archivo `middleware.ts` creado en la raíz
- ✅ No hay errores de TypeScript
- ✅ Middleware protege rutas correctamente

---

### TAREA 2.4: Crear página de login para inversores

**Paso 1:** Crear estructura de carpetas:

```bash
mkdir -p app/login
```

**Paso 2:** Crear `app/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Verificar si el usuario es un inversor
      const { data: investor } = await supabase
        .from('investors')
        .select('id')
        .eq('user_id', data.user.id)
        .single()

      if (!investor) {
        setError('This account is not registered as an investor')
        await supabase.auth.signOut()
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-navy rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">STAG</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Investor Portal</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your Golden Visa dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-navy hover:bg-primary-blue"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              Demo credentials: zhang.wei@email.com / Demo2024!
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Paso 3:** Crear `app/login/layout.tsx`:

```typescript
export const metadata = {
  title: 'Login - STAG Golden Visa',
  description: 'Sign in to your investor portal',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
```

**Criterios de aceptación:**
- ✅ Página de login creada
- ✅ Formulario funcional con validación
- ✅ Error handling implementado
- ✅ Navegación a /dashboard después de login exitoso
- ✅ Se puede probar con credenciales: zhang.wei@email.com / Demo2024!

---

### TAREA 2.5: Crear página de login para admins

**Paso 1:** Crear estructura:

```bash
mkdir -p app/admin/login
```

**Paso 2:** Crear `app/admin/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Verificar que el email es del dominio stagfund.com
      if (!data.user.email?.endsWith('@stagfund.com')) {
        setError('Access denied. Admin accounts only.')
        await supabase.auth.signOut()
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-navy px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-blue rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Admin Portal</CardTitle>
          <CardDescription className="text-center">
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@stagfund.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-blue hover:bg-primary-navy"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              Demo credentials: admin@stagfund.com / Admin2024!
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Criterios de aceptación:**
- ✅ Página de admin login creada
- ✅ Validación de dominio @stagfund.com
- ✅ Navegación a /admin/dashboard después de login
- ✅ Se puede probar con: admin@stagfund.com / Admin2024!

---

### TAREA 2.6: Crear callback handler para auth

**Paso 1:** Crear estructura:

```bash
mkdir -p app/auth/callback
```

**Paso 2:** Crear `app/auth/callback/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
```

**Paso 3:** Crear callback para admin:

```bash
mkdir -p app/admin/auth/callback
```

**Paso 4:** Crear `app/admin/auth/callback/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/admin/dashboard`)
}
```

**Criterios de aceptación:**
- ✅ Callback routes creados
- ✅ Manejo correcto de codes de autenticación
- ✅ Redirección apropiada según tipo de usuario

---

### TAREA 2.7: Crear hook useAuth

**Paso 1:** Crear `lib/hooks/useAuth.ts`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return {
    user,
    loading,
    signOut,
  }
}
```

**Criterios de aceptación:**
- ✅ Hook useAuth creado
- ✅ Manejo de sesión y auth state
- ✅ Función signOut implementada
- ✅ No hay errores de TypeScript

---

### TAREA 2.8: Probar autenticación

**Paso 1:** Iniciar servidor de desarrollo:

```bash
npm run dev
```

**Paso 2:** Navegar a http://localhost:3000/login

**Paso 3:** Probar login con credenciales de inversor:
- Email: zhang.wei@email.com
- Password: Demo2024!
- ✅ Debería redirigir a /dashboard (aunque aún no existe, mostrará 404)

**Paso 4:** Navegar a http://localhost:3000/admin/login

**Paso 5:** Probar login con credenciales de admin:
- Email: admin@stagfund.com
- Password: Admin2024!
- ✅ Debería redirigir a /admin/dashboard (mostrará 404)

**Paso 6:** Verificar que intentar acceder a /dashboard sin autenticación redirige a /login

**Criterios de aceptación:**
- ✅ Login de inversor funciona correctamente
- ✅ Login de admin funciona correctamente
- ✅ Rutas protegidas redirigen a login
- ✅ No hay errores en consola

---

### TAREA 2.9: Commit de autenticación

```bash
git add .
git commit -m "feat: implement complete authentication system with Supabase"
```

**Criterios de aceptación:**
- ✅ Commit realizado exitosamente

---

## CHECKPOINT 1

**Has completado:**
- ✅ FASE 0: Setup inicial del proyecto
- ✅ FASE 1: Base de datos configurada en Supabase
- ✅ FASE 2: Sistema de autenticación completo

**Próximos pasos:**
- FASE 3: Design System y Componentes Base
- FASE 4: Portal del Inversor - Core
- FASE 5: Portal del Inversor - Features Avanzados
- FASE 6: Backoffice Admin
- FASE 7: Internacionalización
- FASE 8: Testing y Deployment

**Tiempo estimado hasta aquí:** 3-5 días  
**Tiempo restante:** ~5-6 semanas

---

## CONTINUACIÓN DEL DOCUMENTO

Este documento continuará con las siguientes fases. Por ahora, verifica que:

1. ✅ Servidor de desarrollo funciona sin errores
2. ✅ Puedes hacer login como inversor y admin
3. ✅ Base de datos tiene los datos de prueba
4. ✅ Todas las migraciones SQL ejecutadas correctamente

Si todo está correcto, estás listo para continuar con la FASE 3.

---

**DOCUMENTO CONTINÚA EN PÁGINA SIGUIENTE...**

[El documento continuaría con las Fases 3-8, siguiendo el mismo nivel de detalle paso a paso]

---

## NOTAS IMPORTANTES PARA EL AGENTE

### Buenas prácticas

1. **Commit frecuente**: Haz commit después de cada tarea completada
2. **Testing continuo**: Verifica que el servidor funcione después de cada cambio
3. **Consulta documentos**: Lee los documentos de especificaciones cuando tengas dudas
4. **Errores de TypeScript**: No ignores errores de TypeScript, resuélvelos inmediatamente
5. **Console logs**: Usa console.log para debugging pero elimínalos antes de hacer commit

### Comandos útiles durante desarrollo

```bash
# Ver logs en tiempo real
npm run dev

# Verificar tipos
npm run build

# Limpiar y reinstalar (si hay problemas)
rm -rf .next node_modules
npm install
npm run dev
```

### Si algo falla

1. Lee el error cuidadosamente
2. Verifica que las variables de entorno estén correctas
3. Verifica que Supabase esté funcionando
4. Consulta la documentación oficial si es necesario
5. Haz rollback del último commit si es necesario: `git reset --hard HEAD~1`

---

**FIN DE LA PRIMERA PARTE DEL PLAN DE TAREAS**

**Siguiente documento:** `05_Plan_Tareas_Desarrollo_Parte_2.md` (Fases 3-8)
