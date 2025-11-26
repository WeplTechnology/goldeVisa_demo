import { generateStructuredContent } from './gemini-client'

export interface PropertyAnalysis {
  aiScore: number // 0-100
  recommendation: 'COMPRAR' | 'ANALIZAR' | 'RECHAZAR'
  financialMetrics: {
    estimatedROI: number
    estimatedAppreciation: number
    estimatedRentalIncome: number
    capRate: number
  }
  locationScore: {
    score: number
    proximity: {
      metro: string
      schools: string
      shopping: string
    }
    development: string
  }
  risks: Array<{
    type: string
    severity: 'low' | 'medium' | 'high'
    description: string
  }>
  opportunities: string[]
  comparables: {
    averagePricePerSqm: number
    pricePosition: 'below' | 'at' | 'above'
    percentageDifference: number
  }
  idealPurchasePrice: number
  reasoning: string
}

/**
 * Analizar una propiedad con IA y generar recomendaciones
 */
export async function analyzeProperty(property: {
  name: string
  city: string
  country: string
  address: string
  acquisition_price: number
  current_value: number
  total_size_sqm: number
  total_units: number
  status: string
}): Promise<PropertyAnalysis> {
  const prompt = `
Eres un experto analista de inversiones inmobiliarias en Italia especializado en fondos de Golden Visa.

Analiza esta propiedad y proporciona un análisis detallado:

PROPIEDAD:
- Nombre: ${property.name}
- Ubicación: ${property.address}, ${property.city}, ${property.country}
- Precio actual: €${property.current_value.toLocaleString()}
- Precio de adquisición: €${property.acquisition_price.toLocaleString()}
- Superficie: ${property.total_size_sqm} m²
- Unidades: ${property.total_units}
- Estado: ${property.status}

CONTEXTO DEL MERCADO ITALIANO:
- Milano centro: €5,000-8,000/m² (alta demanda, turismo, negocios)
- Roma centro: €4,500-7,000/m² (turismo, cultura, gobierno)
- Florencia: €4,000-6,000/m² (turismo, lujo)
- Bologna: €3,000-4,500/m² (estudiantes, jóvenes profesionales)

ANÁLISIS REQUERIDO:
1. Calcular score AI (0-100) basado en ubicación, precio, potencial
2. Métricas financieras: ROI estimado (5 años), apreciación, ingreso por alquiler
3. Score de ubicación: proximidad a transporte, servicios, desarrollo urbano
4. Identificar riesgos específicos (competencia, mantenimiento, mercado)
5. Identificar oportunidades (reformas, cambio de uso, turismo)
6. Comparar con mercado (precio/m² vs media de zona)
7. Recomendar precio ideal de compra (5-10% bajo mercado si es buen deal)
8. Dar recomendación final: COMPRAR / ANALIZAR / RECHAZAR

Sé específico con números reales basados en el mercado italiano actual.
`.trim()

  const schema = `{
  "aiScore": number,
  "recommendation": "COMPRAR" | "ANALIZAR" | "RECHAZAR",
  "financialMetrics": {
    "estimatedROI": number,
    "estimatedAppreciation": number,
    "estimatedRentalIncome": number,
    "capRate": number
  },
  "locationScore": {
    "score": number,
    "proximity": {
      "metro": string,
      "schools": string,
      "shopping": string
    },
    "development": string
  },
  "risks": [
    {
      "type": string,
      "severity": "low" | "medium" | "high",
      "description": string
    }
  ],
  "opportunities": [string],
  "comparables": {
    "averagePricePerSqm": number,
    "pricePosition": "below" | "at" | "above",
    "percentageDifference": number
  },
  "idealPurchasePrice": number,
  "reasoning": string
}`

  try {
    const analysis = await generateStructuredContent<PropertyAnalysis>(prompt, schema)
    return analysis
  } catch (error) {
    console.error('Error analyzing property:', error)
    // Retornar análisis por defecto en caso de error
    return {
      aiScore: 50,
      recommendation: 'ANALIZAR',
      financialMetrics: {
        estimatedROI: 6.0,
        estimatedAppreciation: 15,
        estimatedRentalIncome: Math.round(property.current_value * 0.04 / 12),
        capRate: 4.0
      },
      locationScore: {
        score: 70,
        proximity: {
          metro: 'Información no disponible',
          schools: 'Información no disponible',
          shopping: 'Información no disponible'
        },
        development: 'Análisis pendiente'
      },
      risks: [
        {
          type: 'Análisis incompleto',
          severity: 'medium',
          description: 'Error al analizar con IA. Revisar manualmente.'
        }
      ],
      opportunities: ['Análisis manual requerido'],
      comparables: {
        averagePricePerSqm: Math.round(property.current_value / property.total_size_sqm),
        pricePosition: 'at',
        percentageDifference: 0
      },
      idealPurchasePrice: property.current_value,
      reasoning: 'Error en análisis automático. Se requiere revisión manual por un experto.'
    }
  }
}

/**
 * Generar resumen ejecutivo de una propiedad
 */
export async function generatePropertySummary(property: any, analysis: PropertyAnalysis): Promise<string> {
  const prompt = `
Genera un resumen ejecutivo breve (3-4 líneas) para esta propiedad:

PROPIEDAD: ${property.name}, ${property.city}
SCORE IA: ${analysis.aiScore}/100
ROI ESTIMADO: ${analysis.financialMetrics.estimatedROI}%
RECOMENDACIÓN: ${analysis.recommendation}

El resumen debe ser profesional, conciso y enfocado en los aspectos clave para un inversor.
`.trim()

  try {
    return await generateStructuredContent<string>(prompt)
  } catch (error) {
    return `Propiedad ${property.name} con score ${analysis.aiScore}/100. ${analysis.recommendation === 'COMPRAR' ? 'Excelente oportunidad de inversión' : analysis.recommendation === 'ANALIZAR' ? 'Requiere análisis detallado' : 'No recomendada en este momento'}.`
  }
}
