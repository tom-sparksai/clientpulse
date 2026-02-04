'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MoreHorizontal, Send, CheckCircle, Trash2, Download, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConfirmDialog } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const supabase = createClient()
  const { success, error: showError } = useToast()

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open])

  const updateStatus = async (status: 'sent' | 'paid') => {
    setLoading(true)
    setOpen(false)
    
    try {
      const updates: { status: string; paid_at?: string } = { status }
      if (status === 'paid') {
        updates.paid_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', invoice.id)

      if (error) throw error

      success(
        `Invoice ${status === 'sent' ? 'sent' : 'paid'}`,
        `Invoice #${invoice.number} has been marked as ${status}`
      )
      router.refresh()
    } catch (err) {
      showError('Failed to update invoice', err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const deleteInvoice = async () => {
    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoice.id)

      if (error) throw error

      success('Invoice deleted', `Invoice #${invoice.number} has been deleted`)
      setShowDeleteConfirm(false)
      router.refresh()
    } catch (err) {
      showError('Failed to delete invoice', err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const menuItems = [
    ...(invoice.status === 'draft' ? [
      {
        icon: Send,
        label: 'Mark as Sent',
        onClick: () => updateStatus('sent'),
      }
    ] : []),
    ...((invoice.status === 'sent' || invoice.status === 'overdue') ? [
      {
        icon: CheckCircle,
        label: 'Mark as Paid',
        onClick: () => updateStatus('paid'),
      }
    ] : []),
    {
      icon: Eye,
      label: 'View Details',
      onClick: () => {/* TODO: Navigate to invoice detail */},
    },
    {
      icon: Download,
      label: 'Download PDF',
      onClick: () => {/* TODO: Generate PDF */},
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: () => {
        setOpen(false)
        setShowDeleteConfirm(true)
      },
      danger: true,
    },
  ]

  return (
    <>
      <div className="relative inline-block">
        <button
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'text-[rgb(var(--foreground-muted))] hover:text-[rgb(var(--foreground))]',
            'hover:bg-[rgb(var(--neutral-100))]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))]',
            loading && 'opacity-50 cursor-not-allowed'
          )}
          disabled={loading}
          aria-label="Invoice actions"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
        </button>

        {open && (
          <div
            ref={menuRef}
            className={cn(
              'absolute right-0 mt-2 w-48 z-50',
              'bg-[rgb(var(--background-elevated))]',
              'rounded-xl shadow-[var(--shadow-lg)]',
              'border border-[rgb(var(--border-light))]',
              'py-1 overflow-hidden',
              'animate-scale-in origin-top-right'
            )}
            role="menu"
            aria-orientation="vertical"
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={cn(
                    'flex items-center gap-3 w-full px-4 py-2.5 text-sm',
                    'transition-colors',
                    'focus-visible:outline-none focus-visible:bg-[rgb(var(--neutral-100))]',
                    item.danger
                      ? 'text-[rgb(var(--error-600))] hover:bg-[rgb(var(--error-50))]'
                      : 'text-[rgb(var(--foreground))] hover:bg-[rgb(var(--neutral-100))]'
                  )}
                  role="menuitem"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {item.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={deleteInvoice}
        title="Delete Invoice"
        description={`Are you sure you want to delete invoice #${invoice.number}? This action cannot be undone.`}
        confirmText="Delete Invoice"
        cancelText="Cancel"
        variant="danger"
        loading={loading}
      />
    </>
  )
}
