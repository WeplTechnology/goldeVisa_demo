'use server'

import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/utils/auth-helpers'

export async function verifyInvestor(userId: string) {
  try {
    const supabase = await createClient()

    const { data: investor, error } = await supabase
      .from('investors')
      .select('id, full_name, email')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error verifying investor:', error)
      return { success: false, error: error.message }
    }

    if (!investor) {
      return { success: false, error: 'Not registered as investor' }
    }

    return { success: true, investor }
  } catch (error: any) {
    console.error('Exception verifying investor:', error)
    return { success: false, error: error.message }
  }
}

export async function verifyAdmin(email: string) {
  if (!isAdminEmail(email)) {
    return { success: false, error: 'Not an admin account' }
  }

  return { success: true }
}
