'use server'

import { createClient } from '@/lib/supabase/server'

export interface InvestorData {
  id: string
  fund_id: string
  user_id: string
  full_name: string
  email: string
  nationality: string
  investment_amount: number
  real_estate_amount: number
  rd_amount: number
  status: string
  kyc_status: string
  golden_visa_status: string
  onboarding_date: string
  visa_start_date: string | null
  visa_expected_completion: string | null
}

export interface PropertyUnit {
  id: string
  property_id: string
  unit_number: string
  floor: number
  size_sqm: number
  bedrooms: number
  bathrooms: number
  rental_status: string
  monthly_rent: number
  current_tenant_name: string | null
  current_tenant_email: string | null
  lease_start_date: string | null
  lease_end_date: string | null
  property: {
    name: string
    address: string
    city: string
  }
}

export interface GoldenVisaMilestone {
  id: string
  milestone_type: string
  title: string
  description: string
  status: string
  due_date: string | null
  completed_date: string | null
  order_number: number
}

/**
 * Get investor data for the current authenticated user
 */
export async function getInvestorData(): Promise<InvestorData | null> {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Error getting user:', userError)
    return null
  }

  // Get investor data linked to this user
  const { data: investor, error: investorError } = await supabase
    .from('investors')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (investorError) {
    console.error('Error getting investor:', investorError)
    return null
  }

  return investor
}

/**
 * Get property units assigned to the current investor
 */
export async function getInvestorPropertyUnits(): Promise<PropertyUnit[]> {
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

  // Get property units with property details
  const { data: units, error } = await supabase
    .from('property_units')
    .select(`
      *,
      property:properties(name, address, city)
    `)
    .eq('assigned_investor_id', investor.id)

  if (error) {
    console.error('Error getting property units:', error)
    return []
  }

  return units || []
}

/**
 * Get golden visa milestones for the current investor
 */
export async function getGoldenVisaMilestones(): Promise<GoldenVisaMilestone[]> {
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

  // Get milestones ordered by order_number
  const { data: milestones, error } = await supabase
    .from('golden_visa_milestones')
    .select('*')
    .eq('investor_id', investor.id)
    .order('order_number', { ascending: true })

  if (error) {
    console.error('Error getting milestones:', error)
    return []
  }

  return milestones || []
}

/**
 * Calculate total monthly rent from all property units
 */
export async function getTotalMonthlyRent(): Promise<number> {
  const units = await getInvestorPropertyUnits()
  return units.reduce((total, unit) => total + (unit.monthly_rent || 0), 0)
}

/**
 * Get investment portfolio summary
 */
export async function getPortfolioSummary() {
  const investor = await getInvestorData()
  const units = await getInvestorPropertyUnits()
  const monthlyRent = await getTotalMonthlyRent()

  if (!investor) {
    return null
  }

  // Calculate annual yield
  const annualRent = monthlyRent * 12
  const annualYield = investor.investment_amount > 0
    ? (annualRent / investor.investment_amount) * 100
    : 0

  // Calculate rental months since visa start
  const visaStartDate = investor.visa_start_date ? new Date(investor.visa_start_date) : null
  const monthsSinceStart = visaStartDate
    ? Math.max(0, Math.floor((Date.now() - visaStartDate.getTime()) / (1000 * 60 * 60 * 24 * 30)))
    : 0

  // Calculate cumulative returns
  const cumulativeReturns = monthlyRent * monthsSinceStart

  return {
    totalInvestment: investor.investment_amount,
    realEstateAmount: investor.real_estate_amount,
    rdAmount: investor.rd_amount,
    propertiesCount: units.length,
    monthlyRent,
    annualYield,
    cumulativeReturns,
    visaStatus: investor.golden_visa_status,
    monthsSinceStart,
  }
}
