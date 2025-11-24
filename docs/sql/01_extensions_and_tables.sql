-- =====================================================
-- SCRIPT 1: EXTENSIONS Y TABLAS BASE
-- PLATAFORMA GOLDEN VISA - STAG FUND MANAGEMENT
-- =====================================================
-- Ejecutar este script primero en Supabase SQL Editor

-- 1. EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verificar que la extensión se creó
SELECT extname, extversion FROM pg_extension WHERE extname = 'uuid-ossp';


-- 2. TABLA: funds
-- =====================================================
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


-- 3. TABLA: investors
-- =====================================================
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

COMMENT ON TABLE investors IS 'Inversores del fondo Golden Visa';


-- 4. TABLA: properties
-- =====================================================
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

COMMENT ON TABLE properties IS 'Propiedades inmobiliarias del fondo';


-- 5. TABLA: property_units
-- =====================================================
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

COMMENT ON TABLE property_units IS 'Unidades individuales dentro de cada propiedad';


-- 6. TABLA: documents
-- =====================================================
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

COMMENT ON TABLE documents IS 'Documentos subidos por inversores';


-- 7. TABLA: golden_visa_milestones
-- =====================================================
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

COMMENT ON TABLE golden_visa_milestones IS 'Hitos del proceso Golden Visa por inversor';


-- 8. TABLA: reports
-- =====================================================
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

COMMENT ON TABLE reports IS 'Reportes generados para inversores';


-- 9. TABLA: messages
-- =====================================================
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

COMMENT ON TABLE messages IS 'Sistema de mensajería interno entre inversores y admins';


-- VERIFICACIÓN: Listar todas las tablas creadas
-- =====================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Deberías ver: documents, funds, golden_visa_milestones, investors, messages, properties, property_units, reports
