import { GoogleGenerativeAI } from '@google/generative-ai'

// Inicializar cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * Obtener modelo Gemini 2.0 Flash Thinking
 * Modelo de producción con rate limits más altos
 */
export function getGeminiModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-thinking-exp-1219', // Modelo con mejores rate limits
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
  })
}

/**
 * Generar contenido con Gemini
 */
export async function generateContent(prompt: string) {
  try {
    const model = getGeminiModel()
    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error('Error generating content with Gemini:', error)
    throw error
  }
}

/**
 * Generar contenido estructurado (JSON) con Gemini
 */
export async function generateStructuredContent<T>(prompt: string, schema?: string): Promise<T> {
  try {
    const fullPrompt = schema
      ? `${prompt}\n\nResponde ÚNICAMENTE con un JSON válido que siga este schema:\n${schema}`
      : `${prompt}\n\nResponde ÚNICAMENTE con un JSON válido.`

    const model = getGeminiModel()
    const result = await model.generateContent(fullPrompt)
    const response = result.response
    const text = response.text()

    // Limpiar markdown code blocks si existen
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    return JSON.parse(cleanedText)
  } catch (error) {
    console.error('Error generating structured content with Gemini:', error)
    throw error
  }
}

/**
 * Analizar imagen con Gemini Vision
 */
export async function analyzeImage(imageData: string, prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData
        }
      }
    ])

    const response = result.response
    return response.text()
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error)
    throw error
  }
}
