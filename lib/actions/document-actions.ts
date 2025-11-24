'use server'

import { createClient } from '@/lib/supabase/server'

export interface DocumentData {
  id: string
  investor_id: string
  fund_id: string
  name: string
  description: string | null
  category: 'identity' | 'financial' | 'property' | 'legal' | 'other'
  document_type: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  status: 'pending' | 'approved' | 'rejected'
  verification_status: 'unverified' | 'verified' | 'rejected'
  verified_by: string | null
  verified_at: string | null
  verification_notes: string | null
  uploaded_by: string
  uploaded_at: string
  updated_at: string
  is_required: boolean
  requirement_type: string | null
}

/**
 * Get all documents for the current investor
 */
export async function getInvestorDocuments(): Promise<DocumentData[]> {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Error getting user:', userError)
    return []
  }

  // Get investor ID
  const { data: investor } = await supabase
    .from('investors')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!investor) {
    return []
  }

  // Get documents
  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .eq('investor_id', investor.id)
    .is('deleted_at', null)
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.error('Error getting documents:', error)
    return []
  }

  return documents || []
}

/**
 * Get documents by category
 */
export async function getDocumentsByCategory(
  category: 'identity' | 'financial' | 'property' | 'legal' | 'other'
): Promise<DocumentData[]> {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Error getting user:', userError)
    return []
  }

  const { data: investor } = await supabase
    .from('investors')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!investor) {
    return []
  }

  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .eq('investor_id', investor.id)
    .eq('category', category)
    .is('deleted_at', null)
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.error('Error getting documents by category:', error)
    return []
  }

  return documents || []
}

/**
 * Get document statistics
 */
export async function getDocumentStats() {
  const documents = await getInvestorDocuments()

  return {
    total: documents.length,
    approved: documents.filter(d => d.status === 'approved').length,
    pending: documents.filter(d => d.status === 'pending').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
    byCategory: {
      identity: documents.filter(d => d.category === 'identity').length,
      financial: documents.filter(d => d.category === 'financial').length,
      property: documents.filter(d => d.category === 'property').length,
      legal: documents.filter(d => d.category === 'legal').length,
      other: documents.filter(d => d.category === 'other').length,
    }
  }
}

/**
 * Upload a new document
 * Note: File upload to storage must be done on client side
 * This function only creates the database record
 */
export async function createDocumentRecord(documentData: {
  name: string
  description?: string
  category: 'identity' | 'financial' | 'property' | 'legal' | 'other'
  document_type: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  is_required?: boolean
  requirement_type?: string
}): Promise<{ success: boolean; error?: string; document?: DocumentData }> {
  const supabase = await createClient()

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Get investor data
    const { data: investor, error: investorError } = await supabase
      .from('investors')
      .select('id, fund_id')
      .eq('user_id', user.id)
      .single()

    if (investorError || !investor) {
      return { success: false, error: 'Investor not found' }
    }

    // Create document record
    const { data: document, error: insertError } = await supabase
      .from('documents')
      .insert({
        investor_id: investor.id,
        fund_id: investor.fund_id,
        uploaded_by: user.id,
        ...documentData
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating document:', insertError)
      return { success: false, error: insertError.message }
    }

    return { success: true, document }
  } catch (error: any) {
    console.error('Error in createDocumentRecord:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Soft delete a document
 */
export async function deleteDocument(documentId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Get investor ID
    const { data: investor } = await supabase
      .from('investors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!investor) {
      return { success: false, error: 'Investor not found' }
    }

    // Verify document belongs to investor
    const { data: document } = await supabase
      .from('documents')
      .select('id, investor_id, file_path')
      .eq('id', documentId)
      .eq('investor_id', investor.id)
      .single()

    if (!document) {
      return { success: false, error: 'Document not found or access denied' }
    }

    // Soft delete the document record
    const { error: deleteError } = await supabase
      .from('documents')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', documentId)

    if (deleteError) {
      console.error('Error deleting document:', deleteError)
      return { success: false, error: deleteError.message }
    }

    // Note: File deletion from storage should be done separately
    // This can be handled via a database trigger or scheduled job

    return { success: true }
  } catch (error: any) {
    console.error('Error in deleteDocument:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get a signed URL for downloading a document
 */
export async function getDocumentDownloadUrl(documentId: string): Promise<{
  success: boolean
  url?: string
  error?: string
}> {
  const supabase = await createClient()

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Get investor ID
    const { data: investor } = await supabase
      .from('investors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!investor) {
      return { success: false, error: 'Investor not found' }
    }

    // Get document and verify ownership
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', documentId)
      .eq('investor_id', investor.id)
      .single()

    if (docError || !document) {
      return { success: false, error: 'Document not found or access denied' }
    }

    // Generate signed URL (valid for 60 seconds)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('documents')
      .createSignedUrl(document.file_path, 60)

    if (urlError) {
      console.error('Error creating signed URL:', urlError)
      return { success: false, error: urlError.message }
    }

    return { success: true, url: urlData.signedUrl }
  } catch (error: any) {
    console.error('Error in getDocumentDownloadUrl:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get required documents checklist
 */
export async function getRequiredDocumentsChecklist() {
  const supabase = await createClient()

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return []
    }

    const { data: investor } = await supabase
      .from('investors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!investor) {
      return []
    }

    // Define required document types
    const requiredTypes = [
      { type: 'passport', title: 'Valid Passport', category: 'identity' },
      { type: 'proof_of_investment', title: 'Proof of Investment (€250,000)', category: 'financial' },
      { type: 'criminal_record', title: 'Criminal Record Certificate', category: 'legal' },
      { type: 'property_title', title: 'Property Title Documents', category: 'property' },
      { type: 'proof_of_residence', title: 'Proof of Residence', category: 'legal' },
      { type: 'utility_bill', title: 'Utility Bill (Recent)', category: 'other' },
      { type: 'health_insurance', title: 'Health Insurance Certificate', category: 'other' },
      { type: 'birth_certificate', title: 'Birth Certificate', category: 'identity' },
    ]

    // Get all documents
    const { data: documents } = await supabase
      .from('documents')
      .select('requirement_type, status')
      .eq('investor_id', investor.id)
      .is('deleted_at', null)

    // Map checklist with status
    const checklist = requiredTypes.map(req => {
      const doc = documents?.find(d => d.requirement_type === req.type)
      return {
        ...req,
        status: doc ? (doc.status === 'approved' ? 'completed' : 'pending') : 'missing'
      }
    })

    return checklist
  } catch (error) {
    console.error('Error getting checklist:', error)
    return []
  }
}

