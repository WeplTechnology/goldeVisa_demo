-- =====================================================
-- SCRIPT 3: ROW LEVEL SECURITY (RLS)
-- PLATAFORMA GOLDEN VISA - STAG FUND MANAGEMENT
-- =====================================================
-- Ejecutar DESPUÉS del Script 2

-- 1. HABILITAR RLS EN TODAS LAS TABLAS
-- =====================================================
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE golden_visa_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;


-- 2. FUNCIONES HELPER
-- =====================================================

-- Función para verificar si el usuario es admin (email @stagfund.com)
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


-- 3. POLICIES PARA FUNDS
-- =====================================================

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


-- 4. POLICIES PARA INVESTORS
-- =====================================================

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


-- 5. POLICIES PARA PROPERTIES
-- =====================================================

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


-- 6. POLICIES PARA PROPERTY_UNITS
-- =====================================================

-- Inversores pueden ver solo unidades asignadas a ellos
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


-- 7. POLICIES PARA DOCUMENTS
-- =====================================================

-- Inversores pueden ver sus propios documentos
CREATE POLICY "Investors can view own documents"
  ON documents
  FOR SELECT
  USING (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
  );

-- Inversores pueden subir sus propios documentos
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


-- 8. POLICIES PARA GOLDEN_VISA_MILESTONES
-- =====================================================

-- Inversores pueden ver sus propios hitos
CREATE POLICY "Investors can view own milestones"
  ON golden_visa_milestones
  FOR SELECT
  USING (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
  );

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to milestones"
  ON golden_visa_milestones
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());


-- 9. POLICIES PARA REPORTS
-- =====================================================

-- Inversores pueden ver sus propios reportes
CREATE POLICY "Investors can view own reports"
  ON reports
  FOR SELECT
  USING (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
  );

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to reports"
  ON reports
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());


-- 10. POLICIES PARA MESSAGES
-- =====================================================

-- Inversores pueden ver sus propios mensajes
CREATE POLICY "Investors can view own messages"
  ON messages
  FOR SELECT
  USING (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
  );

-- Inversores pueden enviar mensajes
CREATE POLICY "Investors can send messages"
  ON messages
  FOR INSERT
  WITH CHECK (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    ) AND
    from_admin = FALSE
  );

-- Inversores pueden marcar mensajes como leídos
CREATE POLICY "Investors can update read status"
  ON messages
  FOR UPDATE
  USING (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
  );

-- Admins pueden hacer todo
CREATE POLICY "Admins full access to messages"
  ON messages
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());


-- VERIFICACIÓN
-- =====================================================

-- Ver todas las políticas RLS creadas
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Deberías ver 21 políticas en total
