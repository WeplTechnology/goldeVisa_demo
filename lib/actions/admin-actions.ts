'use server'

import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/utils/auth-helpers'

/**
 * Verify user is admin before executing any admin action
 */
async function verifyAdminAccess() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { authorized: false, error: 'Not authenticated' }
  }

  if (!isAdminEmail(user.email)) {
    return { authorized: false, error: 'Not authorized' }
  }

  return { authorized: true, supabase, user }
}

/**
 * Get all investors with their investments
 */
export async function getAllInvestors() {
  try {
    const { authorized, supabase, error } = await verifyAdminAccess()
    if (!authorized) {
      console.error('Admin access denied:', error)
      return []
    }

    const { data: investors, error: investorsError } = await supabase!
      .from('investors')
      .select(`
        *,
        investments (
          id,
          amount,
          investment_date,
          status
        )
      `)
      .order('created_at', { ascending: false })

    if (investorsError) {
      console.error('Error fetching investors:', investorsError)
      return []
    }

    return investors || []
  } catch (error) {
    console.error('Exception fetching investors:', error)
    return []
  }
}

/**
 * Get investor by ID (admin view)
 */
export async function getInvestorById(investorId: string) {
  try {
    const { authorized, supabase, error } = await verifyAdminAccess()
    if (!authorized) {
      return { success: false, error }
    }

    const { data: investor, error: investorError } = await supabase!
      .from('investors')
      .select(`
        *,
        investments (
          id,
          fund_id,
          amount,
          investment_date,
          status,
          funds (
            name,
            description
          )
        ),
        golden_visa_applications (
          id,
          status,
          application_date,
          approval_date,
          current_step
        )
      `)
      .eq('id', investorId)
      .single()

    if (investorError) {
      console.error('Error fetching investor:', investorError)
      return { success: false, error: investorError.message }
    }

    return { success: true, investor }
  } catch (error: any) {
    console.error('Exception fetching investor:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get all investments across all investors
 */
export async function getAllInvestments() {
  try {
    const { authorized, supabase, error } = await verifyAdminAccess()
    if (!authorized) {
      console.error('Admin access denied:', error)
      return []
    }

    const { data: investments, error: investmentsError } = await supabase!
      .from('investments')
      .select(`
        *,
        investor:investors (
          id,
          full_name,
          email
        ),
        fund:funds (
          id,
          name,
          target_amount
        )
      `)
      .order('investment_date', { ascending: false })

    if (investmentsError) {
      console.error('Error fetching investments:', investmentsError)
      return []
    }

    return investments || []
  } catch (error) {
    console.error('Exception fetching investments:', error)
    return []
  }
}

/**
 * Get all Golden Visa applications
 */
export async function getAllGoldenVisaApplications() {
  try {
    const { authorized, supabase, error } = await verifyAdminAccess()
    if (!authorized) {
      console.error('Admin access denied:', error)
      return []
    }

    const { data: applications, error: applicationsError } = await supabase!
      .from('golden_visa_applications')
      .select(`
        *,
        investor:investors (
          id,
          full_name,
          email,
          nationality
        )
      `)
      .order('application_date', { ascending: false })

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError)
      return []
    }

    return applications || []
  } catch (error) {
    console.error('Exception fetching applications:', error)
    return []
  }
}

/**
 * Get all documents from all investors
 */
export async function getAllDocuments() {
  try {
    const { authorized, supabase, error } = await verifyAdminAccess()
    if (!authorized) {
      console.error('Admin access denied:', error)
      return []
    }

    const { data: documents, error: documentsError } = await supabase!
      .from('documents')
      .select(`
        *,
        investor:investors (
          id,
          full_name,
          email
        )
      `)
      .is('deleted_at', null)
      .order('uploaded_at', { ascending: false })

    if (documentsError) {
      console.error('Error fetching documents:', documentsError)
      return []
    }

    return documents || []
  } catch (error) {
    console.error('Exception fetching documents:', error)
    return []
  }
}

/**
 * Update document verification status (admin only)
 */
export async function updateDocumentStatus(
  documentId: string,
  status: 'approved' | 'rejected',
  notes?: string
) {
  try {
    const { authorized, supabase, user, error } = await verifyAdminAccess()
    if (!authorized) {
      return { success: false, error }
    }

    const { error: updateError } = await supabase!
      .from('documents')
      .update({
        status,
        verification_notes: notes,
        verified_by: user!.email,
        verified_at: new Date().toISOString()
      })
      .eq('id', documentId)

    if (updateError) {
      console.error('Error updating document status:', updateError)
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Exception updating document status:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get platform statistics for admin dashboard
 */
export async function getAdminStats() {
  try {
    const { authorized, supabase, error } = await verifyAdminAccess()
    if (!authorized) {
      return {
        totalInvestors: 0,
        totalInvestments: 0,
        totalCapital: 0,
        activeVisaApplications: 0,
        pendingDocuments: 0
      }
    }

    // Get total investors
    const { count: investorsCount } = await supabase!
      .from('investors')
      .select('*', { count: 'exact', head: true })

    // Get total investments and capital
    const { data: investments } = await supabase!
      .from('investments')
      .select('amount')

    const totalCapital = investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0

    // Get active visa applications
    const { count: visaCount } = await supabase!
      .from('golden_visa_applications')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'in_review', 'approved'])

    // Get pending documents
    const { count: docsCount } = await supabase!
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .is('deleted_at', null)

    return {
      totalInvestors: investorsCount || 0,
      totalInvestments: investments?.length || 0,
      totalCapital,
      activeVisaApplications: visaCount || 0,
      pendingDocuments: docsCount || 0
    }
  } catch (error) {
    console.error('Exception fetching admin stats:', error)
    return {
      totalInvestors: 0,
      totalInvestments: 0,
      totalCapital: 0,
      activeVisaApplications: 0,
      pendingDocuments: 0
    }
  }
}

/**
 * Get all properties with investment details
 */
export async function getAllProperties() {
  try {
    const { authorized, supabase, error } = await verifyAdminAccess()
    if (!authorized) {
      console.error('Admin access denied:', error)
      return []
    }

    const { data: properties, error: propertiesError } = await supabase!
      .from('properties')
      .select(`
        *,
        investments (
          id,
          amount,
          investor:investors (
            full_name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (propertiesError) {
      console.error('Error fetching properties:', propertiesError)
      return []
    }

    return properties || []
  } catch (error) {
    console.error('Exception fetching properties:', error)
    return []
  }
}

/**
 * Update Golden Visa application status
 */
export async function updateVisaApplicationStatus(
  applicationId: string,
  status: string,
  notes?: string
) {
  try {
    const { authorized, supabase, error } = await verifyAdminAccess()
    if (!authorized) {
      return { success: false, error }
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (status === 'approved') {
      updateData.approval_date = new Date().toISOString()
    }

    if (notes) {
      updateData.notes = notes
    }

    const { error: updateError } = await supabase!
      .from('golden_visa_applications')
      .update(updateData)
      .eq('id', applicationId)

    if (updateError) {
      console.error('Error updating visa application:', updateError)
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Exception updating visa application:', error)
    return { success: false, error: error.message }
  }
}
