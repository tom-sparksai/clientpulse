'use client'

import { Fragment, HTMLAttributes, ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { X, AlertTriangle, CheckCircle2, Info, AlertCircle } from 'lucide-react'
import { Button } from './button'

// =============================================================================
// Modal
// =============================================================================
export interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  className?: string
}

function Modal({
  open,
  onClose,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className,
}: ModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[90vw] max-h-[90vh]',
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-[rgb(var(--background-elevated))]',
          'rounded-2xl shadow-[var(--shadow-xl)]',
          'animate-scale-in',
          sizeStyles[size],
          className
        )}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className={cn(
              'absolute top-4 right-4 p-2 rounded-lg',
              'text-[rgb(var(--foreground-muted))] hover:text-[rgb(var(--foreground))]',
              'hover:bg-[rgb(var(--neutral-100))]',
              'transition-colors z-10'
            )}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {children}
      </div>
    </div>
  )

  // Use portal to render at document root
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }
  return null
}

// =============================================================================
// Modal Header
// =============================================================================
const ModalHeader = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 pb-0', className)} {...props}>
    {children}
  </div>
)

// =============================================================================
// Modal Title
// =============================================================================
const ModalTitle = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn('text-xl font-semibold text-[rgb(var(--foreground))]', className)}
    {...props}
  >
    {children}
  </h2>
)

// =============================================================================
// Modal Description
// =============================================================================
const ModalDescription = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn('mt-2 text-sm text-[rgb(var(--foreground-secondary))]', className)}
    {...props}
  >
    {children}
  </p>
)

// =============================================================================
// Modal Content
// =============================================================================
const ModalContent = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6', className)} {...props}>
    {children}
  </div>
)

// =============================================================================
// Modal Footer
// =============================================================================
const ModalFooter = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'p-6 pt-0 flex items-center justify-end gap-3',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

// =============================================================================
// Confirm Dialog (preset for confirmations)
// =============================================================================
export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info' | 'success'
  loading?: boolean
}

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const icons = {
    danger: <AlertTriangle className="w-6 h-6 text-[rgb(var(--error-500))]" />,
    warning: <AlertCircle className="w-6 h-6 text-[rgb(var(--warning-500))]" />,
    info: <Info className="w-6 h-6 text-[rgb(var(--primary-500))]" />,
    success: <CheckCircle2 className="w-6 h-6 text-[rgb(var(--success-500))]" />,
  }

  const iconBg = {
    danger: 'bg-[rgb(var(--error-100))]',
    warning: 'bg-[rgb(var(--warning-100))]',
    info: 'bg-[rgb(var(--primary-100))]',
    success: 'bg-[rgb(var(--success-100))]',
  }

  const confirmVariant = variant === 'danger' ? 'danger' : 'primary'

  return (
    <Modal open={open} onClose={onClose} size="sm" showCloseButton={false}>
      <ModalContent className="text-center">
        <div className={cn('w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center', iconBg[variant])}>
          {icons[variant]}
        </div>
        <ModalTitle className="text-center">{title}</ModalTitle>
        {description && (
          <ModalDescription className="text-center">{description}</ModalDescription>
        )}
      </ModalContent>
      <ModalFooter className="justify-center">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
  ConfirmDialog,
}
