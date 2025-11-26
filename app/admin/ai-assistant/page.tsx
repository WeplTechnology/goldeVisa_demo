'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Loader2,
  Send,
  Bot,
  User,
  Sparkles,
  Info
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AdminAIAssistantPage() {
  const { user, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your STAG Admin AI Assistant. I can help you with administrative tasks, investor queries, property management, and platform operations. How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // Preparar historial de conversación con contexto de admin
      const adminContext = `You are assisting an administrator of the STAG Fund Management Golden Visa platform.
      Provide detailed, professional information about:
      - Managing investor accounts and applications
      - Property portfolio oversight
      - Document verification and compliance
      - Golden Visa application processing
      - KYC/AML procedures
      - Platform operations and workflows
      - Investor communications best practices
      - Reporting and analytics
      Be concise but thorough, and prioritize operational efficiency.`

      const conversationHistory = [
        { role: 'system', content: adminContext },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ]

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Chat error:', error)
      setError(error.message || 'Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
      </div>
    )
  }

  return (
    <DashboardLayout
      title="AI Assistant"
      subtitle="Get help with admin tasks and operations"
      isAdmin={true}
    >
      <div className="max-w-5xl mx-auto">
        {/* Info Banner */}
        <Alert className="mb-6 border-stag-blue/20 bg-stag-light/50">
          <Info className="h-4 w-4 text-stag-blue" />
          <AlertDescription className="text-sm text-stag-navy">
            <strong className="font-semibold">Admin AI Assistant</strong> is powered by xAI Grok.
            Ask about investor management, platform operations, compliance, or any administrative task.
          </AlertDescription>
        </Alert>

        {/* Chat Card */}
        <Card className="card-premium h-[calc(100vh-280px)] flex flex-col">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stag-navy to-stag-blue flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-bold text-stag-navy flex items-center gap-2">
                  Admin AI Assistant
                  <Sparkles className="w-4 h-4 text-stag-gold" />
                </h3>
                <p className="text-sm text-gray-500">Powered by xAI Grok</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 animate-fade-in-up ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <Avatar className={`flex-shrink-0 ${
                  message.role === 'assistant'
                    ? 'bg-gradient-to-br from-stag-navy to-stag-blue'
                    : 'bg-gradient-to-br from-stag-blue to-stag-blue-light'
                }`}>
                  <AvatarFallback className="bg-transparent">
                    {message.role === 'assistant' ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* Message Content */}
                <div
                  className={`flex flex-col max-w-[80%] ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-stag-blue to-stag-blue-light text-white'
                        : 'bg-gray-100 text-stag-navy'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-1">
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="flex-shrink-0 bg-gradient-to-br from-stag-navy to-stag-blue">
                  <AvatarFallback className="bg-transparent">
                    <Bot className="w-5 h-5 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-stag-blue" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <Alert variant="destructive" className="animate-fade-in-up">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about admin tasks, investor management, compliance... (Press Enter to send, Shift+Enter for new line)"
                className="min-h-[60px] max-h-[120px] resize-none focus-visible:ring-stag-blue"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-stag-navy to-stag-blue hover:from-stag-blue hover:to-stag-navy transition-all duration-300 px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              AI responses may contain errors. Always verify critical information before taking action.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
