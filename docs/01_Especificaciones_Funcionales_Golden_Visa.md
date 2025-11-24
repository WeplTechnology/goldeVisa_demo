# ESPECIFICACIONES FUNCIONALES
# PLATAFORMA GOLDEN VISA - STAG FUND MANAGEMENT

**Proyecto:** Sistema de Gestión de Inversores Golden Visa Italia  
**Cliente:** STAG Fund Management  
**Desarrollador:** WepL Technology  
**Versión:** 1.0 - Demo Funcional  
**Fecha:** Noviembre 2024

---

## 1. RESUMEN EJECUTIVO

### 1.1 Objetivo del Proyecto
Desarrollar una plataforma web integral para gestionar el programa Golden Visa Italia de STAG Fund Management, permitiendo a inversores extranjeros monitorizar sus inversiones (85% inmobiliario + 15% I+D) y el progreso de su proceso de ciudadanía italiana.

### 1.2 Alcance de la Demo
- **Tipo:** Demo funcional con datos mockup
- **Objetivo:** Presentación comercial a STAG Fund Management
- **Enfoque:** Diseño production-ready + funcionalidades core reales + mockups de features avanzados
- **Timeline:** 8 semanas de desarrollo

### 1.3 Usuarios del Sistema
1. **Inversores:** Ciudadanos extranjeros que invierten €250,000 para obtener Golden Visa
2. **Equipo STAG:** Administradores del fondo que gestionan inversores y activos
3. **Futuros:** Agencias de inmigración, administradoras de propiedades (fase posterior)

---

## 2. ARQUITECTURA TÉCNICA

### 2.1 Stack Tecnológico

#### Frontend
```
Framework: Next.js 14+ (App Router)
Lenguaje: TypeScript
Estilos: Tailwind CSS
Componentes: Shadcn/ui
Iconos: Lucide React
Estado: React Query (TanStack Query)
Internacionalización: i18next
Gráficos: Recharts
```

#### Backend
```
Base de datos: Supabase (PostgreSQL)
Autenticación: Supabase Auth
Storage: Supabase Storage
Edge Functions: Supabase Edge Functions
Realtime: Supabase Realtime (opcional)
```

#### Deployment
```
Frontend: Vercel
Database: Supabase Cloud
```

### 2.2 Requisitos del Sistema
- Node.js 18+
- PostgreSQL 15+ (via Supabase)
- Navegadores soportados: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- Responsive: Desktop (1920px), Tablet (768px), Mobile (375px)

---

## 3. MODELO DE DATOS

### 3.1 Esquema de Base de Datos

#### Tabla: `funds`
Gestión de fondos de inversión

