'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    const variantStyles = {
      primary: `
        bg-[rgb(var(--primary-600))] text-white 
        hover:bg-[rgb(var(--primary-700))] 
        active:bg-[rgb(var(--primary-800))]
        shadow-sm hover:shadow-[var(--shadow-primary)]
        hover:-translate-y-0.5 active:translate-y-0
      `,
      secondary: `
        bg-[rgb(var(--neutral-100))] text-[rgb(var(--neutral-700))]
        hover:bg-[rgb(var(--neutral-200))]
        active:bg-[rgb(var(--neutral-300))]
      `,
      ghost: `
        bg-transparent text-[rgb(var(--foreground-secondary))]
        hover:bg-[rgb(var(--neutral-100))] hover:text-[rgb(var(--foreground))]
        active:bg-[rgb(var(--neutral-200))]
      `,
      danger: `
        bg-[rgb(var(--error-600))] text-white
        hover:bg-[rgb(var(--error-700))]
        active:bg-[rgb(var(--error-800))]
        shadow-sm hover:shadow-[var(--shadow-error)]
        hover:-translate-y-0.5 active:translate-y-0
      `,
      outline: `
        bg-transparent text-[rgb(var(--primary-600))]
        border-2 border-[rgb(var(--primary-600))]
        hover:bg-[rgb(var(--primary-50))]
        active:bg-[rgb(var(--primary-100))]
      `,
    }

    const sizeStyles = {
      xs: 'h-7 px-2.5 text-xs gap-1.5 rounded-md',
      sm: 'h-8 px-3 text-sm gap-1.5 rounded-md',
      md: 'h-10 px-4 text-sm gap-2 rounded-lg',
      lg: 'h-12 px-5 text-base gap-2 rounded-lg',
      xl: 'h-14 px-6 text-base gap-2.5 rounded-xl',
    }

    const iconSizes = {
      xs: 'w-3.5 h-3.5',
      sm: 'w-4 h-4',
      md: 'w-4.5 h-4.5',
      lg: 'w-5 h-5',
      xl: 'w-5.5 h-5.5',
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none',
          // Variant
          variantStyles[variant],
          // Size
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
            <span>{children}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className={iconSizes[size]}>{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className={iconSizes[size]}>{icon}</span>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
