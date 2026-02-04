'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { Send } from 'lucide-react'

interface Message {
  id: string
  content: string
  created_at: string
  user_id: string | null
  client_id: string | null
  users?: {
    full_name: string
  } | null
}

interface ClientChatProps {
  projectId: string
  clientId: string
}

export default function ClientChat({ projectId, clientId }: ClientChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, users(full_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (data) {
        setMessages(data)
      }
      setLoading(false)
    }

    loadMessages()
  }, [projectId, supabase])

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel(`client-project-${projectId}-messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from('messages')
            .select('*, users(full_name)')
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setMessages(prev => [...prev, data])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, supabase])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    setSending(true)

    const { error } = await supabase
      .from('messages')
      .insert({
        project_id: projectId,
        client_id: clientId,
        content: newMessage,
      })

    if (!error) {
      setNewMessage('')
    }
    setSending(false)
  }

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading messages...</div>
  }

  return (
    <div className="border border-gray-200 rounded-lg">
      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => {
            const isClient = message.client_id === clientId
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isClient ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isClient ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <span className={`text-sm font-medium ${isClient ? 'text-green-600' : 'text-blue-600'}`}>
                    {isClient ? 'You' : message.users?.full_name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className={`flex-1 ${isClient ? 'text-right' : ''}`}>
                  <div className={`inline-flex items-baseline gap-2 ${isClient ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm font-medium">
                      {isClient ? 'You' : message.users?.full_name || 'Agency'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm text-gray-600 mt-1 ${isClient ? 'bg-green-50 inline-block px-3 py-2 rounded-lg' : ''}`}>
                    {message.content}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            No messages yet. Start the conversation!
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
