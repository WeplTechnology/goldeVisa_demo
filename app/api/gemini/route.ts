import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    // Usar el modelo Gemini 2.5 Flash (más reciente y rápido)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Construir el contexto de la conversación
    const context = `You are STAG AI Assistant, a helpful assistant for the STAG Fund Management Golden Visa platform.
You help investors with questions about their Golden Visa investment in Italy, real estate properties,
visa process, documentation, and general investment queries.

Be professional, friendly, and provide accurate information about:
- Golden Visa Italy program (€250,000 minimum investment)
- Real estate investment (85% of portfolio)
- R&D investment (15% of portfolio)
- Italian residency process
- Documentation requirements
- Property management
- Investment returns

Always be helpful and if you don't know something, recommend contacting their account manager.`

    // Construir el prompt con historial
    let fullPrompt = context + '\n\n'

    if (conversationHistory && conversationHistory.length > 0) {
      fullPrompt += 'Previous conversation:\n'
      conversationHistory.forEach((msg: { role: string; content: string }) => {
        fullPrompt += `${msg.role === 'user' ? 'Investor' : 'Assistant'}: ${msg.content}\n`
      })
      fullPrompt += '\n'
    }

    fullPrompt += `Investor: ${message}\nAssistant:`

    // Generar respuesta
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      response: text,
      success: true,
    })
  } catch (error: any) {
    console.error('Gemini API error:', error)

    // Extraer detalles del error de Gemini
    let errorMessage = error.message || 'Failed to generate response'
    let errorDetails = error.toString()

    if (error.response) {
      errorDetails = `API Response: ${JSON.stringify(error.response)}`
    }

    console.error('Full error details:', errorDetails)

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    )
  }
}
