'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  lines?: number
}

function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  lines = 1,
  ...props
}: SkeletonProps) {
  const baseStyles = cn(
    'animate-shimmer',
    'bg-gradient-to-r',
    'from-[rgb(var(--neutral-200))] via-[rgb(var(--neutral-100))] to-[rgb(var(--neutral-200))]',
    'bg-[length:200%_100%]'
  )

  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  }

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  if (lines > 1) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseStyles, variantStyles[variant])}
            style={{
              ...style,
              width: i === lines - 1 ? '75%' : width,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
      {...props}
    />
  )
}

// =============================================================================
// Preset Skeletons for common use cases
// =============================================================================

function SkeletonCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 space-y-4', className)} {...props}>
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton lines={3} />
    </div>
  )
}

function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { rows?: number; columns?: number }) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {/* Header */}
      <div className="flex gap-4 py-3 border-b border-[rgb(var(--border-light))]">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width={`${100 / columns}%`} height={12} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width={`${100 / columns}%`} height={16} />
          ))}
        </div>
      ))}
    </div>
  )
}

function SkeletonList({
  items = 5,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { items?: number }) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="rounded" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={16} />
            <Skeleton width="50%" height={12} />
          </div>
          <Skeleton variant="rounded" width={80} height={24} />
        </div>
      ))}
    </div>
  )
}

function SkeletonStats({
  count = 4,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { count?: number }) {
  return (
    <div className={cn('grid gap-6', className)} style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 rounded-xl border border-[rgb(var(--border-light))]">
          <div className="flex items-start justify-between mb-4">
            <Skeleton variant="rounded" width={48} height={48} />
            <Skeleton variant="rounded" width={60} height={20} />
          </div>
          <Skeleton width="60%" height={28} className="mb-1" />
          <Skeleton width="40%" height={14} />
        </div>
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonList, SkeletonStats }
