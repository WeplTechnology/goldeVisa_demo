/**
 * Script para crear análisis AI mock para todas las propiedades
 * Genera datos realistas basados en las características de cada propiedad
 * NO llama a la API de Gemini - solo inserta datos mock en la base de datos
 */

import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface Property {
  id: string
  name: string
  address: string
  city: string
  country: string
  acquisition_price: number
  current_value: number
  total_size_sqm: number
  total_units: number
  status: string
}

// Función para generar análisis mock basado en características de la propiedad
function generateMockAnalysis(property: Property, adminUserId: string) {
  const pricePerSqm = property.current_value / property.total_size_sqm

  // Determinar características según la ciudad
  let baseScore = 70
  let averagePricePerSqm = 4000
  let locationDescription = ''
  let metroProximity = '800m'
  let schoolsProximity = '600m'
  let shoppingProximity = '400m'
  let developmentLevel = 'Desarrollo moderado'

  // Ajustar según la ciudad
  const cityLower = property.city.toLowerCase()
  if (cityLower.includes('milano') || cityLower.includes('milan')) {
    baseScore = 88
    averagePricePerSqm = 6500
    locationDescription = 'Zona céntrica de Milano con excelente conectividad y alta demanda comercial'
    metroProximity = '300m'
    developmentLevel = 'Alto desarrollo urbano con proyectos de infraestructura en curso'
  } else if (cityLower.includes('roma') || cityLower.includes('rome')) {
    baseScore = 85
    averagePricePerSqm = 5800
    locationDescription = 'Ubicación histórica en Roma con atractivo turístico constante'
    metroProximity = '450m'
    developmentLevel = 'Zona consolidada con inversión en turismo y cultura'
  } else if (cityLower.includes('firenze') || cityLower.includes('florence') || cityLower.includes('florencia')) {
    baseScore = 83
    averagePricePerSqm = 5200
    locationDescription = 'Centro histórico de Florencia con alto flujo turístico'
    metroProximity = '600m'
    developmentLevel = 'Patrimonio histórico con regulaciones de conservación'
  } else if (cityLower.includes('bologna')) {
    baseScore = 78
    averagePricePerSqm = 3800
    locationDescription = 'Zona universitaria con demanda estable de estudiantes y profesionales'
    metroProximity = '500m'
    schoolsProximity = '200m'
    developmentLevel = 'Crecimiento constante impulsado por sector educativo'
  }

  // Ajustar score según precio vs mercado
  const priceDifferencePercent = ((pricePerSqm - averagePricePerSqm) / averagePricePerSqm) * 100
  if (priceDifferencePercent < -10) baseScore += 8 // Muy por debajo del mercado
  else if (priceDifferencePercent < 0) baseScore += 5 // Precio competitivo
  else if (priceDifferencePercent > 15) baseScore -= 8 // Sobrevalorado

  // Ajustar según estado
  if (property.status === 'ACQUIRED' || property.status === 'ACTIVE') baseScore += 3

  // Determinar recomendación según score
  let recommendation: 'COMPRAR' | 'ANALIZAR' | 'RECHAZAR'
  if (baseScore >= 82) recommendation = 'COMPRAR'
  else if (baseScore >= 65) recommendation = 'ANALIZAR'
  else recommendation = 'RECHAZAR'

  // Calcular métricas financieras
  const appreciationRate = cityLower.includes('milano') ? 4.5 : cityLower.includes('roma') ? 4.0 : 3.5
  const estimatedROI = appreciationRate * 5 + (property.total_units * 0.8) // 5 años + bonificación por unidades
  const monthlyRentPerUnit = pricePerSqm * (property.total_size_sqm / property.total_units) * 0.004
  const estimatedRentalIncome = Math.round(monthlyRentPerUnit * property.total_units)
  const capRate = (estimatedRentalIncome * 12 / property.current_value) * 100

  // Precio ideal de compra (5-10% bajo el precio actual si es buen deal)
  const idealDiscount = baseScore >= 80 ? 0.95 : 0.90
  const idealPurchasePrice = Math.round(property.current_value * idealDiscount)

  // Riesgos
  const risks = []
  if (pricePerSqm > averagePricePerSqm * 1.1) {
    risks.push({
      type: 'Sobrevaloración',
      severity: 'medium' as const,
      description: 'El precio por m² está por encima del promedio del mercado local'
    })
  }
  if (property.total_units > 8) {
    risks.push({
      type: 'Gestión Operativa',
      severity: 'low' as const,
      description: 'Múltiples unidades requieren gestión profesional activa'
    })
  }
  if (property.status === 'AVAILABLE') {
    risks.push({
      type: 'Vacancia',
      severity: 'medium' as const,
      description: 'Propiedad sin inquilinos actuales, requiere comercialización'
    })
  }

  // Oportunidades
  const opportunities = []
  if (cityLower.includes('milano')) {
    opportunities.push('Alta demanda corporativa y ejecutivos internacionales')
    opportunities.push('Potencial para alquiler corporativo de corto plazo')
    opportunities.push('Crecimiento sostenido del mercado inmobiliario en Milano')
  } else if (cityLower.includes('bologna')) {
    opportunities.push('Demanda constante de estudiantes universitarios')
    opportunities.push('Oportunidad de alquiler amueblado para estudiantes')
    opportunities.push('Mercado estable con bajo riesgo de vacancia')
  } else if (cityLower.includes('roma') || cityLower.includes('firenze')) {
    opportunities.push('Alto potencial turístico para alquiler vacacional')
    opportunities.push('Valorización por ubicación en zona histórica')
    opportunities.push('Demanda internacional constante')
  }

  if (property.total_units >= 4) {
    opportunities.push('Economías de escala en gestión y mantenimiento')
  }
  if (pricePerSqm < averagePricePerSqm) {
    opportunities.push('Precio competitivo vs mercado permite margen de rentabilidad')
  }

  // Razonamiento
  const reasoning = `Esta propiedad en ${property.city} presenta ${baseScore >= 85 ? 'excelentes' : baseScore >= 70 ? 'buenas' : 'moderadas'} características de inversión. Con un precio de €${pricePerSqm.toFixed(0)}/m² ${priceDifferencePercent > 0 ? 'por encima' : 'por debajo'} del promedio de mercado (€${averagePricePerSqm}/m²), la propiedad ofrece un ROI estimado del ${estimatedROI.toFixed(1)}% a 5 años. ${locationDescription}. La ubicación cuenta con excelente acceso a servicios (metro a ${metroProximity}), lo que incrementa su atractivo para inquilinos. ${developmentLevel}, lo que favorece la apreciación a largo plazo.`

  return {
    property_id: property.id,
    analyzed_by: adminUserId,
    ai_score: Math.min(100, Math.max(0, Math.round(baseScore))),
    recommendation,
    estimated_roi: estimatedROI,
    estimated_appreciation: appreciationRate * 5,
    estimated_rental_income: estimatedRentalIncome,
    cap_rate: capRate,
    location_score: Math.round(baseScore * 0.9),
    location_data: {
      score: Math.round(baseScore * 0.9),
      proximity: {
        metro: metroProximity,
        schools: schoolsProximity,
        shopping: shoppingProximity
      },
      development: developmentLevel
    },
    comparables_data: {
      averagePricePerSqm,
      pricePosition: priceDifferencePercent < -5 ? 'below' : priceDifferencePercent > 5 ? 'above' : 'at',
      percentageDifference: Math.round(priceDifferencePercent)
    },
    ideal_purchase_price: idealPurchasePrice,
    risks,
    opportunities,
    reasoning,
    full_analysis: {
      aiScore: Math.min(100, Math.max(0, Math.round(baseScore))),
      recommendation,
      financialMetrics: {
        estimatedROI,
        estimatedAppreciation: appreciationRate * 5,
        estimatedRentalIncome,
        capRate
      },
      locationScore: {
        score: Math.round(baseScore * 0.9),
        proximity: {
          metro: metroProximity,
          schools: schoolsProximity,
          shopping: shoppingProximity
        },
        development: developmentLevel
      },
      risks,
      opportunities,
      comparables: {
        averagePricePerSqm,
        pricePosition: priceDifferencePercent < -5 ? 'below' : priceDifferencePercent > 5 ? 'above' : 'at',
        percentageDifference: Math.round(priceDifferencePercent)
      },
      idealPurchasePrice,
      reasoning
    }
  }
}

