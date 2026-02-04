'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'

// =============================================================================
// Types
// =============================================================================
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

// =============================================================================
// Context
// =============================================================================
const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// =============================================================================
// Provider
// =============================================================================
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9)
    const newToast: Toast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])

    // Auto-remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }, [removeToast])

  // Convenience methods
  const success = useCallback((title: string, description?: string) => {
    addToast({ type: 'success', title, description })
  }, [addToast])

  const error = useCallback((title: string, description?: string) => {
    addToast({ type: 'error', title, description, duration: 7000 })
  }, [addToast])

  const warning = useCallback((title: string, description?: string) => {
    addToast({ type: 'warning', title, description })
  }, [addToast])

  const info = useCallback((title: string, description?: string) => {
    addToast({ type: 'info', title, description })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// =============================================================================
// Toast Container
// =============================================================================
function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[]
  removeToast: (id: string) => void
}) {
  if (typeof window === 'undefined') return null
  if (toasts.length === 0) return null

  return createPortal(
    <div
      className={cn(
        'fixed bottom-4 right-4 z-[1700]',
        'flex flex-col gap-3 pointer-events-none',
        'max-w-sm w-full'
      )}
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>,
    document.body
  )
}

// =============================================================================
// Toast Item
// =============================================================================
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[rgb(var(--success-500))]" />,
    error: <AlertCircle className="w-5 h-5 text-[rgb(var(--error-500))]" />,
    warning: <AlertTriangle className="w-5 h-5 text-[rgb(var(--warning-500))]" />,
    info: <Info className="w-5 h-5 text-[rgb(var(--primary-500))]" />,
  }

  const borderColors = {
    success: 'border-l-[rgb(var(--success-500))]',
    error: 'border-l-[rgb(var(--error-500))]',
    warning: 'border-l-[rgb(var(--warning-500))]',
    info: 'border-l-[rgb(var(--primary-500))]',
  }

  return (
    <div
      className={cn(
        'pointer-events-auto',
        'bg-[rgb(var(--background-elevated))]',
        'rounded-xl shadow-[var(--shadow-lg)]',
        'border border-[rgb(var(--border-light))]',
        'border-l-4',
        borderColors[toast.type],
        'p-4 pr-10',
        'animate-slide-up',
        'relative overflow-hidden'
      )}
      role="alert"
    >
      <button
        onClick={onClose}
        className={cn(
          'absolute top-3 right-3 p-1 rounded-md',
          'text-[rgb(var(--foreground-muted))] hover:text-[rgb(var(--foreground))]',
          'hover:bg-[rgb(var(--neutral-100))]',
          'transition-colors'
        )}
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex gap-3">
        <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-[rgb(var(--foreground))]">
            {toast.title}
          </p>
          {toast.description && (
            <p className="mt-1 text-sm text-[rgb(var(--foreground-secondary))]">
              {toast.description}
            </p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium text-[rgb(var(--primary-600))] hover:text-[rgb(var(--primary-700))]"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export { ToastContainer, ToastItem }
