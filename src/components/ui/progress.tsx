'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// =============================================================================
// Progress Bar
// =============================================================================
export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  animated?: boolean
}

function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  animated = true,
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  const variantStyles = {
    default: 'from-[rgb(var(--primary-500))] to-[rgb(var(--primary-400))]',
    success: 'from-[rgb(var(--success-500))] to-[rgb(var(--success-400))]',
    warning: 'from-[rgb(var(--warning-500))] to-[rgb(var(--warning-400))]',
    error: 'from-[rgb(var(--error-500))] to-[rgb(var(--error-400))]',
  }

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[rgb(var(--foreground-secondary))]">
            Progress
          </span>
          <span className="text-sm font-semibold text-[rgb(var(--foreground))] tabular-nums">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-[rgb(var(--neutral-100))] rounded-full overflow-hidden',
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r',
            variantStyles[variant],
            animated && 'transition-all duration-500 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// Progress Ring / Circle
// =============================================================================
export interface ProgressRingProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  strokeWidth?: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  label?: string
}

function ProgressRing({
  value,
  max = 100,
  size = 'md',
  strokeWidth,
  variant = 'default',
  showLabel = true,
  label,
  className,
  ...props
}: ProgressRingProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeConfig = {
    sm: { dimension: 48, stroke: 4, fontSize: 'text-xs' },
    md: { dimension: 64, stroke: 5, fontSize: 'text-sm' },
    lg: { dimension: 96, stroke: 6, fontSize: 'text-xl' },
    xl: { dimension: 128, stroke: 8, fontSize: 'text-2xl' },
  }

  const config = sizeConfig[size]
  const radius = (config.dimension - (strokeWidth || config.stroke)) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const variantColors = {
    default: 'rgb(var(--primary-500))',
    success: 'rgb(var(--success-500))',
    warning: 'rgb(var(--warning-500))',
    error: 'rgb(var(--error-500))',
  }

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)} {...props}>
      <div className="relative" style={{ width: config.dimension, height: config.dimension }}>
        <svg
          className="transform -rotate-90"
          width={config.dimension}
          height={config.dimension}
        >
          {/* Background circle */}
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke="rgb(var(--neutral-100))"
            strokeWidth={strokeWidth || config.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke={variantColors[variant]}
            strokeWidth={strokeWidth || config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('font-bold text-[rgb(var(--foreground))] tabular-nums', config.fontSize)}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-sm text-[rgb(var(--foreground-secondary))]">
          {label}
        </span>
      )}
    </div>
  )
}

// =============================================================================
// Steps Progress
// =============================================================================
export interface StepsProgressProps extends HTMLAttributes<HTMLDivElement> {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

function StepsProgress({
  currentStep,
  totalSteps,
  labels,
  className,
  ...props
}: StepsProgressProps) {
  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="flex items-center">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                  isCompleted && 'bg-[rgb(var(--primary-600))] text-white',
                  isCurrent && 'bg-[rgb(var(--primary-600))] text-white ring-4 ring-[rgb(var(--primary-100))]',
                  !isCompleted && !isCurrent && 'bg-[rgb(var(--neutral-200))] text-[rgb(var(--foreground-muted))]'
                )}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              
              {/* Connector line */}
              {index < totalSteps - 1 && (
                <div className="flex-1 h-0.5 mx-2">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      isCompleted ? 'bg-[rgb(var(--primary-600))]' : 'bg-[rgb(var(--neutral-200))]'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Labels */}
      {labels && (
        <div className="flex mt-2">
          {labels.map((label, index) => (
            <div key={index} className={cn('flex-1 text-xs text-center', index === totalSteps - 1 && 'flex-none')}>
              <span
                className={cn(
                  index + 1 <= currentStep
                    ? 'text-[rgb(var(--primary-600))] font-medium'
                    : 'text-[rgb(var(--foreground-muted))]'
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { ProgressBar, ProgressRing, StepsProgress }
