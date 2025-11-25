'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  MessageSquare,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  User,
  Clock
} from 'lucide-react'

// Mock data for demonstration - in production this would come from Supabase
const mockConversations = [
  {
    id: '1',
    investor: {
      name: 'Zhang Wei',
      email: 'zhang.wei@email.com',
      avatar: 'ZW'
    },
    lastMessage: {
      text: 'Thank you for the update on my Golden Visa application.',
      timestamp: new Date('2025-11-24T10:30:00'),
      sender: 'investor'
    },
    unread: 2,
    status: 'active'
  },
  {
    id: '2',
    investor: {
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      avatar: 'MS'
    },
    lastMessage: {
      text: 'Can you provide more details about property #2?',
      timestamp: new Date('2025-11-23T15:45:00'),
      sender: 'investor'
    },
    unread: 0,
    status: 'active'
  },
  {
    id: '3',
    investor: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      avatar: 'JS'
    },
    lastMessage: {
      text: 'Documents have been uploaded for review.',
      timestamp: new Date('2025-11-22T09:15:00'),
      sender: 'admin'
    },
    unread: 1,
    status: 'active'
  }
]

const mockMessages = [
  {
    id: '1',
    text: 'Hello, I have some questions about my Golden Visa application status.',
    timestamp: new Date('2025-11-24T09:00:00'),
    sender: 'investor'
  },
  {
    id: '2',
    text: 'Hi Zhang! Your application is currently in review. Our team is processing your documents and we expect to have an update within 5-7 business days.',
    timestamp: new Date('2025-11-24T09:15:00'),
    sender: 'admin'
  },
  {
    id: '3',
    text: 'That sounds great. Is there anything else I need to provide at this stage?',
    timestamp: new Date('2025-11-24T09:30:00'),
    sender: 'investor'
  },
  {
    id: '4',
    text: 'Your documentation is complete. We will contact you if anything additional is needed. You can track the progress in your Golden Visa dashboard.',
    timestamp: new Date('2025-11-24T10:00:00'),
    sender: 'admin'
  },
  {
    id: '5',
    text: 'Thank you for the update on my Golden Visa application.',
    timestamp: new Date('2025-11-24T10:30:00'),
    sender: 'investor'
  }
]

export default function AdminMessagesPage() {
  const { user, loading } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [messageText, setMessageText] = useState('')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stag-light to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stag-navy to-stag-navy-light flex items-center justify-center shadow-premium-lg">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-stag-blue/20 blur-xl animate-pulse" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  const filteredConversations = mockConversations.filter(conv =>
    conv.investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.investor.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unread, 0)

  const handleSendMessage = () => {
    if (!messageText.trim()) return
    // Here you would send the message to Supabase
    console.log('Sending message:', messageText)
    setMessageText('')
  }

  return (
    <DashboardLayout
      title="Messages"
      subtitle="Communicate with investors"
      isAdmin={true}
    >
      <div className="h-[calc(100vh-200px)] flex gap-6">
        {/* Conversations List */}
        <Card className="w-96 card-premium flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-stag-navy">Conversations</h2>
              {totalUnread > 0 && (
                <Badge className="bg-stag-blue text-white hover:bg-stag-navy">
                  {totalUnread} new
                </Badge>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 text-left hover:bg-stag-light/50 transition-colors ${
                      selectedConversation.id === conv.id ? 'bg-stag-light' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-stag-blue to-stag-navy text-white font-semibold">
                            {conv.investor.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unread > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-stag-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {conv.unread}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-stag-navy truncate">{conv.investor.name}</p>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {conv.lastMessage.timestamp.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${conv.unread > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                          {conv.lastMessage.sender === 'admin' && 'You: '}
                          {conv.lastMessage.text}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 card-premium flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-stag-blue to-stag-navy text-white font-semibold">
                  {selectedConversation.investor.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-stag-navy">{selectedConversation.investor.name}</h3>
                <p className="text-sm text-gray-500">{selectedConversation.investor.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[70%] ${message.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback
                      className={
                        message.sender === 'admin'
                          ? 'bg-stag-blue text-white font-semibold'
                          : 'bg-gray-200 text-gray-700 font-semibold'
                      }
                    >
                      {message.sender === 'admin' ? user?.email?.charAt(0).toUpperCase() : selectedConversation.investor.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${message.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.sender === 'admin'
                          ? 'bg-stag-blue text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-stag-light">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="bg-stag-blue hover:bg-stag-navy"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Messages are stored securely and encrypted
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
