'use server'

import { analyzeProperty, PropertyAnalysis } from '@/lib/ai/property-analyzer'
import { createClient } from '@/lib/supabase/server'

/**
 * Obtener el análisis más reciente de una propiedad
 */
export async function getLatestPropertyAnalysis(propertyId: string): Promise<{
  success: boolean
  analysis?: PropertyAnalysis & { created_at: string }
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('property_ai_analyses')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No se encontró análisis previo
        return { success: true, analysis: undefined }
      }
      throw error
    }

    // Reconstruir el objeto PropertyAnalysis desde la BD
    const analysis: PropertyAnalysis & { created_at: string } = {
      aiScore: data.ai_score,
      recommendation: data.recommendation as 'COMPRAR' | 'ANALIZAR' | 'RECHAZAR',
      financialMetrics: {
        estimatedROI: parseFloat(data.estimated_roi || '0'),
        estimatedAppreciation: parseFloat(data.estimated_appreciation || '0'),
        estimatedRentalIncome: data.estimated_rental_income || 0,
        capRate: parseFloat(data.cap_rate || '0')
      },
      locationScore: data.location_data || { score: 0, proximity: {}, development: '' },
      risks: data.risks || [],
      opportunities: data.opportunities || [],
      comparables: data.comparables_data || { averagePricePerSqm: 0, pricePosition: 'at', percentageDifference: 0 },
      idealPurchasePrice: parseFloat(data.ideal_purchase_price || '0'),
      reasoning: data.reasoning || '',
      created_at: data.created_at
    }

    return {
      success: true,
      analysis
    }
  } catch (error: any) {
    console.error('❌ Error getting property analysis:', error)
    return {
      success: false,
      error: error.message || 'Error al obtener análisis'
    }
  }
}

/**
 * Analizar una propiedad con IA y guardar en BD
 * Server Action para uso en componentes del cliente
 */
export async function analyzePropertyWithAI(propertyData: {
  id: string
  name: string
  city: string
  country: string
  address: string
  acquisition_price: number
  current_value: number
  total_size_sqm: number | null
  total_units: number
  status: string
}): Promise<{
  success: boolean
  analysis?: PropertyAnalysis
  error?: string
}> {
  try {
    console.log('🤖 Analyzing property with AI:', propertyData.name)

    // Asegurar que total_size_sqm tenga un valor, usar 100 por defecto si es null
    const propertyWithSize = {
      ...propertyData,
      total_size_sqm: propertyData.total_size_sqm ?? 100
    }

    const analysis = await analyzeProperty(propertyWithSize)

    console.log('✅ AI Analysis completed. Score:', analysis.aiScore)

    // Guardar en base de datos
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: saveError } = await supabase
      .from('property_ai_analyses')
      .insert({
        property_id: propertyData.id,
        analyzed_by: user?.id,
        ai_score: analysis.aiScore,
        recommendation: analysis.recommendation,
        estimated_roi: analysis.financialMetrics.estimatedROI,
        estimated_appreciation: analysis.financialMetrics.estimatedAppreciation,
        estimated_rental_income: analysis.financialMetrics.estimatedRentalIncome,
        cap_rate: analysis.financialMetrics.capRate,
        location_score: analysis.locationScore.score,
        location_data: analysis.locationScore,
        comparables_data: analysis.comparables,
        ideal_purchase_price: analysis.idealPurchasePrice,
        risks: analysis.risks,
        opportunities: analysis.opportunities,
        reasoning: analysis.reasoning,
        full_analysis: analysis
      })

    if (saveError) {
      console.error('⚠️ Error saving analysis to DB:', saveError)
      // No fallar si no se puede guardar, devolver el análisis de todas formas
    } else {
      console.log('💾 Analysis saved to database')
    }

    return {
      success: true,
      analysis
    }
  } catch (error: any) {
    console.error('❌ Error analyzing property with AI:', error)
    return {
      success: false,
      error: error.message || 'Error al analizar propiedad con IA'
    }
  }
}

/**
 * Obtener historial de análisis de una propiedad
 */
export async function getPropertyAnalysisHistory(propertyId: string): Promise<{
  success: boolean
  analyses?: Array<{
    id: string
    ai_score: number
    recommendation: string
    created_at: string
    analyzed_by?: string
  }>
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('property_ai_analyses')
      .select('id, ai_score, recommendation, created_at, analyzed_by')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      analyses: data || []
    }
  } catch (error: any) {
    console.error('❌ Error getting analysis history:', error)
    return {
      success: false,
      error: error.message || 'Error al obtener historial'
    }
  }
}
