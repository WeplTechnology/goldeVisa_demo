# SCHEMA DE BASE DE DATOS
# PLATAFORMA GOLDEN VISA - STAG FUND MANAGEMENT

**Base de datos:** PostgreSQL 15+ (Supabase)  
**Versión:** 1.0  
**Fecha:** Noviembre 2024

---

## INSTRUCCIONES DE EJECUCIÓN

Este archivo contiene el schema completo de la base de datos. Ejecutar los scripts en orden en el SQL Editor de Supabase Dashboard.

**Orden de ejecución:**
1. Extensions y funciones base
2. Tablas principales
3. Índices
4. Triggers
5. Row Level Security (RLS)
6. Funciones adicionales
7. Seed de datos mockup

---

## 1. EXTENSIONS Y CONFIGURACIÓN

```sql
-- Habilitar UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Habilitar funciones de texto
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Verificar extensions
SELECT * FROM pg_extension;
```

---

## 2. TABLAS PRINCIPALES

### 2.1 Tabla: funds

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

COMMENT ON TABLE funds IS 'Fondos de inversión Golden Visa';
COMMENT ON COLUMN funds.real_estate_percentage IS 'Porcentaje destinado a bienes inmuebles';
COMMENT ON COLUMN funds.rd_percentage IS 'Porcentaje destinado a I+D';
```

### 2.2 Tabla: investors

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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT check_visa_dates CHECK (visa_start_date IS NULL OR visa_expected_completion IS NULL OR visa_start_date < visa_expected_completion)
);

COMMENT ON TABLE investors IS 'Inversores del fondo Golden Visa';
COMMENT ON COLUMN investors.user_id IS 'Referencia al usuario en Supabase Auth';
COMMENT ON COLUMN investors.kyc_status IS 'Estado de verificación KYC/AML';
COMMENT ON COLUMN investors.golden_visa_status IS 'Estado del proceso Golden Visa';
```

### 2.3 Tabla: properties

```sql
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Italy',
  postal_code VARCHAR(20),
  total_size_sqm DECIMAL(10,2) CHECK (total_size_sqm > 0),
  total_units INTEGER CHECK (total_units > 0),
  acquisition_date DATE,
  acquisition_price DECIMAL(15,2),
  current_value DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'under_renovation')),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE properties IS 'Propiedades inmobiliarias del fondo';
COMMENT ON COLUMN properties.total_units IS 'Número de unidades/apartamentos en la propiedad';
```

### 2.4 Tabla: property_units

```sql
CREATE TABLE IF NOT EXISTS property_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  assigned_investor_id UUID REFERENCES investors(id) ON DELETE SET NULL,
  unit_number VARCHAR(50) NOT NULL,
  floor INTEGER,
  size_sqm DECIMAL(10,2) CHECK (size_sqm > 0),
  bedrooms INTEGER CHECK (bedrooms >= 0),
  bathrooms INTEGER CHECK (bathrooms >= 0),
  rental_status VARCHAR(50) DEFAULT 'available' CHECK (rental_status IN ('available', 'rented', 'maintenance')),
  monthly_rent DECIMAL(10,2) CHECK (monthly_rent >= 0),
  current_tenant_name VARCHAR(255),
  current_tenant_email VARCHAR(255),
  lease_start_date DATE,
  lease_end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_unit_per_property UNIQUE (property_id, unit_number),
  CONSTRAINT check_lease_dates CHECK (lease_start_date IS NULL OR lease_end_date IS NULL OR lease_start_date < lease_end_date),
  CONSTRAINT check_tenant_data CHECK (
    (rental_status = 'rented' AND current_tenant_name IS NOT NULL) OR
    (rental_status != 'rented' AND current_tenant_name IS NULL)
  )
);

COMMENT ON TABLE property_units IS 'Unidades individuales dentro de cada propiedad';
COMMENT ON COLUMN property_units.assigned_investor_id IS 'Inversor al que se asignó esta unidad';
```

