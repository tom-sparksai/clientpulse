'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
}

// Generate consistent color from name
const getColorFromName = (name: string) => {
  const colors = [
    'from-[rgb(var(--primary-400))] to-[rgb(var(--primary-600))]',
    'from-[rgb(var(--success-400))] to-[rgb(var(--success-600))]',
    'from-[rgb(var(--warning-400))] to-[rgb(var(--warning-600))]',
    'from-[rgb(var(--error-400))] to-[rgb(var(--error-600))]',
    'from-rose-400 to-rose-600',
    'from-violet-400 to-violet-600',
    'from-cyan-400 to-cyan-600',
    'from-emerald-400 to-emerald-600',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

// Get initials from name
const getInitials = (name: string) => {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name = '', size = 'md', status, ...props }, ref) => {
    const sizeStyles = {
      xs: 'w-6 h-6 text-[10px]',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
      '2xl': 'w-24 h-24 text-2xl',
    }

    const statusSizes = {
      xs: 'w-1.5 h-1.5 border',
      sm: 'w-2 h-2 border',
      md: 'w-2.5 h-2.5 border-2',
      lg: 'w-3 h-3 border-2',
      xl: 'w-4 h-4 border-2',
      '2xl': 'w-5 h-5 border-2',
    }

    const statusColors = {
      online: 'bg-[rgb(var(--success-500))]',
      offline: 'bg-[rgb(var(--neutral-400))]',
      away: 'bg-[rgb(var(--warning-500))]',
      busy: 'bg-[rgb(var(--error-500))]',
    }

    return (
      <div ref={ref} className={cn('relative inline-flex shrink-0', className)} {...props}>
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold overflow-hidden',
            !src && `bg-gradient-to-br ${getColorFromName(name)} text-white`,
            sizeStyles[size]
          )}
        >
          {src ? (
            <Image
              src={src}
              alt={alt || name}
              fill
              className="object-cover"
            />
          ) : (
            <span>{getInitials(name)}</span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-white',
              statusSizes[size],
              statusColors[status]
            )}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

// =============================================================================
// Avatar Group
// =============================================================================
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  avatars: Array<{ src?: string; name: string }>
  max?: number
  size?: AvatarProps['size']
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, avatars, max = 4, size = 'md', ...props }, ref) => {
    const displayed = avatars.slice(0, max)
    const remaining = avatars.length - max

    return (
      <div ref={ref} className={cn('flex -space-x-2', className)} {...props}>
        {displayed.map((avatar, i) => (
          <Avatar
            key={i}
            src={avatar.src}
            name={avatar.name}
            size={size}
            className="ring-2 ring-white"
          />
        ))}
        {remaining > 0 && (
          <div
            className={cn(
              'rounded-full bg-[rgb(var(--neutral-200))] text-[rgb(var(--neutral-600))] font-medium',
              'flex items-center justify-center ring-2 ring-white',
              size === 'xs' && 'w-6 h-6 text-[10px]',
              size === 'sm' && 'w-8 h-8 text-xs',
              size === 'md' && 'w-10 h-10 text-sm',
              size === 'lg' && 'w-12 h-12 text-base',
              size === 'xl' && 'w-16 h-16 text-lg',
              size === '2xl' && 'w-24 h-24 text-2xl'
            )}
          >
            +{remaining}
          </div>
        )}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'

export { Avatar, AvatarGroup }