```sql
CREATE TABLE funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  country_target VARCHAR(100), -- "China", "LATAM", etc.
  total_capital_target DECIMAL(15,2),
  total_capital_raised DECIMAL(15,2) DEFAULT 0,
  real_estate_percentage INTEGER DEFAULT 85,
  rd_percentage INTEGER DEFAULT 15,
  status VARCHAR(50) DEFAULT 'active', -- active, closed, suspended
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `investors`
Información de inversores

```sql
CREATE TABLE investors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID REFERENCES funds(id),
  user_id UUID REFERENCES auth.users(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  nationality VARCHAR(100),
  passport_number VARCHAR(100),
  date_of_birth DATE,
  investment_amount DECIMAL(15,2) NOT NULL,
  real_estate_amount DECIMAL(15,2),
  rd_amount DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'onboarding', -- onboarding, active, completed, suspended
  kyc_status VARCHAR(50) DEFAULT 'pending', -- pending, in_review, approved, rejected
  golden_visa_status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, approved, completed
  onboarding_date DATE,
  visa_start_date DATE,
  visa_expected_completion DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `properties`
Propiedades inmobiliarias del fondo

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID REFERENCES funds(id),
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
  status VARCHAR(50) DEFAULT 'active', -- active, sold, under_renovation
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `property_units`
Unidades individuales dentro de propiedades

```sql
CREATE TABLE property_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  assigned_investor_id UUID REFERENCES investors(id),
  unit_number VARCHAR(50) NOT NULL,
  floor INTEGER,
  size_sqm DECIMAL(10,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  rental_status VARCHAR(50) DEFAULT 'available', -- available, rented, maintenance
  monthly_rent DECIMAL(10,2),
  current_tenant_name VARCHAR(255),
  current_tenant_email VARCHAR(255),
  lease_start_date DATE,
  lease_end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `documents`
Gestión de documentos de inversores

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES investors(id),
  type VARCHAR(100) NOT NULL, -- passport, bank_statement, residence_proof, contract, etc.
  category VARCHAR(50), -- kyc, golden_visa, property, tax, other
  name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  upload_date TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `golden_visa_milestones`
Hitos del proceso Golden Visa

```sql
CREATE TABLE golden_visa_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES investors(id),
  milestone_type VARCHAR(100) NOT NULL, -- investment, company_incorporation, property_assignment, rental_year_1, etc.
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, overdue
  due_date DATE,
  completed_date DATE,
  order_number INTEGER,
  documents_required JSONB, -- Array de tipos de documentos necesarios
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `reports`
Reportes generados para inversores

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES investors(id),
  period VARCHAR(50), -- "Q1 2024", "2024", "November 2024"
  type VARCHAR(100), -- quarterly, annual, monthly, custom
  title VARCHAR(255),
  data_json JSONB, -- Datos estructurados del reporte
  pdf_url TEXT,
  generated_date TIMESTAMP DEFAULT NOW(),
  generated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `messages`
Sistema de mensajería interno

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES investors(id),
  from_admin BOOLEAN DEFAULT FALSE,
  from_user_id UUID REFERENCES auth.users(id),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_date TIMESTAMP,
  parent_message_id UUID REFERENCES messages(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2 Relaciones Principales
- Un `fund` tiene muchos `investors`
- Un `fund` tiene muchas `properties`
- Una `property` tiene muchas `property_units`
- Un `investor` puede tener múltiples `property_units` asignadas
- Un `investor` tiene múltiples `documents`
- Un `investor` tiene múltiples `golden_visa_milestones`
- Un `investor` tiene múltiples `reports`
- Un `investor` puede tener múltiples `messages`

---

## 4. FUNCIONALIDADES DETALLADAS

### 4.1 MÓDULO: AUTENTICACIÓN Y ROLES

#### 4.1.1 Sistema de Roles
```typescript
enum UserRole {
  INVESTOR = 'investor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}
```

#### 4.1.2 Funcionalidades
- Login con email/password
- Recuperación de contraseña
- Cambio de contraseña
- Autenticación de dos factores (2FA) - MOCKUP
- Session management
- Logout

#### 4.1.3 Permisos por Rol

**INVESTOR:**
- Ver su propio dashboard
- Ver sus propiedades asignadas
- Ver su Golden Visa roadmap
- Subir/descargar sus documentos
- Ver sus reportes
- Enviar/recibir mensajes
- Editar su perfil

**ADMIN:**
- Ver dashboard global del fondo
- Ver/editar todos los inversores
- Asignar propiedades a inversores
- Gestionar documentos
- Generar reportes
- Gestionar propiedades
- Ver analytics

**SUPER_ADMIN:**
- Todo lo de ADMIN
- Gestionar fondos
- Gestionar usuarios admin
- Configuración del sistema

---

### 4.2 MÓDULO: PORTAL DEL INVERSOR

#### 4.2.1 Dashboard Principal (`/dashboard`)

**Componentes visuales:**
```
┌─────────────────────────────────────────┐
│  Bienvenido, Zhang Wei                  │
│  🇨🇳 Inversor desde Nov 2024            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  MI INVERSIÓN                           │
│  💰 Capital Total: €250,000             │
│  🏠 Real Estate: €212,500 (85%)        │
│  🔬 I+D: €37,500 (15%)                 │
│  📈 ROI Anual: 4.2%                     │
│  🇮🇹 Golden Visa: Año 1 de 5           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  RESUMEN PROPIEDADES                    │
│  📍 2 unidades en Milano                │
│  💶 Renta mensual: €1,720               │
│  📊 Ocupación: 100%                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  PRÓXIMAS ACCIONES                      │
│  • Renovar contrato (15 Dic 2025)      │
│  • Subir declaración Q4 (31 Ene 2025)  │
└─────────────────────────────────────────┘
```

**KPIs mostrados:**
- Capital total invertido
- Distribución RE/I+D
- Rentabilidad anual actual
- Estado Golden Visa
- Próximo pago de renta esperado
- Documentos pendientes de subir
- Mensajes sin leer

**Gráficos:**
- Distribución del capital (pie chart)
- Proyección de retorno 5 años (line chart)
- Ingresos mensuales por alquiler (bar chart)

---

#### 4.2.2 Golden Visa Roadmap (`/golden-visa`) ⭐ FEATURE ESTRELLA

**Layout:**
```
┌───────────────────────────────────────────────────┐
│  🇮🇹 TU CAMINO A LA CIUDADANÍA ITALIANA          │
│  Tiempo transcurrido: 1 año 2 meses              │
│  Tiempo restante: 3 años 10 meses                │
└───────────────────────────────────────────────────┘

[Timeline Interactivo]
━━━●━━━━●━━━━○━━━━━○━━━━━○━━━━━○━━━━→
  ✓    ▶     📅    📅    📅    🎯
 INV  ALQ   RES   REN   REN  CIUD
     1/5    APP   2-4    5   ITAL

[Detalle de Hitos]
┌───────────────────────────────────────────────────┐
│ ✅ INVERSIÓN REALIZADA                            │
│    Fecha: 15 Nov 2024                             │
│    Estado: Completado                             │
│    Monto: €250,000                                │
│    ✓ Transferencia recibida                       │
│    ✓ Contrato firmado                             │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│ ✅ EMPRESA CONSTITUIDA                            │
│    Fecha: 02 Dic 2024                             │
│    Estado: Completado                             │
│    Empresa: Zhang Wei SRL                         │
│    Registro: IT-MI-2024-4567                      │
│    📄 Ver certificado de constitución              │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│ ✅ ACTIVOS ASIGNADOS                              │
│    Fecha: 15 Dic 2024                             │
│    Estado: Completado                             │
│    Propiedades:                                   │
│    • Via Garibaldi 23, Unidad 4B (22m²)          │
│    • Via Garibaldi 23, Unidad 4C (23m²)          │
│    📄 Ver escrituras                               │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│ ▶ PERIODO DE ALQUILER - AÑO 1 DE 5               │
│    Inicio: 20 Dic 2024                            │
│    Estado: En curso                               │
│    Progreso: 1 mes de 60 meses (2%)              │
│    Renta mensual: €1,720                          │
│    Próximo pago: 15 Ene 2025                      │
│                                                   │
│    Checklist:                                     │
│    ✓ Contrato firmado                             │
│    ✓ Inquilinos asignados                         │
│    ✓ Primer pago recibido                         │
│    ⏳ Declaración trimestral (31 Mar 2025)        │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│ 📅 APLICACIÓN DE RESIDENCIA                       │
│    Fecha estimada: Jun 2025                       │
│    Estado: Pendiente                              │
│    Tiempo restante: 7 meses                       │
│                                                   │
│    Requisitos:                                    │
│    ⏳ 6 meses de alquiler completados              │
│    ⏳ Empresa activa por 6 meses                   │
│    ⏳ Declaraciones fiscales al día                │
│    📄 Documentos necesarios:                       │
│       • Certificado de antecedentes penales       │
│       • Certificado de residencia fiscal          │
│       • Extractos bancarios últimos 6 meses       │
└───────────────────────────────────────────────────┘

[Sección de Ayuda]
❓ ¿Tienes dudas sobre tu proceso?
💬 Contactar con STAG
📚 Ver guía completa Golden Visa
```

**Funcionalidades interactivas:**
- Timeline visual con scroll horizontal
- Click en cada hito para expandir detalles
- Checklist interactivo (items se marcan automáticamente)
- Descarga de documentos asociados a cada hito
- Alertas de próximas fechas importantes
- Progress bar animado
- Contador de días/meses transcurridos y restantes

**Datos dinámicos:**
- Cálculo automático de progreso basado en fechas
- Estado de hitos (completado, en progreso, pendiente, atrasado)
- Documentos requeridos por hito
- Alertas de vencimientos

---

#### 4.2.3 Mis Propiedades (`/properties`)

**Vista de Lista:**
```
┌───────────────────────────────────────────────────┐
│  MIS PROPIEDADES                                  │
│  2 unidades | Valoración total: €220,000         │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│ 📍 Via Garibaldi 23, Milano                       │
│ Unidad 4B | 22m² | Piso 4                        │
│                                                   │
│ 💶 Renta mensual: €850                            │
│ 👤 Inquilino: Marco Rossi                         │
│ 📅 Contrato hasta: 19 Dic 2025                    │
│                                                   │
│ [Ver detalles] [Ver contrato] [Ver fotos]        │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│ 📍 Via Garibaldi 23, Milano                       │
│ Unidad 4C | 23m² | Piso 4                        │
│                                                   │
│ 💶 Renta mensual: €870                            │
│ 👤 Inquilino: Sofia Bianchi                       │
│ 📅 Contrato hasta: 19 Dic 2025                    │
│                                                   │
│ [Ver detalles] [Ver contrato] [Ver fotos]        │
└───────────────────────────────────────────────────┘
```

**Vista de Detalle de Unidad:**
```
┌───────────────────────────────────────────────────┐
│  UNIDAD 4B - Via Garibaldi 23                    │
└───────────────────────────────────────────────────┘

[Galería de Fotos]
[Foto principal] [Foto 2] [Foto 3] [Foto 4]

INFORMACIÓN GENERAL
• Dirección: Via Garibaldi 23, Piso 4, Milano
• Tamaño: 22m²
• Habitaciones: 1 dormitorio, 1 baño
• Valoración actual: €110,000
• Fecha de adquisición: 01 Dic 2024

INFORMACIÓN DE ALQUILER
• Estado: Alquilada
• Inquilino: Marco Rossi
• Email: marco.rossi@email.it
• Teléfono: +39 xxx xxx xxxx
• Renta mensual: €850
• Fecha inicio: 20 Dic 2024
• Fecha fin: 19 Dic 2025
• Depósito: €1,700

HISTORIAL DE PAGOS
┌──────────────────────────────────────┐
│ Diciembre 2024  €850  ✓ Pagado      │
│ Enero 2025      €850  ⏳ Pendiente   │
└──────────────────────────────────────┘

DOCUMENTOS
📄 Contrato de alquiler (PDF)
📄 Escritura de propiedad (PDF)
📄 Certificado energético (PDF)
📄 Plano de la unidad (PDF)

[Mapa interactivo de ubicación]
```

**Funcionalidades:**
- Vista lista y vista mapa (Google Maps)
- Filtros por estado (alquilada, disponible, mantenimiento)
- Galería de fotos expandible
- Descarga de documentos
- Historial de pagos de renta
- Información del inquilino
- Timeline de eventos (adquisición, primer alquiler, renovaciones)

---

#### 4.2.4 Documentos (`/documents`)

**Estructura de carpetas:**
```
📁 MIS DOCUMENTOS
│
├─ 📁 KYC / Identificación
│  ├─ 📄 Pasaporte (verificado ✓)
│  ├─ 📄 Extracto bancario Q4 2024 (verificado ✓)
│  ├─ 📄 Comprobante de domicilio (verificado ✓)
│  └─ [Subir nuevo documento]
│
├─ 📁 Contratos e Inversión
│  ├─ 📄 Contrato de inversión (firmado ✓)
│  ├─ 📄 Constitución de empresa (verificado ✓)
│  └─ 📄 Certificado de registro mercantil
│
├─ 📁 Propiedades
│  ├─ 📄 Escritura Unidad 4B
│  ├─ 📄 Escritura Unidad 4C
│  ├─ 📄 Contrato alquiler 4B
│  └─ 📄 Contrato alquiler 4C
│
├─ 📁 Golden Visa
│  ├─ 📄 Solicitud de residencia (pendiente)
│  └─ [Documentos próximos]
│
├─ 📁 Reportes
│  ├─ 📄 Reporte Q4 2024
│  └─ 📄 Certificado fiscal 2024
│
└─ 📁 Comunicaciones
   ├─ 📄 Carta bienvenida STAG
   └─ 📄 Guía Golden Visa
```

**Funcionalidades:**
- Upload de archivos drag & drop
- Previsualización de PDFs in-app
- Descarga individual o por carpeta (ZIP)
- Estados de verificación (pendiente, verificado, rechazado)
- Búsqueda por nombre o tipo
- Filtros por categoría y fecha
- Notificaciones de documentos pendientes
- Versionado de documentos (v1, v2, etc.)

**Vista de documento:**
```
┌───────────────────────────────────────────────────┐
│  📄 Pasaporte                                     │
│                                                   │
│  Tipo: Identificación                             │
│  Subido: 18 Nov 2024                              │
│  Estado: ✓ Verificado                             │
│  Verificado por: María González (22 Nov 2024)     │
│  Tamaño: 2.4 MB                                   │
│                                                   │
│  [Descargar] [Ver] [Reemplazar]                   │
└───────────────────────────────────────────────────┘
```

---

#### 4.2.5 Reportes (`/reports`)

**Vista principal:**
```
┌───────────────────────────────────────────────────┐
│  MIS REPORTES                                     │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│ 📊 Reporte Trimestral Q4 2024                     │
│ Generado: 15 Ene 2025                             │
│                                                   │
│ Resumen:                                          │
│ • Ingresos por alquiler: €2,550                   │
│ • Apreciación del activo: +2.1%                   │
│ • ROI trimestral: 1.02%                           │
│                                                   │
│ [Descargar PDF] [Ver online]                      │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│ 📄 Certificado Fiscal Anual 2024                  │
│ Generado: 31 Ene 2025                             │
│                                                   │
│ Documento oficial para declaración de impuestos   │
│                                                   │
│ [Descargar PDF]                                   │
└───────────────────────────────────────────────────┘
```

**Tipos de reportes:**
- Trimestral (rendimiento del fondo)
- Mensual (alquileres)
- Anual (fiscal)
- Golden Visa progress report
- Custom (bajo demanda)

---

#### 4.2.6 Mensajes (`/messages`)

**Interfaz de chat:**
```
┌────────────────┬──────────────────────────────────┐
│ Conversaciones │  Chat con STAG Support           │
│                │                                  │
│ ● STAG Support │  [Mensajes anteriores]           │
│   hace 2h      │                                  │
│                │  ┌────────────────────────────┐  │
│ ○ Notificación │  │ STAG (10:30)               │  │
│   hace 1 día   │  │ Hola Zhang, tu reporte Q4  │  │
│                │  │ está listo para descargar  │  │
│ ○ Documentos   │  └────────────────────────────┘  │
│   hace 3 días  │                                  │
│                │  ┌────────────────────────────┐  │
│                │  │                Tú (10:45)  │  │
│                │  │  Perfecto, gracias         │  │
│                │  └────────────────────────────┘  │
│                │                                  │
│                │  [Escribir mensaje...]          │
│                │  [Adjuntar] [Enviar]            │
└────────────────┴──────────────────────────────────┘
```

**Funcionalidades:**
- Chat en tiempo real con Supabase Realtime
- Notificaciones de mensajes nuevos
- Adjuntar archivos
- Marcar como leído/no leído
- Búsqueda en conversaciones
- Tipos de conversaciones (support, documentos, general)

---

#### 4.2.7 Configuración (`/settings`)

**Secciones:**
```
PERFIL
• Nombre completo
• Email (no editable)
• Teléfono
• Fecha de nacimiento
• Nacionalidad
• Foto de perfil

PREFERENCIAS
• Idioma (EN, ES, IT, PT, ZH)
• Zona horaria
• Formato de fecha
• Moneda de visualización

NOTIFICACIONES
• Email notifications
  ☑ Nuevos reportes disponibles
  ☑ Documentos pendientes de subir
  ☑ Pagos de renta recibidos
  ☑ Hitos Golden Visa completados
  ☐ Newsletter mensual

SEGURIDAD
• Cambiar contraseña
• Autenticación de dos factores (2FA) - MOCKUP
• Sesiones activas
• Log de actividad

AYUDA
• Centro de ayuda
• Contactar soporte
• Términos y condiciones
• Política de privacidad
```

---

### 4.3 MÓDULO: BACKOFFICE STAG (ADMIN)

#### 4.3.1 Dashboard Global (`/admin/dashboard`)

**Vista principal:**
```
┌───────────────────────────────────────────────────┐
│  FONDO: Italia - China I                          │
│  Estado: Activo | Creado: 01 Oct 2024            │
└───────────────────────────────────────────────────┘

KPIs PRINCIPALES
┌────────────────┬────────────────┬────────────────┐
│ Capital        │ Inversores     │ Propiedades    │
│ €1,750,000     │ 7 activos      │ 3 adquiridas   │
│ 87.5% objetivo │ 3 onboarding   │ 35 unidades    │
└────────────────┴────────────────┴────────────────┘

┌────────────────┬────────────────┬────────────────┐
│ Ocupación      │ Rentabilidad   │ Golden Visas   │
│ 92%            │ 4.3% anual     │ 7 en proceso   │
│ 32/35 unidades │ €61,250/año    │ 0 completadas  │
└────────────────┴────────────────┴────────────────┘

ACTIVIDAD RECIENTE
• Nuevo inversor: Chen Hui (hace 2 días)
• Documento verificado: Wang Fang - Extracto bancario
• Propiedad asignada: Li Ming - Unidad 3A
• Reporte generado: Q4 2024 - 7 inversores

ACCIONES RÁPIDAS
[+ Nuevo inversor] [+ Nueva propiedad] [Generar reporte]

ALERTAS
⚠️ 3 documentos pendientes de verificación
⚠️ 2 contratos de alquiler vencen en 30 días
```

**Gráficos:**
- Capital levantado vs objetivo (progress bar)
- Evolución de inversores por mes (line chart)
- Distribución geográfica de inversores (map)
- Ocupación por propiedad (bar chart)
- Pipeline de onboarding (funnel chart)

---

#### 4.3.2 Gestión de Inversores (`/admin/investors`)

**Vista de lista:**
```
┌───────────────────────────────────────────────────┐
│  INVERSORES (10 total)                            │
│  [Buscar...] [Filtros ▾] [+ Nuevo inversor]      │
└───────────────────────────────────────────────────┘

Filtros: [Estado ▾] [Golden Visa ▾] [País ▾] [Fecha ▾]

┌──────────────────────────────────────────────────┐
│ Nombre        País  Inversión  Golden Visa  KYC  │
├──────────────────────────────────────────────────┤
│ Zhang Wei     🇨🇳   €250k      ▶ Año 1/5    ✓   │
│ Li Ming       🇨🇳   €250k      ▶ Año 1/5    ✓   │
│ Wang Fang     🇨🇳   €250k      ✓ Docs OK    ✓   │
│ Chen Hui      🇨🇳   €250k      ⏳ Onboard    ⏳  │
│ Liu Ying      🇨🇳   €250k      ▶ Año 2/5    ✓   │
│ Zhou Qiang    🇨🇳   €250k      ▶ Año 2/5    ✓   │
│ Wu Xin        🇨🇳   €250k      ✅ Completo   ✓   │
└──────────────────────────────────────────────────┘

[1] [2] de 2 páginas
```

**Vista de detalle de inversor:**
```
┌───────────────────────────────────────────────────┐
│  👤 ZHANG WEI                                     │
│  Inversor #GV-2024-001                            │
│  [Editar] [Enviar mensaje] [Generar reporte]     │
└───────────────────────────────────────────────────┘

INFORMACIÓN GENERAL
• Email: zhang.wei@email.com
• Teléfono: +86 xxx xxx xxxx
• Nacionalidad: China 🇨🇳
• Pasaporte: E12345678
• Fecha de nacimiento: 15 Mar 1985
• Fecha de inversión: 15 Nov 2024

INVERSIÓN
• Monto total: €250,000
• Real Estate: €212,500 (85%)
• I+D: €37,500 (15%)
• Estado: Activo
• ROI actual: 4.2%

PROPIEDADES ASIGNADAS
┌──────────────────────────────────────────────────┐
│ 📍 Via Garibaldi 23, Unidad 4B (22m²)           │
│    Inquilino: Marco Rossi | Renta: €850/mes     │
├──────────────────────────────────────────────────┤
│ 📍 Via Garibaldi 23, Unidad 4C (23m²)           │
│    Inquilino: Sofia Bianchi | Renta: €870/mes   │
└──────────────────────────────────────────────────┘

GOLDEN VISA
• Estado: Año 1 de 5 - En progreso
• Fecha inicio: 20 Dic 2024
• Finalización estimada: Nov 2029
• Próximo hito: Aplicación residencia (Jun 2025)
• [Ver roadmap completo]

KYC/AML
• Estado: ✓ Aprobado
• Verificado por: María González
• Fecha verificación: 22 Nov 2024
• Documentos: 5/5 verificados

DOCUMENTOS (12 archivos)
┌──────────────────────────────────────────────────┐
│ 📄 Pasaporte          ✓ Verificado   18 Nov 2024│
│ 📄 Extracto bancario  ✓ Verificado   18 Nov 2024│
│ 📄 Contrato inversión ✓ Firmado      20 Nov 2024│
│ 📄 Escritura 4B       ✓ Verificado   15 Dic 2024│
│ 📄 Escritura 4C       ✓ Verificado   15 Dic 2024│
│ [Ver todos]                                      │
└──────────────────────────────────────────────────┘

ACTIVIDAD RECIENTE
• Documento subido: Declaración Q4 (hace 2 días)
• Mensaje enviado (hace 1 semana)
• Reporte Q4 generado (hace 2 semanas)
• Pago renta recibido (hace 3 semanas)

[Historial completo de actividad]
```

**Funcionalidades:**
- CRUD completo de inversores
- Búsqueda y filtros avanzados
- Exportar a Excel/CSV
- Enviar emails masivos
- Asignación de propiedades
- Generación de reportes individuales
- Timeline de eventos
- Notas internas sobre el inversor

---

#### 4.3.3 Gestión de Propiedades (`/admin/properties`)

**Vista de lista:**
```
┌───────────────────────────────────────────────────┐
│  PROPIEDADES (3 total)                            │
│  [Buscar...] [Filtros ▾] [+ Nueva propiedad]     │
└───────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Dirección           Unidades  Ocupación  Valor   │
├──────────────────────────────────────────────────┤
│ Via Garibaldi 23    12/12     100%       €1.3M  │
│ Milano                                           │
├──────────────────────────────────────────────────┤
│ Corso Buenos Aires  13/15     87%        €1.6M  │
│ Milano                                           │
├──────────────────────────────────────────────────┤
│ Via Montenapoleone  7/8       88%        €2.1M  │
│ Milano                                           │
└──────────────────────────────────────────────────┘
```

**Vista de detalle de propiedad:**
```
┌───────────────────────────────────────────────────┐
│  🏢 VIA GARIBALDI 23                              │
│  Milano, Italia                                   │
│  [Editar] [Ver en mapa]                           │
└───────────────────────────────────────────────────┘

INFORMACIÓN GENERAL
• Dirección completa: Via Garibaldi 23, 20121 Milano
• Tamaño total: 300m²
• Unidades totales: 12
• Fecha adquisición: 01 Dic 2024
• Precio adquisición: €1,200,000
• Valoración actual: €1,320,000 (+10%)

UNIDADES (12 total)
┌──────────────────────────────────────────────────┐
│ # │ Tamaño │ Inversor   │ Inquilino    │ Renta  │
├───┼────────┼────────────┼──────────────┼────────┤
│ 1A│ 20m²   │ Liu Ying   │ Paolo Verdi  │ €800  │
│ 1B│ 22m²   │ Liu Ying   │ Anna Neri    │ €850  │
│ 2A│ 18m²   │ Zhou Qiang │ Luca Blu     │ €750  │
│ 2B│ 20m²   │ Zhou Qiang │ Elena Rosso  │ €800  │
│ 3A│ 25m²   │ Li Ming    │ Mario Giallo │ €900  │
│ 3B│ 23m²   │ Li Ming    │ Sara Verde   │ €870  │
│ 4A│ 20m²   │ Sin asign. │ -            │ -     │
│ 4B│ 22m²   │ Zhang Wei  │ Marco Rossi  │ €850  │
│ 4C│ 23m²   │ Zhang Wei  │ Sofia Biachi │ €870  │
│ ..│ ...    │ ...        │ ...          │ ...   │
└───┴────────┴────────────┴──────────────┴────────┘

MÉTRICAS
• Ocupación: 100% (12/12 unidades)
• Renta mensual total: €10,200
• Renta anual estimada: €122,400
• ROI: 10.2% anual

DOCUMENTOS
• Escritura de propiedad
• Planos arquitectónicos
• Certificaciones energéticas
• Permisos municipales
• Contratos de alquiler activos

[Galería de fotos] [Mapa de ubicación]
```

**Funcionalidades:**
- CRUD de propiedades
- Gestión de unidades por propiedad
- Asignación/reasignación de unidades a inversores
- Vista de mapa (Google Maps)
- Upload de fotos y documentos
- Historial de valoraciones
- Cálculo automático de métricas

---

#### 4.3.4 Asignación de Propiedades (`/admin/assignment`)

**Algoritmo de matching automático (MOCKUP en demo):**
```
┌───────────────────────────────────────────────────┐
│  ASIGNACIÓN AUTOMÁTICA DE PROPIEDADES            │
│  [Ejecutar algoritmo]                             │
└───────────────────────────────────────────────────┘

INVERSORES SIN PROPIEDADES ASIGNADAS (2)
┌──────────────────────────────────────────────────┐
│ Chen Hui    €250k  Preferencia: Centro Milano   │
│ Wang Lei    €250k  Preferencia: Zona universitaria│
└──────────────────────────────────────────────────┘

UNIDADES DISPONIBLES (3)
┌──────────────────────────────────────────────────┐
│ Via Garibaldi 23, 4A  20m²  Centro  €800/mes    │
│ Corso Buenos Aires, 3C 22m² Centro  €850/mes    │
│ Via Montenapoleone, 1A 25m² Centro  €950/mes    │
└──────────────────────────────────────────────────┘

[Ejecutar matching automático]

RESULTADOS SUGERIDOS:
• Chen Hui → Via Garibaldi 4A + Corso Buenos Aires 3C
  Razón: Máxima rentabilidad en zona preferida
• Wang Lei → Via Montenapoleone 1A
  Razón: Zona universitaria cercana

[Aplicar sugerencias] [Asignar manualmente]
```

**Funcionalidades:**
- Vista de inversores sin propiedades
- Vista de unidades disponibles
- Drag & drop para asignación manual
- Algoritmo de matching (mockup)
- Preview antes de confirmar
- Notificación automática al inversor

---

#### 4.3.5 Generación de Reportes (`/admin/reports`)

**Interfaz:**
```
┌───────────────────────────────────────────────────┐
│  GENERADOR DE REPORTES                            │
└───────────────────────────────────────────────────┘

TIPO DE REPORTE
○ Trimestral (todos los inversores)
○ Mensual (alquileres)
○ Anual (fiscal)
○ Custom (seleccionar inversores)

PERIODO
Desde: [01/10/2024] Hasta: [31/12/2024]

INVERSORES
☑ Todos los inversores (7)
○ Seleccionar específicos

INCLUIR EN EL REPORTE
☑ Resumen de inversión
☑ Ingresos por alquiler
☑ Valoración de activos
☑ Estado Golden Visa
☑ Proyección de retorno
☐ Gráficos avanzados

FORMATO
○ PDF
○ Excel
○ Ambos

[Vista previa] [Generar reporte]
```

**Salida del reporte:**
- PDF profesional con branding STAG
- Datos por inversor
- Gráficos y visualizaciones
- Descarga automática
- Envío por email opcional

---

#### 4.3.6 Centro Documental (`/admin/documents`)

**Vista global:**
```
┌───────────────────────────────────────────────────┐
│  CENTRO DOCUMENTAL                                │
│  [Buscar...] [Filtros ▾]                          │
└───────────────────────────────────────────────────┘

DOCUMENTOS PENDIENTES DE VERIFICACIÓN (3)
┌──────────────────────────────────────────────────┐
│ Chen Hui - Extracto bancario    Subido hace 2h  │
│ Wang Lei - Pasaporte            Subido hace 1d   │
│ Zhou Qiang - Declaración fiscal Subido hace 2d   │
└──────────────────────────────────────────────────┘

TODOS LOS DOCUMENTOS (127 archivos)
Filtros: [Tipo ▾] [Estado ▾] [Inversor ▾] [Fecha ▾]

┌──────────────────────────────────────────────────┐
│ Inversor   Tipo         Estado      Fecha        │
├──────────────────────────────────────────────────┤
│ Zhang Wei  Pasaporte    ✓ Verificado 18 Nov     │
│ Zhang Wei  Extracto     ✓ Verificado 18 Nov     │
│ Li Ming    Contrato     ✓ Firmado    20 Nov     │
│ Chen Hui   Extracto     ⏳ Pendiente  23 Nov     │
│ Wang Lei   Pasaporte    ⏳ Pendiente  22 Nov     │
└──────────────────────────────────────────────────┘
```

**Verificación de documento:**
```
┌───────────────────────────────────────────────────┐
│  VERIFICAR DOCUMENTO                              │
│  Chen Hui - Extracto bancario                     │
└───────────────────────────────────────────────────┘

[Visor de PDF en pantalla]

CHECKLIST DE VERIFICACIÓN
☑ Documento legible
☑ Fecha reciente (últimos 3 meses)
☑ Monto mínimo visible (€250,000+)
☑ Datos coinciden con registro
☐ Sin señales de manipulación

ACCIÓN
○ Aprobar documento
○ Rechazar documento
  Razón: [___________________________]

[Cancelar] [Guardar decisión]
```

**Funcionalidades:**
- Vista consolidada de todos los documentos
- Filtros y búsqueda
- Verificación rápida con checklist
- Visor de PDFs integrado
- Notas y comentarios por documento
- Historial de cambios
- Descarga masiva

---

#### 4.3.7 Analytics (`/admin/analytics`)

**Dashboard de métricas:**
```
┌───────────────────────────────────────────────────┐
│  ANALYTICS                                        │
│  Periodo: Últimos 12 meses                        │
└───────────────────────────────────────────────────┘

CRECIMIENTO DEL FONDO
[Gráfico de línea: Capital levantado por mes]

CONVERSIÓN DE INVERSORES
[Funnel chart]
100 leads → 45 contactos → 20 en proceso → 10 invertido

DISTRIBUCIÓN GEOGRÁFICA
[Mapa mundial con pins]
China: 7 inversores
USA: 0 inversores
LATAM: 0 inversores

OCUPACIÓN POR PROPIEDAD
[Bar chart horizontal]
Via Garibaldi 23: 100%
Corso Buenos Aires: 87%
Via Montenapoleone: 88%

RENTABILIDAD
[Line chart]
Promedio mensual: €30,600
Tendencia: +5% vs mes anterior

GOLDEN VISA PIPELINE
[Stacked bar chart]
Año 1: 4 inversores
Año 2: 2 inversores
Año 3: 0 inversores
Año 4: 0 inversores
Completado: 1 inversor
```

---

### 4.4 MÓDULO: INTERNACIONALIZACIÓN (i18n)

#### 4.4.1 Idiomas Soportados
1. **Inglés (EN)** - Idioma por defecto
2. **Español (ES)**
3. **Italiano (IT)**
4. **Portugués (PT)**
5. **Chino Mandarín (ZH)**

#### 4.4.2 Implementación
```typescript
// Librería: i18next + react-i18next
// Estructura de archivos:
/locales
  /en
    common.json
    investor.json
    admin.json
    errors.json
  /es
    common.json
    investor.json
    admin.json
    errors.json
  /it
    ...
  /pt
    ...
  /zh
    ...
```

#### 4.4.3 Elementos traducidos
- Textos de interfaz
- Mensajes de error
- Emails de notificación
- Reportes generados (PDFs)
- Tooltips y ayudas
- Breadcrumbs y navegación

#### 4.4.4 Selector de idioma
```
[🌐 EN ▾]
  ├─ 🇬🇧 English
  ├─ 🇪🇸 Español
  ├─ 🇮🇹 Italiano
  ├─ 🇵🇹 Português
  └─ 🇨🇳 中文
```

**Ubicación:**
- Header (esquina superior derecha)
- Footer
- Página de login
- Configuración de usuario

#### 4.4.5 Formatos localizados
- **Fechas:** Adaptadas por región (DD/MM/YYYY, MM/DD/YYYY)
- **Moneda:** EUR por defecto, con símbolo €
- **Números:** Separadores de miles según región

---

### 4.5 MÓDULO: NOTIFICACIONES

#### 4.5.1 Tipos de Notificaciones

**Email:**
- Bienvenida al inversor
- Documento verificado
- Documento rechazado (con razón)
- Nuevo reporte disponible
- Hito Golden Visa completado
- Pago de renta recibido
- Próximo vencimiento de contrato
- Mensaje nuevo en la plataforma

**In-app:**
- Badge en el icono de notificaciones
- Toast notifications para acciones inmediatas
- Centro de notificaciones con historial

#### 4.5.2 Preferencias de notificación
Usuario puede configurar:
- Recibir o no cada tipo de notificación
- Canal preferido (email, in-app, ambos)
- Frecuencia (inmediato, diario, semanal)

---

## 5. DISEÑO Y UI/UX

### 5.1 Design System

#### 5.1.1 Colores
```css
/* Colores primarios (STAG Brand) */
--primary-navy: #1B365D;
--primary-blue: #6B9BD1;
--primary-light: #E8F0F9;

/* Neutros */
--background: #F8F9FA;
--background-secondary: #FFFFFF;
--border: #E5E7EB;
--text-primary: #2C3E50;
--text-secondary: #6C757D;
--text-disabled: #ADB5BD;

/* Estados */
--success: #28A745;
--success-light: #D4EDDA;
--warning: #FFC107;
--warning-light: #FFF3CD;
--error: #DC3545;
--error-light: #F8D7DA;
--info: #17A2B8;
--info-light: #D1ECF1;

/* Overlays */
--overlay: rgba(0, 0, 0, 0.5);
--shadow: rgba(0, 0, 0, 0.1);
```

#### 5.1.2 Tipografía
```css
/* Fuente: Inter (Google Fonts) */
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Tamaños */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Pesos */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### 5.1.3 Espaciado
```css
/* Sistema de espaciado (múltiplos de 4px) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

#### 5.1.4 Bordes y Sombras
```css
/* Border radius */
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Circular */

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### 5.2 Componentes Base (Shadcn/ui)

Utilizar los siguientes componentes de Shadcn/ui:
- Button
- Card
- Input
- Select
- Checkbox
- Radio Group
- Switch
- Textarea
- Dialog (Modal)
- Dropdown Menu
- Tabs
- Table
- Badge
- Alert
- Progress
- Skeleton (loading states)
- Toast
- Tooltip

### 5.3 Iconografía

**Librería:** Lucide React

**Iconos principales:**
```typescript
import {
  Home,
  TrendingUp,
  Building2,
  FileText,
  MessageSquare,
  Settings,
  User,
  LogOut,
  Bell,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  AlertCircle,
  Info,
  ChevronRight,
  Calendar,
  MapPin,
  DollarSign,
  Percent,
  Users,
  Globe
} from 'lucide-react'
```

### 5.4 Responsive Design

#### Breakpoints
```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Tablets */
--breakpoint-md: 768px;   /* Small laptops */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
--breakpoint-2xl: 1536px; /* Extra large */
```

#### Layouts por dispositivo

**Mobile (< 640px):**
- Navegación en hamburger menu
- Cards en columna única
- Sidebar colapsado por defecto
- Tablas con scroll horizontal

**Tablet (640px - 1024px):**
- Navegación en sidebar colapsable
- Cards en 2 columnas
- Sidebar puede expandirse

**Desktop (> 1024px):**
- Navegación en sidebar fijo
- Cards en 3-4 columnas
- Sidebar siempre visible
- Layout de 2 o 3 columnas

### 5.5 Estados de Carga

**Skeleton screens:**
```typescript
// Ejemplo para card de propiedad
<Card>
  <Skeleton className="h-48 w-full" /> {/* Imagen */}
  <div className="p-4">
    <Skeleton className="h-4 w-3/4 mb-2" /> {/* Título */}
    <Skeleton className="h-4 w-1/2 mb-4" /> {/* Subtítulo */}
    <Skeleton className="h-10 w-full" />     {/* Botón */}
  </div>
</Card>
```

**Spinners:**
- Spinner pequeño para botones
- Spinner mediano para secciones
- Overlay con spinner para operaciones globales

**Progressive disclosure:**
- Cargar datos críticos primero
- Lazy loading de imágenes
- Paginación de listas grandes

---

## 6. DATOS MOCKUP PARA LA DEMO

### 6.1 Fondo Principal

```json
{
  "id": "fund-001",
  "name": "Italia - China I",
  "description": "Fondo de inversión Golden Visa para inversores chinos",
  "country_target": "China",
  "total_capital_target": 2000000,
  "total_capital_raised": 1750000,
  "real_estate_percentage": 85,
  "rd_percentage": 15,
  "status": "active",
  "created_at": "2024-10-01"
}
```

### 6.2 Inversores Ficticios

```json
[
  {
    "id": "inv-001",
    "full_name": "Zhang Wei",
    "email": "zhang.wei@email.com",
    "nationality": "China",
    "investment_amount": 250000,
    "status": "active",
    "golden_visa_status": "in_progress",
    "onboarding_date": "2024-11-15",
    "visa_start_date": "2024-12-20",
    "visa_expected_completion": "2029-11-15"
  },
  {
    "id": "inv-002",
    "full_name": "Li Ming",
    "email": "li.ming@email.com",
    "nationality": "China",
    "investment_amount": 250000,
    "status": "active",
    "golden_visa_status": "in_progress",
    "onboarding_date": "2024-11-10"
  },
  {
    "id": "inv-003",
    "full_name": "Wang Fang",
    "email": "wang.fang@email.com",
    "nationality": "China",
    "investment_amount": 250000,
    "status": "onboarding",
    "golden_visa_status": "not_started",
    "onboarding_date": "2024-11-20"
  },
  {
    "id": "inv-004",
    "full_name": "Chen Hui",
    "email": "chen.hui@email.com",
    "nationality": "China",
    "investment_amount": 250000,
    "status": "onboarding",
    "golden_visa_status": "not_started",
    "onboarding_date": "2024-11-22"
  },
  {
    "id": "inv-005",
    "full_name": "Liu Ying",
    "email": "liu.ying@email.com",
    "nationality": "China",
    "investment_amount": 250000,
    "status": "active",
    "golden_visa_status": "in_progress",
    "onboarding_date": "2023-11-15",
    "visa_start_date": "2023-12-20"
  },
  {
    "id": "inv-006",
    "full_name": "Zhou Qiang",
    "email": "zhou.qiang@email.com",
    "nationality": "China",
    "investment_amount": 250000,
    "status": "active",
    "golden_visa_status": "in_progress",
    "onboarding_date": "2023-11-18",
    "visa_start_date": "2023-12-22"
  },
  {
    "id": "inv-007",
    "full_name": "Wu Xin",
    "email": "wu.xin@email.com",
    "nationality": "China",
    "investment_amount": 250000,
    "status": "completed",
    "golden_visa_status": "completed",
    "onboarding_date": "2019-11-15",
    "visa_start_date": "2019-12-20",
    "visa_completion_date": "2024-11-15"
  }
]
```

### 6.3 Propiedades

```json
[
  {
    "id": "prop-001",
    "name": "Via Garibaldi 23",
    "address": "Via Garibaldi 23, 20121 Milano, Italia",
    "city": "Milano",
    "total_size_sqm": 300,
    "total_units": 12,
    "acquisition_date": "2024-12-01",
    "acquisition_price": 1200000,
    "current_value": 1320000,
    "status": "active",
    "latitude": 45.4654219,
    "longitude": 9.1859243
  },
  {
    "id": "prop-002",
    "name": "Corso Buenos Aires 45",
    "address": "Corso Buenos Aires 45, 20124 Milano, Italia",
    "city": "Milano",
    "total_size_sqm": 350,
    "total_units": 15,
    "acquisition_date": "2024-12-05",
    "acquisition_price": 1500000,
    "current_value": 1650000,
    "status": "active",
    "latitude": 45.4773543,
    "longitude": 9.2051436
  },
  {
    "id": "prop-003",
    "name": "Via Montenapoleone 8",
    "address": "Via Montenapoleone 8, 20121 Milano, Italia",
    "city": "Milano",
    "total_size_sqm": 200,
    "total_units": 8,
    "acquisition_date": "2024-12-10",
    "acquisition_price": 2000000,
    "current_value": 2100000,
    "status": "active",
    "latitude": 45.4685453,
    "longitude": 9.1926482
  }
]
```

### 6.4 Unidades de Propiedad (ejemplo para Via Garibaldi 23)

```json
[
  {
    "id": "unit-001",
    "property_id": "prop-001",
    "assigned_investor_id": "inv-005",
    "unit_number": "1A",
    "floor": 1,
    "size_sqm": 20,
    "bedrooms": 1,
    "bathrooms": 1,
    "rental_status": "rented",
    "monthly_rent": 800,
    "current_tenant_name": "Paolo Verdi",
    "current_tenant_email": "paolo.verdi@email.it",
    "lease_start_date": "2024-12-20",
    "lease_end_date": "2025-12-19"
  },
  {
    "id": "unit-002",
    "property_id": "prop-001",
    "assigned_investor_id": "inv-005",
    "unit_number": "1B",
    "floor": 1,
    "size_sqm": 22,
    "bedrooms": 1,
    "bathrooms": 1,
    "rental_status": "rented",
    "monthly_rent": 850,
    "current_tenant_name": "Anna Neri",
    "current_tenant_email": "anna.neri@email.it",
    "lease_start_date": "2024-12-20",
    "lease_end_date": "2025-12-19"
  },
  {
    "id": "unit-008",
    "property_id": "prop-001",
    "assigned_investor_id": "inv-001",
    "unit_number": "4B",
    "floor": 4,
    "size_sqm": 22,
    "bedrooms": 1,
    "bathrooms": 1,
    "rental_status": "rented",
    "monthly_rent": 850,
    "current_tenant_name": "Marco Rossi",
    "current_tenant_email": "marco.rossi@email.it",
    "lease_start_date": "2024-12-20",
    "lease_end_date": "2025-12-19"
  },
  {
    "id": "unit-009",
    "property_id": "prop-001",
    "assigned_investor_id": "inv-001",
    "unit_number": "4C",
    "floor": 4,
    "size_sqm": 23,
    "bedrooms": 1,
    "bathrooms": 1,
    "rental_status": "rented",
    "monthly_rent": 870,
    "current_tenant_name": "Sofia Bianchi",
    "current_tenant_email": "sofia.bianchi@email.it",
    "lease_start_date": "2024-12-20",
    "lease_end_date": "2025-12-19"
  }
  // ... más unidades
]
```

### 6.5 Hitos Golden Visa (para Zhang Wei)

```json
[
  {
    "id": "milestone-001",
    "investor_id": "inv-001",
    "milestone_type": "investment",
    "title": "Inversión realizada",
    "description": "Capital de €250,000 transferido y verificado",
    "status": "completed",
    "due_date": "2024-11-15",
    "completed_date": "2024-11-15",
    "order_number": 1
  },
  {
    "id": "milestone-002",
    "investor_id": "inv-001",
    "milestone_type": "company_incorporation",
    "title": "Empresa constituida",
    "description": "Zhang Wei SRL registrada en Italia",
    "status": "completed",
    "due_date": "2024-12-02",
    "completed_date": "2024-12-02",
    "order_number": 2
  },
  {
    "id": "milestone-003",
    "investor_id": "inv-001",
    "milestone_type": "property_assignment",
    "title": "Activos asignados",
    "description": "Unidades 4B y 4C asignadas",
    "status": "completed",
    "due_date": "2024-12-15",
    "completed_date": "2024-12-15",
    "order_number": 3
  },
  {
    "id": "milestone-004",
    "investor_id": "inv-001",
    "milestone_type": "rental_year_1",
    "title": "Periodo de alquiler - Año 1 de 5",
    "description": "Mantenimiento de inversión y generación de rentabilidad",
    "status": "in_progress",
    "due_date": "2025-12-20",
    "completed_date": null,
    "order_number": 4
  },
  {
    "id": "milestone-005",
    "investor_id": "inv-001",
    "milestone_type": "residency_application",
    "title": "Aplicación de residencia",
    "description": "Solicitud formal de residencia italiana",
    "status": "pending",
    "due_date": "2025-06-15",
    "completed_date": null,
    "order_number": 5
  },
  {
    "id": "milestone-006",
    "investor_id": "inv-001",
    "milestone_type": "rental_years_2_4",
    "title": "Renovaciones años 2-4",
    "description": "Mantenimiento continuo de la inversión",
    "status": "pending",
    "due_date": "2028-12-20",
    "completed_date": null,
    "order_number": 6
  },
  {
    "id": "milestone-007",
    "investor_id": "inv-001",
    "milestone_type": "rental_year_5",
    "title": "Renovación final - Año 5",
    "description": "Año final de mantenimiento de inversión",
    "status": "pending",
    "due_date": "2029-12-20",
    "completed_date": null,
    "order_number": 7
  },
  {
    "id": "milestone-008",
    "investor_id": "inv-001",
    "milestone_type": "citizenship",
    "title": "Ciudadanía italiana",
    "description": "Obtención de la ciudadanía italiana",
    "status": "pending",
    "due_date": "2029-11-15",
    "completed_date": null,
    "order_number": 8
  }
]
```

### 6.6 Usuarios del Sistema

```json
[
  {
    "id": "user-admin-001",
    "email": "admin@stagfund.com",
    "role": "admin",
    "full_name": "María González"
  },
  {
    "id": "user-investor-001",
    "email": "zhang.wei@email.com",
    "role": "investor",
    "full_name": "Zhang Wei",
    "investor_id": "inv-001"
  }
  // ... más usuarios
]
```

---

## 7. SEGURIDAD Y COMPLIANCE

### 7.1 Autenticación
- **Supabase Auth** con email/password
- Hash de contraseñas con bcrypt
- Sesiones JWT con refresh tokens
- Rate limiting en login (max 5 intentos/minuto)

### 7.2 Autorización
- **Row Level Security (RLS)** en Supabase
- Policies por rol:
  - Inversores solo ven sus propios datos
  - Admins ven datos de su fondo
  - Super admins ven todo

```sql
-- Ejemplo de policy
CREATE POLICY "Investors can view own data"
ON investors
FOR SELECT
USING (auth.uid() = user_id);
```

### 7.3 Almacenamiento de Archivos
- **Supabase Storage** con buckets privados
- URL firmadas con expiración (1 hora)
- Límite de tamaño por archivo: 10MB
- Tipos de archivo permitidos: PDF, JPG, PNG, DOCX

### 7.4 GDPR Compliance
- Consentimiento explícito para procesamiento de datos
- Derecho a ser olvidado (anonimización de datos)
- Exportación de datos personales
- Logs de acceso y modificaciones
- Política de privacidad visible

### 7.5 Encriptación
- HTTPS en todas las comunicaciones
- Datos sensibles encriptados at-rest en Supabase
- API keys en variables de entorno

---

## 8. TESTING

### 8.1 Tipos de Tests

**Unit Tests (opcional para demo):**
- Funciones de utilidad
- Cálculos de rentabilidad
- Validaciones de formularios

**Integration Tests (opcional para demo):**
- Flujos de autenticación
- Operaciones CRUD con Supabase
- Generación de reportes

**E2E Tests (opcional para demo):**
- Flujo completo de onboarding
- Visualización de Golden Visa roadmap
- Asignación de propiedades

**Manual Testing (crítico):**
- Checklist de funcionalidades
- Testing cross-browser
- Testing responsive
- Testing de i18n (todos los idiomas)

### 8.2 Checklist de Testing Manual

```
AUTENTICACIÓN
☐ Login con credenciales válidas
☐ Login con credenciales inválidas
☐ Logout
☐ Recuperación de contraseña
☐ Redirección según rol (investor/admin)

PORTAL INVERSOR
☐ Dashboard carga correctamente
☐ KPIs muestran datos correctos
☐ Golden Visa Roadmap es interactivo
☐ Timeline se visualiza correctamente
☐ Click en hitos expande detalles
☐ Propiedades muestran información completa
☐ Galería de fotos funciona
☐ Sistema de documentos permite upload
☐ Documentos se pueden descargar
☐ Chat interno envía mensajes
☐ Reportes se pueden descargar
☐ Cambio de idioma funciona
☐ Todas las páginas son responsive

BACKOFFICE ADMIN
☐ Dashboard global muestra métricas
☐ Lista de inversores carga
☐ Detalle de inversor muestra todo
☐ Búsqueda y filtros funcionan
☐ Asignación de propiedades funciona
☐ Verificación de documentos funciona
☐ Generación de reportes funciona
☐ Analytics muestran gráficos
☐ Todas las páginas son responsive

INTERNACIONALIZACIÓN
☐ Todos los textos se traducen en EN
☐ Todos los textos se traducen en ES
☐ Todos los textos se traducen en IT
☐ Todos los textos se traducen en PT
☐ Todos los textos se traducen en ZH
☐ Formatos de fecha son correctos
☐ Símbolos de moneda son correctos

NAVEGADORES
☐ Chrome (última versión)
☐ Firefox (última versión)
☐ Safari (última versión)
☐ Edge (última versión)

DISPOSITIVOS
☐ Desktop (1920x1080)
☐ Laptop (1366x768)
☐ Tablet (768x1024)
☐ Mobile (375x667)
```

---

## 9. DEPLOYMENT

### 9.1 Entornos

**Development:**
- Local (localhost:3000)
- Supabase local instance (opcional)

**Staging:**
- Vercel preview deployment
- Supabase staging project

**Production:**
- Vercel production deployment
- Supabase production project
- Custom domain (TBD por STAG)

### 9.2 Variables de Entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# URLs
NEXT_PUBLIC_APP_URL=https://app.stagfund.com

# Features flags (para demo)
NEXT_PUBLIC_ENABLE_KYC_AUTO=false
NEXT_PUBLIC_ENABLE_WHATSAPP=false
NEXT_PUBLIC_ENABLE_2FA=false

# i18n
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

### 9.3 CI/CD

**Pipeline (Vercel automático):**
1. Push a GitHub
2. Vercel detecta cambio
3. Build automático
4. Deploy a preview (PRs)
5. Deploy a production (main branch)

### 9.4 Monitoreo (post-MVP)
- Vercel Analytics
- Supabase Dashboard
- Sentry para error tracking (opcional)

---

## 10. ENTREGABLES

### 10.1 Código Fuente
- Repositorio Git con código completo
- README con instrucciones de setup
- Documentación de arquitectura
- Scripts de seed de base de datos

### 10.2 Documentación
- Este documento de especificaciones funcionales
- Documento técnico para desarrolladores
- Guía de usuario (básica)
- Diagramas de arquitectura

### 10.3 Base de Datos
- Schema SQL completo
- Scripts de seed con datos mockup
- Backup de base de datos demo

### 10.4 Diseño
- Mockups de pantallas principales
- Guía de estilos (design system)
- Assets (logos, iconos, imágenes)

### 10.5 Presentación
- Demo funcional deployada
- URL de acceso (staging)
- Credenciales de prueba
- Video demo (opcional)
- Slides de presentación

---

## 11. ROADMAP POST-DEMO

### Fase 2: MVP Operativo (si aprobado)
- Onboarding real de inversores
- Integración KYC semiautomática (Onfido)
- Firma digital (Docusign)
- Generación de reportes con datos reales
- Sistema de notificaciones completo
- Multi-fondo

### Fase 3: Features Avanzados
- Matching automático de propiedades (algoritmo real)
- Portal para agencias de inmigración
- WhatsApp Business integration
- Mobile apps (iOS/Android)
- Property management completo
- Analytics avanzados con IA
- Predicciones de rentabilidad

### Fase 4: Escala
- Multi-país (España, Portugal, etc.)
- Blockchain para trazabilidad (opcional)
- Marketplace de propiedades secundarias
- API pública para integraciones

---

## 12. ANEXOS

### 12.1 Glosario de Términos

**Golden Visa:** Programa de residencia por inversión que permite a inversores extranjeros obtener ciudadanía.

**KYC (Know Your Customer):** Proceso de verificación de identidad del cliente.

**AML (Anti-Money Laundering):** Procedimientos anti-lavado de dinero.

**Real Estate (RE):** Bienes inmuebles / propiedades.

**I+D:** Investigación y Desarrollo.

**ROI (Return on Investment):** Retorno de inversión.

**NAV (Net Asset Value):** Valor neto de los activos.

**RLS (Row Level Security):** Seguridad a nivel de fila en base de datos.

### 12.2 Referencias Técnicas

**Next.js Documentation:** https://nextjs.org/docs  
**Supabase Documentation:** https://supabase.com/docs  
**Tailwind CSS:** https://tailwindcss.com/docs  
**Shadcn/ui:** https://ui.shadcn.com  
**i18next:** https://www.i18next.com

---

**FIN DEL DOCUMENTO**

---

Este documento debe ser revisado y aprobado antes de iniciar el desarrollo. Cualquier cambio en el alcance debe ser documentado y consensuado con el equipo.
