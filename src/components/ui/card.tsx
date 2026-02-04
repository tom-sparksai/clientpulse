'use client'

import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// =============================================================================
// Card
// =============================================================================
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'none', hover = false, children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-[rgb(var(--card))] border border-[rgb(var(--border-light))] shadow-[var(--shadow-sm)]',
      elevated: 'bg-[rgb(var(--card))] border border-[rgb(var(--border-light))/0.5] shadow-[var(--shadow-md)]',
      outlined: 'bg-transparent border border-[rgb(var(--border))]',
      glass: 'bg-[rgb(var(--background-elevated))/0.8] backdrop-blur-xl border border-[rgb(var(--border-light))/0.5]',
    }

    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl',
          variantStyles[variant],
          paddingStyles[padding],
          hover && 'transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// =============================================================================
// Card Header
// =============================================================================
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: ReactNode
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 border-b border-[rgb(var(--border-light))]', className)}
        {...props}
      >
        {children || (
          <div className="flex items-start justify-between gap-4">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-[rgb(var(--foreground-muted))] mt-0.5">
                  {description}
                </p>
              )}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// =============================================================================
// Card Content
// =============================================================================
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
)

CardContent.displayName = 'CardContent'

// =============================================================================
// Card Footer
// =============================================================================
const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-0 flex items-center gap-3', className)}
      {...props}
    />
  )
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardContent, CardFooter }
