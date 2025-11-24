-- Documents table for storing document metadata
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  fund_id UUID NOT NULL REFERENCES funds(id),

  -- Document details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('identity', 'financial', 'property', 'legal', 'other')),
  document_type VARCHAR(50) NOT NULL, -- passport, bank_statement, property_title, etc.

  -- File information
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL, -- Supabase Storage path
  file_size INTEGER NOT NULL, -- in bytes
  file_type VARCHAR(100) NOT NULL, -- MIME type

  -- Status and verification
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verification_status VARCHAR(50) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'rejected')),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,

  -- Metadata
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- For Golden Visa checklist tracking
  is_required BOOLEAN DEFAULT FALSE,
  requirement_type VARCHAR(100), -- 'passport', 'proof_of_investment', 'criminal_record', etc.

  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT documents_investor_fund_fk FOREIGN KEY (investor_id, fund_id)
    REFERENCES investors(id, fund_id)
);

-- Indexes for better query performance
CREATE INDEX idx_documents_investor_id ON documents(investor_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_fund_id ON documents(fund_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_category ON documents(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_status ON documents(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_uploaded_at ON documents(uploaded_at DESC) WHERE deleted_at IS NULL;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_updated_at_trigger
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();

-- Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Investors can view their own documents
CREATE POLICY "Investors can view own documents"
  ON documents FOR SELECT
  USING (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
  );

-- Policy: Investors can insert their own documents
CREATE POLICY "Investors can upload documents"
  ON documents FOR INSERT
  WITH CHECK (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
    AND uploaded_by = auth.uid()
  );

-- Policy: Investors can update their own pending documents
CREATE POLICY "Investors can update own pending documents"
  ON documents FOR UPDATE
  USING (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
    AND status = 'pending'
  )
  WITH CHECK (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
  );

-- Policy: Investors can soft delete their own documents
CREATE POLICY "Investors can delete own documents"
  ON documents FOR UPDATE
  USING (
    investor_id IN (
      SELECT id FROM investors WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (deleted_at IS NOT NULL);

-- Policy: Admins can view all documents
CREATE POLICY "Admins can view all documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- Policy: Admins can update any document
CREATE POLICY "Admins can update documents"
  ON documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- Policy: Admins can delete any document
CREATE POLICY "Admins can delete documents"
  ON documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- Create storage bucket for documents (run this in Supabase SQL Editor)
-- Note: Storage buckets must be created via Supabase Dashboard or Storage API
-- This is just for reference:
/*
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);
*/

-- Storage RLS policies (reference - must be applied in Supabase Dashboard)
/*
-- Policy: Users can upload their own documents
CREATE POLICY "Users can upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can view their own documents
CREATE POLICY "Users can view own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete own documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Admins can access all documents
CREATE POLICY "Admins can access all documents"
  ON storage.objects
  USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );
*/

-- Insert sample documents for demo investor (Zhang Wei)
DO $$
DECLARE
  demo_investor_id UUID;
  demo_fund_id UUID;
  demo_user_id UUID;
BEGIN
  -- Get demo investor ID
  SELECT id, fund_id, user_id INTO demo_investor_id, demo_fund_id, demo_user_id
  FROM investors
  WHERE email = 'zhang.wei@example.com'
  LIMIT 1;

  IF demo_investor_id IS NOT NULL THEN
    -- Insert sample documents
    INSERT INTO documents (
      investor_id, fund_id, name, description, category, document_type,
      file_name, file_path, file_size, file_type, status, verification_status,
      uploaded_by, is_required, requirement_type
    ) VALUES
    (
      demo_investor_id, demo_fund_id, 'Passport - Zhang Wei',
      'Valid Chinese passport',
      'identity', 'passport',
      'passport_zhang_wei.pdf',
      demo_user_id || '/identity/passport_zhang_wei.pdf',
      2457600, 'application/pdf',
      'approved', 'verified',
      demo_user_id, TRUE, 'passport'
    ),
    (
      demo_investor_id, demo_fund_id, 'Bank Statement Q4 2024',
      'Bank statement showing proof of funds',
      'financial', 'bank_statement',
      'bank_statement_q4_2024.pdf',
      demo_user_id || '/financial/bank_statement_q4_2024.pdf',
      1887436, 'application/pdf',
      'approved', 'verified',
      demo_user_id, TRUE, 'proof_of_funds'
    ),
    (
      demo_investor_id, demo_fund_id, 'Investment Certificate',
      'Certificate of €250,000 investment in STAG Fund',
      'financial', 'investment_certificate',
      'investment_certificate.pdf',
      demo_user_id || '/financial/investment_certificate.pdf',
      943718, 'application/pdf',
      'approved', 'verified',
      demo_user_id, TRUE, 'proof_of_investment'
    ),
    (
      demo_investor_id, demo_fund_id, 'Property Title - Unit 4B',
      'Property ownership document for Edifício Cascais Unit 4B',
      'property', 'property_title',
      'property_title_unit_4b.pdf',
      demo_user_id || '/property/property_title_unit_4b.pdf',
      3355443, 'application/pdf',
      'approved', 'verified',
      demo_user_id, TRUE, 'property_title'
    ),
    (
      demo_investor_id, demo_fund_id, 'Utility Bill - December',
      'Recent utility bill for proof of residence',
      'other', 'utility_bill',
      'utility_bill_december.pdf',
      demo_user_id || '/other/utility_bill_december.pdf',
      419430, 'application/pdf',
      'pending', 'unverified',
      demo_user_id, TRUE, 'proof_of_residence'
    ),
    (
      demo_investor_id, demo_fund_id, 'Proof of Residence',
      'Official residence certificate',
      'legal', 'residence_certificate',
      'proof_of_residence.pdf',
      demo_user_id || '/legal/proof_of_residence.pdf',
      1153433, 'application/pdf',
      'pending', 'unverified',
      demo_user_id, TRUE, 'proof_of_residence'
    );
  END IF;
END $$;
