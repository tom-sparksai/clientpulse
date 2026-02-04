'use client'

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = 'md',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    const sizeStyles = {
      sm: 'h-8 text-sm px-3',
      md: 'h-10 text-sm px-3.5',
      lg: 'h-12 text-base px-4',
    }

    const iconPadding = {
      sm: { left: 'pl-9', right: 'pr-9' },
      md: { left: 'pl-10', right: 'pr-10' },
      lg: { left: 'pl-11', right: 'pr-11' },
    }

    const iconPosition = {
      sm: 'left-3',
      md: 'left-3.5',
      lg: 'left-4',
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[rgb(var(--foreground))] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className={cn(
              'absolute top-1/2 -translate-y-1/2 text-[rgb(var(--foreground-muted))]',
              iconPosition[size]
            )}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={inputId}
            disabled={disabled}
            className={cn(
              // Base
              'w-full rounded-lg',
              'bg-[rgb(var(--background-elevated))]',
              'border border-[rgb(var(--border))]',
              'text-[rgb(var(--foreground))]',
              'placeholder:text-[rgb(var(--foreground-muted))]',
              'transition-all duration-200',
              // Focus
              'focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] focus:ring-offset-0',
              'focus:border-[rgb(var(--ring))]',
              // Hover
              'hover:border-[rgb(var(--neutral-300))]',
              // Disabled
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[rgb(var(--neutral-100))]',
              // Error
              error && 'border-[rgb(var(--error-500))] focus:ring-[rgb(var(--error-500))] focus:border-[rgb(var(--error-500))]',
              // Size
              sizeStyles[size],
              // Icon padding
              leftIcon && iconPadding[size].left,
              (rightIcon || error) && iconPadding[size].right,
              className
            )}
            {...props}
          />
          {(rightIcon || error) && (
            <div className={cn(
              'absolute top-1/2 -translate-y-1/2 right-3',
              error ? 'text-[rgb(var(--error-500))]' : 'text-[rgb(var(--foreground-muted))]'
            )}>
              {error ? <AlertCircle className="w-4 h-4" /> : rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn(
            'mt-1.5 text-sm',
            error ? 'text-[rgb(var(--error-600))]' : 'text-[rgb(var(--foreground-muted))]'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