async function main() {
  console.log('🚀 Iniciando creación de análisis AI mock...\n')

  // 1. Obtener el primer usuario admin
  const { data: users, error: usersError } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'admin')
    .limit(1)

  if (usersError || !users || users.length === 0) {
    console.error('❌ Error: No se encontró usuario admin')
    return
  }

  const adminUserId = users[0].user_id
  console.log(`✅ Usuario admin encontrado: ${adminUserId}\n`)

  // 2. Obtener todas las propiedades
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('*')

  if (propertiesError || !properties) {
    console.error('❌ Error obteniendo propiedades:', propertiesError)
    return
  }

  console.log(`📊 Propiedades encontradas: ${properties.length}\n`)

  // 3. Generar y guardar análisis para cada propiedad
  let successCount = 0
  let errorCount = 0

  for (const property of properties) {
    try {
      console.log(`📝 Generando análisis para: ${property.name}...`)

      // Verificar si ya existe un análisis
      const { data: existing } = await supabase
        .from('property_ai_analyses')
        .select('id')
        .eq('property_id', property.id)
        .single()

      if (existing) {
        console.log(`   ⏭️  Ya existe análisis, saltando...\n`)
        continue
      }

      const mockAnalysis = generateMockAnalysis(property, adminUserId)

      const { error: insertError } = await supabase
        .from('property_ai_analyses')
        .insert(mockAnalysis)

      if (insertError) {
        console.error(`   ❌ Error insertando análisis:`, insertError.message)
        errorCount++
      } else {
        console.log(`   ✅ Análisis creado: Score ${mockAnalysis.ai_score}/100 - ${mockAnalysis.recommendation}`)
        successCount++
      }
      console.log('')
    } catch (err: any) {
      console.error(`   ❌ Error inesperado:`, err.message)
      errorCount++
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 RESUMEN')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Análisis creados: ${successCount}`)
  console.log(`❌ Errores: ${errorCount}`)
  console.log(`📁 Total propiedades: ${properties.length}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error fatal:', err)
    process.exit(1)
  })