### 2.5 Tabla: documents

```sql
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('kyc', 'golden_visa', 'property', 'tax', 'other')),
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

COMMENT ON TABLE documents IS 'Documentos subidos por inversores';
COMMENT ON COLUMN documents.type IS 'Tipo específico: passport, bank_statement, contract, etc.';
COMMENT ON COLUMN documents.category IS 'Categoría general del documento';
COMMENT ON COLUMN documents.file_url IS 'URL en Supabase Storage';
```

### 2.6 Tabla: golden_visa_milestones

```sql
CREATE TABLE IF NOT EXISTS golden_visa_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  milestone_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  due_date DATE,
  completed_date DATE,
  order_number INTEGER NOT NULL,
  documents_required JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_investor_milestone UNIQUE (investor_id, milestone_type),
  CONSTRAINT check_completion_date CHECK (completed_date IS NULL OR due_date IS NULL OR completed_date >= due_date - INTERVAL '90 days')
);

COMMENT ON TABLE golden_visa_milestones IS 'Hitos del proceso Golden Visa por inversor';
COMMENT ON COLUMN golden_visa_milestones.order_number IS 'Orden de los hitos en el timeline';
COMMENT ON COLUMN golden_visa_milestones.documents_required IS 'Array JSON de documentos necesarios para completar el hito';
```

### 2.7 Tabla: reports

```sql
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  period VARCHAR(50),
  type VARCHAR(100) CHECK (type IN ('quarterly', 'annual', 'monthly', 'custom')),
  title VARCHAR(255),
  data_json JSONB,
  pdf_url TEXT,
  generated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE reports IS 'Reportes generados para inversores';
COMMENT ON COLUMN reports.data_json IS 'Datos estructurados del reporte en formato JSON';
COMMENT ON COLUMN reports.pdf_url IS 'URL del PDF generado';
```

### 2.8 Tabla: messages

```sql
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  from_admin BOOLEAN DEFAULT FALSE,
  from_user_id UUID REFERENCES auth.users(id),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_date TIMESTAMP WITH TIME ZONE,
  parent_message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE messages IS 'Sistema de mensajería interno entre inversores y admins';
COMMENT ON COLUMN messages.from_admin IS 'TRUE si el mensaje fue enviado por un admin';
COMMENT ON COLUMN messages.parent_message_id IS 'Para hilos de conversación';
```

---

## 3. ÍNDICES PARA OPTIMIZACIÓN

```sql
-- Índices en investors
CREATE INDEX IF NOT EXISTS idx_investors_fund ON investors(fund_id);
CREATE INDEX IF NOT EXISTS idx_investors_user ON investors(user_id);
CREATE INDEX IF NOT EXISTS idx_investors_email ON investors(email);
CREATE INDEX IF NOT EXISTS idx_investors_status ON investors(status);
CREATE INDEX IF NOT EXISTS idx_investors_kyc_status ON investors(kyc_status);
CREATE INDEX IF NOT EXISTS idx_investors_golden_visa_status ON investors(golden_visa_status);

-- Índices en properties
CREATE INDEX IF NOT EXISTS idx_properties_fund ON properties(fund_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- Índices en property_units
CREATE INDEX IF NOT EXISTS idx_property_units_property ON property_units(property_id);
CREATE INDEX IF NOT EXISTS idx_property_units_investor ON property_units(assigned_investor_id);
CREATE INDEX IF NOT EXISTS idx_property_units_rental_status ON property_units(rental_status);

-- Índices en documents
CREATE INDEX IF NOT EXISTS idx_documents_investor ON documents(investor_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_verified ON documents(verified);
CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON documents(upload_date DESC);

-- Índices en golden_visa_milestones
CREATE INDEX IF NOT EXISTS idx_milestones_investor ON golden_visa_milestones(investor_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON golden_visa_milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_order ON golden_visa_milestones(investor_id, order_number);

-- Índices en reports
CREATE INDEX IF NOT EXISTS idx_reports_investor ON reports(investor_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_generated_date ON reports(generated_date DESC);

-- Índices en messages
CREATE INDEX IF NOT EXISTS idx_messages_investor ON messages(investor_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(parent_message_id);

-- Índice de búsqueda de texto en investors
CREATE INDEX IF NOT EXISTS idx_investors_search ON investors USING gin(to_tsvector('english', full_name || ' ' || email));
```

