'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { Send, Smile, Paperclip, MessageSquare, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const inputRef = useRef<HTMLInputElement>(null)
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
      inputRef.current?.focus()
    }
    setSending(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-[rgb(var(--primary-500))] animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[350px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message, index) => {
            const isClient = message.client_id === clientId
            const showAvatar = index === 0 || messages[index - 1]?.client_id !== message.client_id || messages[index - 1]?.user_id !== message.user_id
            
            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3 animate-fade-in',
                  isClient ? 'flex-row-reverse' : ''
                )}
              >
                {/* Avatar */}
                <div className={cn('w-8 shrink-0', !showAvatar && 'invisible')}>
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    isClient 
                      ? 'bg-gradient-to-br from-[rgb(var(--success-400))] to-[rgb(var(--success-600))]'
                      : 'bg-gradient-to-br from-[rgb(var(--primary-400))] to-[rgb(var(--primary-600))]'
                  )}>
                    <span className="text-xs font-semibold text-white">
                      {isClient ? 'Y' : message.users?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                </div>

                {/* Message bubble */}
                <div className={cn('flex flex-col max-w-[75%]', isClient ? 'items-end' : 'items-start')}>
                  {showAvatar && (
                    <div className={cn(
                      'flex items-center gap-2 mb-1',
                      isClient ? 'flex-row-reverse' : ''
                    )}>
                      <span className="text-xs font-medium text-[rgb(var(--foreground))]">
                        {isClient ? 'You' : message.users?.full_name || 'Agency'}
                      </span>
                      <span className="text-[10px] text-[rgb(var(--foreground-muted))]">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                  <div
                    className={cn(
                      'px-4 py-2.5 text-sm leading-relaxed',
                      isClient
                        ? 'bg-gradient-to-r from-[rgb(var(--success-600))] to-[rgb(var(--success-500))] text-white rounded-2xl rounded-br-md'
                        : 'bg-[rgb(var(--neutral-100))] text-[rgb(var(--foreground))] rounded-2xl rounded-bl-md'
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-[rgb(var(--neutral-100))] flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-[rgb(var(--foreground-muted))]" />
            </div>
            <p className="text-[rgb(var(--foreground-secondary))] font-medium mb-1">
              No messages yet
            </p>
            <p className="text-sm text-[rgb(var(--foreground-muted))]">
              Send a message to your agency!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[rgb(var(--border-light))]">
        <div className="flex items-center gap-2">
          {/* Attachment button */}
          <button className="p-2.5 rounded-xl text-[rgb(var(--foreground-muted))] hover:text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--neutral-100))] transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Input field */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Type a message..."
              className="input pr-12 py-3 rounded-xl"
            />
            {/* Emoji button inside input */}
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[rgb(var(--foreground-muted))] hover:text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--neutral-100))] transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {/* Send button */}
          <button
            onClick={sendMessage}
            disabled={sending || !newMessage.trim()}
            className={cn(
              'p-3 rounded-xl transition-all',
              newMessage.trim()
                ? 'bg-gradient-to-r from-[rgb(var(--success-600))] to-[rgb(var(--success-500))] text-white shadow-sm hover:shadow-md hover:scale-105'
                : 'bg-[rgb(var(--neutral-100))] text-[rgb(var(--foreground-muted))]'
            )}
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className={cn('w-5 h-5', newMessage.trim() && 'translate-x-0.5')} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
