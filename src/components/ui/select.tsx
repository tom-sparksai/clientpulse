'use client'

import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, AlertCircle } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: ReactNode
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
      size = 'md',
      leftIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    const sizeStyles = {
      sm: 'h-8 text-sm pl-3 pr-8',
      md: 'h-10 text-sm pl-3.5 pr-9',
      lg: 'h-12 text-base pl-4 pr-10',
    }

    const iconPadding = {
      sm: 'pl-9',
      md: 'pl-10',
      lg: 'pl-11',
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
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--foreground-muted))] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              // Base
              'w-full appearance-none rounded-lg cursor-pointer',
              'bg-[rgb(var(--background-elevated))]',
              'border border-[rgb(var(--border))]',
              'text-[rgb(var(--foreground))]',
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
              leftIcon && iconPadding[size],
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-[rgb(var(--foreground-muted))]">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Dropdown arrow */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {error ? (
              <AlertCircle className="w-4 h-4 text-[rgb(var(--error-500))]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[rgb(var(--foreground-muted))]" />
            )}
          </div>
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

Select.displayName = 'Select'

export { Select }
