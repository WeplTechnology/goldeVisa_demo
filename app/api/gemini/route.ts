import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!process.env.GROK_API_KEY) {
      return NextResponse.json(
        { error: 'Grok API key not configured' },
        { status: 500 }
      )
    }

    // Construir el contexto de la conversación
    const systemContext = `You are STAG AI Assistant, a helpful assistant for the STAG Fund Management Golden Visa platform.
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

    // Construir mensajes para Grok API
    const messages = [
      {
        role: 'system',
        content: systemContext
      }
    ]

    // Añadir historial de conversación
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: { role: string; content: string }) => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })
      })
    }

    // Añadir mensaje actual
    messages.push({
      role: 'user',
      content: message
    })

    // Llamar a Grok API
    console.log('🚀 Calling Grok API with model: grok-3')
    console.log('📝 Messages count:', messages.length)

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`
      },
      body: JSON.stringify({
        messages,
        model: 'grok-3',
        stream: false,
        temperature: 0.7
      })
    })

    console.log('📊 Grok API Response Status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Grok API Error Response:', errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        throw new Error(`Grok API error (${response.status}): ${errorText}`)
      }

      throw new Error(errorData.error?.message || errorData.message || 'Grok API request failed')
    }

    const data = await response.json()
    console.log('✅ Grok API Success')
    const assistantResponse = data.choices[0].message.content

    return NextResponse.json({
      response: assistantResponse,
      success: true,
    })
  } catch (error: any) {
    console.error('Grok API error:', error)

    // Extraer detalles del error
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