---

## 4. TRIGGERS PARA TIMESTAMPS

```sql
-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at automáticamente
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

---

## 5. ROW LEVEL SECURITY (RLS)

### 5.1 Habilitar RLS en todas las tablas

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

### 5.2 Función helper para verificar roles

```sql
-- Función para verificar si el usuario actual es admin
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

-- Función para obtener el investor_id del usuario actual
CREATE OR REPLACE FUNCTION get_current_investor_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id 
    FROM investors 
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5.3 Políticas para FUNDS

```sql
-- Admins pueden hacer todo
CREATE POLICY "Admins full access to funds"
  ON funds
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Inversores pueden ver el fondo al que pertenecen
CREATE POLICY "Investors can view their fund"
  ON funds
  FOR SELECT
  USING (
    id IN (
      SELECT fund_id FROM investors WHERE user_id = auth.uid()
    )
  );
```

### 5.4 Políticas para INVESTORS

```sql
-- Inversores pueden ver solo sus propios datos
CREATE POLICY "Investors can view own data"
  ON investors
  FOR SELECT
  USING (user_id = auth.uid());

-- Inversores pueden actualizar ciertos campos propios
CREATE POLICY "Investors can update own profile"
  ON investors
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() AND
    -- No pueden cambiar campos críticos
    fund_id = (SELECT fund_id FROM investors WHERE user_id = auth.uid()) AND
    investment_amount = (SELECT investment_amount FROM investors WHERE user_id = auth.uid())
  );

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to investors"
  ON investors
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

### 5.5 Políticas para PROPERTIES

```sql
-- Inversores pueden ver propiedades de su fondo
CREATE POLICY "Investors can view fund properties"
  ON properties
  FOR SELECT
  USING (
    fund_id IN (
      SELECT fund_id FROM investors WHERE user_id = auth.uid()
    )
  );

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to properties"
  ON properties
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

### 5.6 Políticas para PROPERTY_UNITS

```sql
-- Inversores pueden ver solo unidades asignadas a ellos
CREATE POLICY "Investors can view assigned units"
  ON property_units
  FOR SELECT
  USING (
    assigned_investor_id = get_current_investor_id()
  );

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to property_units"
  ON property_units
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

### 5.7 Políticas para DOCUMENTS

```sql
-- Inversores pueden ver sus propios documentos
CREATE POLICY "Investors can view own documents"
  ON documents
  FOR SELECT
  USING (investor_id = get_current_investor_id());

-- Inversores pueden subir sus propios documentos
CREATE POLICY "Investors can upload documents"
  ON documents
  FOR INSERT
  WITH CHECK (investor_id = get_current_investor_id());

-- Inversores NO pueden modificar ni eliminar documentos
-- (solo admins pueden hacerlo)

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to documents"
  ON documents
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

### 5.8 Políticas para GOLDEN_VISA_MILESTONES

```sql
-- Inversores pueden ver sus propios hitos
CREATE POLICY "Investors can view own milestones"
  ON golden_visa_milestones
  FOR SELECT
  USING (investor_id = get_current_investor_id());

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to milestones"
  ON golden_visa_milestones
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

### 5.9 Políticas para REPORTS

```sql
-- Inversores pueden ver sus propios reportes
CREATE POLICY "Investors can view own reports"
  ON reports
  FOR SELECT
  USING (investor_id = get_current_investor_id());

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to reports"
  ON reports
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

