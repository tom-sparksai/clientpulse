'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  // Status-based styling (auto-maps status to variant)
  status?: 'todo' | 'planning' | 'in_progress' | 'review' | 'done' | 'completed' | 'on_hold' | 'overdue' | 'draft' | 'sent' | 'paid'
  dot?: boolean
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size = 'md', status, dot = false, children, ...props }, ref) => {
    // Map status to variant
    const statusToVariant: Record<string, BadgeProps['variant']> = {
      todo: 'default',
      planning: 'info',
      in_progress: 'warning',
      review: 'info',
      done: 'success',
      completed: 'success',
      on_hold: 'default',
      overdue: 'error',
      draft: 'default',
      sent: 'info',
      paid: 'success',
    }

    const resolvedVariant = status ? statusToVariant[status] || 'default' : variant || 'default'

    const variantStyles = {
      default: 'bg-[rgb(var(--neutral-100))] text-[rgb(var(--neutral-600))] border-[rgb(var(--neutral-200))]',
      success: 'bg-[rgb(var(--success-50))] text-[rgb(var(--success-700))] border-[rgb(var(--success-200))]',
      warning: 'bg-[rgb(var(--warning-50))] text-[rgb(var(--warning-700))] border-[rgb(var(--warning-200))]',
      error: 'bg-[rgb(var(--error-50))] text-[rgb(var(--error-700))] border-[rgb(var(--error-200))]',
      info: 'bg-[rgb(var(--primary-50))] text-[rgb(var(--primary-700))] border-[rgb(var(--primary-200))]',
      outline: 'bg-transparent text-[rgb(var(--foreground-secondary))] border-[rgb(var(--border))]',
    }

    const sizeStyles = {
      sm: 'h-5 px-2 text-[11px]',
      md: 'h-6 px-2.5 text-xs',
      lg: 'h-7 px-3 text-sm',
    }

    const dotColors = {
      default: 'bg-[rgb(var(--neutral-400))]',
      success: 'bg-[rgb(var(--success-500))]',
      warning: 'bg-[rgb(var(--warning-500))]',
      error: 'bg-[rgb(var(--error-500))]',
      info: 'bg-[rgb(var(--primary-500))]',
      outline: 'bg-[rgb(var(--foreground-muted))]',
    }

    // Format status text for display
    const displayText = status 
      ? status.replace(/_/g, ' ')
      : children

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 font-medium rounded-full border',
          'capitalize whitespace-nowrap',
          variantStyles[resolvedVariant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className={cn(
            'w-1.5 h-1.5 rounded-full',
            resolvedVariant === 'warning' && 'animate-pulse',
            dotColors[resolvedVariant]
          )} />
        )}
        {displayText}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
