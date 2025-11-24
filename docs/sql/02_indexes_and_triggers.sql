-- =====================================================
-- SCRIPT 2: ÍNDICES Y TRIGGERS
-- PLATAFORMA GOLDEN VISA - STAG FUND MANAGEMENT
-- =====================================================
-- Ejecutar DESPUÉS del Script 1

-- 1. ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

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


-- 2. TRIGGERS PARA ACTUALIZAR TIMESTAMPS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
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


-- VERIFICACIÓN
-- =====================================================

-- Ver índices creados
SELECT
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Ver triggers creados
SELECT
  event_object_table AS table_name,
  trigger_name
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