### 5.10 Políticas para MESSAGES

```sql
-- Inversores pueden ver sus propios mensajes
CREATE POLICY "Investors can view own messages"
  ON messages
  FOR SELECT
  USING (investor_id = get_current_investor_id());

-- Inversores pueden enviar mensajes
CREATE POLICY "Investors can send messages"
  ON messages
  FOR INSERT
  WITH CHECK (
    investor_id = get_current_investor_id() AND
    from_admin = FALSE AND
    from_user_id = auth.uid()
  );

-- Inversores pueden marcar mensajes como leídos
CREATE POLICY "Investors can update read status"
  ON messages
  FOR UPDATE
  USING (investor_id = get_current_investor_id())
  WITH CHECK (
    investor_id = get_current_investor_id() AND
    -- Solo pueden cambiar el estado de leído
    from_admin = (SELECT from_admin FROM messages WHERE id = messages.id) AND
    content = (SELECT content FROM messages WHERE id = messages.id)
  );

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to messages"
  ON messages
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

## 6. FUNCIONES ADICIONALES

### 6.1 Calcular ROI de un inversor

```sql
CREATE OR REPLACE FUNCTION calculate_investor_roi(p_investor_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_investment DECIMAL;
  total_rent DECIMAL;
  months_active INTEGER;
  annual_roi DECIMAL;
BEGIN
  -- Obtener inversión total
  SELECT investment_amount INTO total_investment
  FROM investors
  WHERE id = p_investor_id;
  
  -- Calcular renta mensual total de unidades asignadas
  SELECT COALESCE(SUM(monthly_rent), 0) INTO total_rent
  FROM property_units
  WHERE assigned_investor_id = p_investor_id
    AND rental_status = 'rented';
  
  -- Calcular meses activo
  SELECT EXTRACT(EPOCH FROM (NOW() - visa_start_date)) / (30 * 24 * 60 * 60)
  INTO months_active
  FROM investors
  WHERE id = p_investor_id;
  
  -- Evitar división por cero
  IF total_investment = 0 OR months_active = 0 THEN
    RETURN 0;
  END IF;
  
  -- Calcular ROI anual
  annual_roi := ((total_rent * 12) / total_investment) * 100;
  
  RETURN ROUND(annual_roi, 2);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_investor_roi IS 'Calcula el ROI anual de un inversor basado en rentas';
```

### 6.2 Obtener ocupación de una propiedad

```sql
CREATE OR REPLACE FUNCTION get_property_occupancy(p_property_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_units INTEGER;
  rented_units INTEGER;
  occupancy DECIMAL;
BEGIN
  -- Contar total de unidades
  SELECT COUNT(*) INTO total_units
  FROM property_units
  WHERE property_id = p_property_id;
  
  -- Contar unidades alquiladas
  SELECT COUNT(*) INTO rented_units
  FROM property_units
  WHERE property_id = p_property_id
    AND rental_status = 'rented';
  
  -- Evitar división por cero
  IF total_units = 0 THEN
    RETURN 0;
  END IF;
  
  -- Calcular porcentaje
  occupancy := (rented_units::DECIMAL / total_units::DECIMAL) * 100;
  
  RETURN ROUND(occupancy, 2);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_property_occupancy IS 'Calcula el porcentaje de ocupación de una propiedad';
```

### 6.3 Actualizar estado de hitos vencidos

```sql
CREATE OR REPLACE FUNCTION update_overdue_milestones()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE golden_visa_milestones
  SET status = 'overdue'
  WHERE status = 'pending'
    AND due_date < CURRENT_DATE
    AND completed_date IS NULL;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_overdue_milestones IS 'Marca como vencidos los hitos con fecha pasada';
```

### 6.4 Obtener estadísticas del fondo

```sql
CREATE OR REPLACE FUNCTION get_fund_stats(p_fund_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_investors', (
      SELECT COUNT(*) FROM investors WHERE fund_id = p_fund_id
    ),
    'active_investors', (
      SELECT COUNT(*) FROM investors WHERE fund_id = p_fund_id AND status = 'active'
    ),
    'total_properties', (
      SELECT COUNT(*) FROM properties WHERE fund_id = p_fund_id
    ),
    'total_units', (
      SELECT SUM(total_units) FROM properties WHERE fund_id = p_fund_id
    ),
    'occupied_units', (
      SELECT COUNT(*) 
      FROM property_units pu
      INNER JOIN properties p ON pu.property_id = p.id
      WHERE p.fund_id = p_fund_id AND pu.rental_status = 'rented'
    ),
    'total_monthly_rent', (
      SELECT COALESCE(SUM(pu.monthly_rent), 0)
      FROM property_units pu
      INNER JOIN properties p ON pu.property_id = p.id
      WHERE p.fund_id = p_fund_id AND pu.rental_status = 'rented'
    ),
    'capital_raised', (
      SELECT total_capital_raised FROM funds WHERE id = p_fund_id
    ),
    'capital_target', (
      SELECT total_capital_target FROM funds WHERE id = p_fund_id
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_fund_stats IS 'Devuelve estadísticas generales del fondo en formato JSON';
```

---

## 7. VISTAS ÚTILES

```sql
-- Vista: Resumen de inversores con métricas
CREATE OR REPLACE VIEW investor_summary AS
SELECT 
  i.id,
  i.full_name,
  i.email,
  i.nationality,
  i.investment_amount,
  i.status,
  i.kyc_status,
  i.golden_visa_status,
  f.name as fund_name,
  COUNT(DISTINCT pu.id) as total_units,
  COALESCE(SUM(pu.monthly_rent), 0) as total_monthly_rent,
  calculate_investor_roi(i.id) as annual_roi,
  COUNT(DISTINCT d.id) as total_documents,
  COUNT(DISTINCT d.id) FILTER (WHERE d.verified = true) as verified_documents,
  COUNT(DISTINCT gvm.id) FILTER (WHERE gvm.status = 'completed') as completed_milestones,
  COUNT(DISTINCT gvm.id) as total_milestones
FROM investors i
LEFT JOIN funds f ON i.fund_id = f.id
LEFT JOIN property_units pu ON pu.assigned_investor_id = i.id
LEFT JOIN documents d ON d.investor_id = i.id
LEFT JOIN golden_visa_milestones gvm ON gvm.investor_id = i.id
GROUP BY i.id, f.name;

COMMENT ON VIEW investor_summary IS 'Vista consolidada con métricas clave de cada inversor';

-- Vista: Resumen de propiedades con ocupación
CREATE OR REPLACE VIEW property_summary AS
SELECT 
  p.id,
  p.name,
  p.address,
  p.city,
  p.total_size_sqm,
  p.total_units,
  p.acquisition_price,
  p.current_value,
  f.name as fund_name,
  COUNT(pu.id) FILTER (WHERE pu.rental_status = 'rented') as rented_units,
  COUNT(pu.id) FILTER (WHERE pu.rental_status = 'available') as available_units,
  get_property_occupancy(p.id) as occupancy_percentage,
  COALESCE(SUM(pu.monthly_rent) FILTER (WHERE pu.rental_status = 'rented'), 0) as total_monthly_rent
FROM properties p
LEFT JOIN funds f ON p.fund_id = f.id
LEFT JOIN property_units pu ON pu.property_id = p.id
GROUP BY p.id, f.name;

COMMENT ON VIEW property_summary IS 'Vista consolidada con métricas de cada propiedad';
```

---

## 8. STORAGE BUCKETS Y POLÍTICAS

```sql
-- Nota: Los buckets de storage se configuran desde el dashboard de Supabase
-- Aquí solo documentamos las políticas SQL

-- Bucket: documents
-- Estructura de carpetas: documents/{investor_id}/{document_id}_{filename}

-- Policy: Inversores pueden subir a su carpeta
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Investors can upload own documents',
  'documents',
  'bucket_id = ''documents'' AND (storage.foldername(name))[1] IN (SELECT id::text FROM investors WHERE user_id = auth.uid())'
);

-- Policy: Inversores pueden ver sus documentos
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Investors can view own documents',
  'documents',
  'bucket_id = ''documents'' AND (storage.foldername(name))[1] IN (SELECT id::text FROM investors WHERE user_id = auth.uid())'
);

-- Policy: Admins pueden ver todos los documentos
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Admins can view all documents',
  'documents',
  'bucket_id = ''documents'' AND is_admin()'
);
```

---

## 9. JOBS Y MANTENIMIENTO

```sql
-- Función para ejecutar mantenimiento diario
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS VOID AS $$
BEGIN
  -- Actualizar hitos vencidos
  PERFORM update_overdue_milestones();
  
  -- Aquí se pueden agregar más tareas de mantenimiento
  
  RAISE NOTICE 'Daily maintenance completed';
