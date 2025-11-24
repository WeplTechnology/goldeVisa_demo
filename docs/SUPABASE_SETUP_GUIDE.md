# 🚀 GUÍA DE CONFIGURACIÓN DE SUPABASE
## Plataforma Golden Visa - STAG Fund Management

Esta guía te llevará paso a paso por la configuración completa de la base de datos en Supabase.

---

## ✅ PASO 0: Credenciales Configuradas

**Ya completado**:
- ✅ Proyecto Supabase creado: `goldenVisa`
- ✅ URL del proyecto: `https://nsfympzgzdfpiarflshb.supabase.co`
- ✅ Variables de entorno actualizadas en `.env.local`

---

## 📋 PASO 1: Configurar Autenticación

1. Abre tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard/project/nsfympzgzdfpiarflshb)

2. Ve a **Authentication** → **URL Configuration**

3. Configura las siguientes URLs:
   ```
   Site URL: http://localhost:3000
   ```

4. En **Redirect URLs**, agrega:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/admin/auth/callback
   ```

5. Ve a **Authentication** → **Providers** → **Email**
   - ✅ **Enable Email provider** (activar)
   - ❌ **Confirm email** (desactivar para demo)
   - ✅ **Secure email change** (activar)

6. Click **Save**

---

## 🗄️ PASO 2: Ejecutar Migraciones SQL

### Script 1: Tablas Base

1. Ve a **SQL Editor** en el dashboard de Supabase
2. Click en **New query**
3. Copia TODO el contenido del archivo: [`docs/sql/01_extensions_and_tables.sql`](sql/01_extensions_and_tables.sql)
4. Pega en el editor
5. Click **Run** (botón verde abajo a la derecha)
6. ✅ Verifica que se crearon 8 tablas:
   - funds
   - investors
   - properties
   - property_units
   - documents
   - golden_visa_milestones
   - reports
   - messages

### Script 2: Índices y Triggers

1. En **SQL Editor**, click **New query**
2. Copia TODO el contenido de: [`docs/sql/02_indexes_and_triggers.sql`](sql/02_indexes_and_triggers.sql)
3. Pega en el editor
4. Click **Run**
5. ✅ Verifica que se crearon los índices y triggers

### Script 3: Row Level Security (RLS)

1. En **SQL Editor**, click **New query**
2. Copia TODO el contenido de: [`docs/sql/03_rls_policies.sql`](sql/03_rls_policies.sql)
3. Pega en el editor
4. Click **Run**
5. ✅ Verifica que se crearon 21 políticas de seguridad

---

## 👥 PASO 3: Crear Usuarios de Prueba

### Usuario 1: Inversor (Zhang Wei)

1. Ve a **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Completa:
   ```
   Email: zhang.wei@email.com
   Password: Demo2024!
   Auto Confirm User: ✅ (IMPORTANTE: activar)
   ```
4. Click **Create user**
5. **📝 COPIA EL ID del usuario** (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
   - Lo necesitarás en el siguiente paso

### Usuario 2: Admin (STAG)

1. Click **Add user** → **Create new user**
2. Completa:
   ```
   Email: admin@stagfund.com
   Password: Admin2024!
   Auto Confirm User: ✅ (IMPORTANTE: activar)
   ```
3. Click **Create user**
4. Este usuario NO necesita estar vinculado a la tabla investors

---

## 📊 PASO 4: Insertar Datos Mockup

Ahora vamos a insertar datos de prueba. **IMPORTANTE**: Reemplaza `USER_ID_ZHANG_WEI` con el ID real que copiaste en el paso anterior.

### Insertar Fondo

En **SQL Editor**, ejecuta:

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

### Insertar Inversor Zhang Wei

**⚠️ IMPORTANTE**: Reemplaza `USER_ID_ZHANG_WEI` con el ID real del usuario creado.

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
  'USER_ID_ZHANG_WEI',  -- ⚠️ REEMPLAZAR CON EL ID REAL
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

### Insertar Propiedades

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

### Insertar Unidades de Propiedad

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

### Insertar Hitos del Golden Visa

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
  'rental_year_2',
  'Rental Period - Year 2 of 5',
  'Continue maintaining investment',
  'pending',
  '2026-12-20',
  NULL,
  6
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  'rental_year_3',
  'Rental Period - Year 3 of 5',
  'Continue maintaining investment',
  'pending',
  '2027-12-20',
  NULL,
  7
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  'citizenship',
  'Italian Citizenship',
  'Obtaining Italian citizenship after 5 years',
  'pending',
  '2029-11-15',
  NULL,
  8
);
```

### Verificar Datos Insertados

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
Golden Visa Milestones    8
```

---

## 🗂️ PASO 5: Configurar Storage

### Crear Bucket

1. Ve a **Storage** en el dashboard
2. Click **Create a new bucket**
3. Configura:
   ```
   Name: documents
   Public bucket: ❌ (desactivar - debe ser privado)
   Allowed MIME types: (dejar vacío)
   File size limit: 10 MB
   ```
4. Click **Create bucket**

### Aplicar Políticas de Storage

En **SQL Editor**, ejecuta:

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

---

## ✅ VERIFICACIÓN FINAL

Ejecuta este query para verificar que todo está correcto:

```sql
-- Verificar extensiones
SELECT extname FROM pg_extension WHERE extname = 'uuid-ossp';

-- Verificar tablas (deberías ver 8)
SELECT COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Verificar policies RLS (deberías ver 21)
SELECT COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public';

-- Verificar datos insertados
SELECT
  (SELECT COUNT(*) FROM funds) as funds,
  (SELECT COUNT(*) FROM investors) as investors,
  (SELECT COUNT(*) FROM properties) as properties,
  (SELECT COUNT(*) FROM property_units) as units,
  (SELECT COUNT(*) FROM golden_visa_milestones) as milestones;
```

**Resultado esperado:**
```
extname: uuid-ossp
total_tables: 8
total_policies: 21
funds: 1, investors: 1, properties: 2, units: 2, milestones: 8
```

---

## 🎉 ¡COMPLETADO!

Tu base de datos Supabase está completamente configurada con:

- ✅ 8 tablas principales
- ✅ 42 índices para optimización
- ✅ 21 políticas RLS para seguridad
- ✅ 5 triggers automáticos
- ✅ 2 usuarios de prueba
- ✅ Datos mockup completos
- ✅ Storage bucket configurado

### Credenciales de Prueba

**Inversor:**
- Email: `zhang.wei@email.com`
- Password: `Demo2024!`

**Admin:**
- Email: `admin@stagfund.com`
- Password: `Admin2024!`

---

## 🚀 Siguiente Paso

¡Ahora puedes continuar con el desarrollo de la aplicación!

Dile a tu asistente: **"Base de datos configurada, continuar con FASE 2"**
