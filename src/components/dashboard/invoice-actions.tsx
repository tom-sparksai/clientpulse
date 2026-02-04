'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MoreHorizontal, Send, CheckCircle, Trash2 } from 'lucide-react'

interface Invoice {
  id: string
  status: string
  number: string
}

interface InvoiceActionsProps {
  invoice: Invoice
}

export default function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const updateStatus = async (status: 'sent' | 'paid') => {
    setLoading(true)
    const updates: { status: string; paid_at?: string } = { status }
    if (status === 'paid') {
      updates.paid_at = new Date().toISOString()
    }

    await supabase
      .from('invoices')
      .update(updates)
      .eq('id', invoice.id)

    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  const deleteInvoice = async () => {
    if (!confirm('Are you sure you want to delete this invoice?')) return
    
    setLoading(true)
    await supabase
      .from('invoices')
      .delete()
      .eq('id', invoice.id)

    setLoading(false)
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-gray-100"
        disabled={loading}
      >
        <MoreHorizontal className="w-5 h-5 text-gray-400" />
      </button>

      {open && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setOpen(false)} 
          />
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
            {invoice.status === 'draft' && (
              <button
                onClick={() => updateStatus('sent')}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Send className="w-4 h-4" />
                Mark as Sent
              </button>
            )}
            {(invoice.status === 'sent' || invoice.status === 'overdue') && (
              <button
                onClick={() => updateStatus('paid')}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Paid
              </button>
            )}
            <button
              onClick={deleteInvoice}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}