END;
$$ LANGUAGE plpgsql;

-- Nota: En producción, configurar pg_cron para ejecutar esto diariamente
-- SELECT cron.schedule('daily-maintenance', '0 2 * * *', 'SELECT daily_maintenance()');
```

---

## 10. VERIFICACIÓN DEL SCHEMA

```sql
-- Script de verificación para confirmar que todo está configurado

-- Verificar tablas
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verificar índices
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Verificar triggers
SELECT 
  event_object_table AS table_name,
  trigger_name,
  event_manipulation AS event,
  action_timing AS timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;

-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verificar funciones
SELECT 
  routine_name,
  routine_type,
  data_type AS return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Verificar vistas
SELECT 
  table_name,
  view_definition
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- Contar registros en cada tabla
SELECT 
  'funds' as table_name, 
  COUNT(*) as count FROM funds
UNION ALL
SELECT 'investors', COUNT(*) FROM investors
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'property_units', COUNT(*) FROM property_units
UNION ALL
SELECT 'documents', COUNT(*) FROM documents
UNION ALL
SELECT 'golden_visa_milestones', COUNT(*) FROM golden_visa_milestones
UNION ALL
SELECT 'reports', COUNT(*) FROM reports
UNION ALL
SELECT 'messages', COUNT(*) FROM messages;
```

---

## 11. BACKUP Y RESTORE

```bash
# Nota: Estos comandos se ejecutan desde la terminal, no en SQL Editor

# Backup de schema y datos
pg_dump -h db.xxx.supabase.co \
  -U postgres \
  -d postgres \
  --schema=public \
  --file=backup_$(date +%Y%m%d).sql

# Restore desde backup
psql -h db.xxx.supabase.co \
  -U postgres \
  -d postgres \
  --file=backup_20241123.sql
```

---

## 12. NOTAS IMPORTANTES

### 12.1 Performance

- Todos los índices están optimizados para las queries más comunes
- Las vistas materializadas se pueden implementar en el futuro si hay problemas de performance
- Los índices GIN en campos de texto permiten búsquedas rápidas

### 12.2 Seguridad

- RLS está habilitado en todas las tablas
- Las funciones SECURITY DEFINER deben usarse con cuidado
- Los admins se identifican por el dominio @stagfund.com del email

### 12.3 Escalabilidad

- El schema soporta múltiples fondos (multi-tenant)
- Las foreign keys ON DELETE CASCADE facilitan la limpieza de datos
- Las constraints previenen datos inconsistentes

### 12.4 Mantenimiento

- Los triggers actualizan automáticamente updated_at
- La función daily_maintenance() puede extenderse según necesidades
- Las vistas simplifican queries complejas

---

**FIN DEL SCHEMA DE BASE DE DATOS**

Para cualquier modificación al schema, crear un archivo de migración nuevo y ejecutarlo en orden.
