'use client'

import { ReactNode, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { 
  FolderKanban, 
  Users, 
  FileText, 
  MessageSquare, 
  Search,
  InboxIcon,
  FileQuestion,
  WifiOff,
  ServerCrash,
  LucideIcon
} from 'lucide-react'
import { Button } from './button'

// =============================================================================
// Empty State
// =============================================================================
export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon | ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'ghost'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  size?: 'sm' | 'md' | 'lg'
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className,
  ...props
}: EmptyStateProps) {
  const sizeStyles = {
    sm: {
      wrapper: 'py-8',
      iconWrapper: 'w-14 h-14 mb-4',
      icon: 'w-7 h-7',
      title: 'text-base',
      description: 'text-sm max-w-xs',
    },
    md: {
      wrapper: 'py-12',
      iconWrapper: 'w-20 h-20 mb-6',
      icon: 'w-10 h-10',
      title: 'text-lg',
      description: 'text-sm max-w-sm',
    },
    lg: {
      wrapper: 'py-20',
      iconWrapper: 'w-24 h-24 mb-8',
      icon: 'w-12 h-12',
      title: 'text-xl',
      description: 'text-base max-w-md',
    },
  }

  const styles = sizeStyles[size]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4',
        styles.wrapper,
        className
      )}
      {...props}
    >
      {/* Icon */}
      {Icon && (
        <div
          className={cn(
            'rounded-2xl bg-[rgb(var(--neutral-100))] flex items-center justify-center',
            styles.iconWrapper
          )}
        >
          {typeof Icon === 'function' ? (
            <Icon className={cn(styles.icon, 'text-[rgb(var(--foreground-muted))]')} />
          ) : (
            Icon
          )}
        </div>
      )}

      {/* Title */}
      <h3
        className={cn(
          'font-semibold text-[rgb(var(--foreground))] mb-2',
          styles.title
        )}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={cn(
            'text-[rgb(var(--foreground-secondary))]',
            styles.description
          )}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-6">
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button variant={action.variant || 'primary'} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Preset Empty States
// =============================================================================

// No Projects
export function NoProjectsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={FolderKanban}
      title="No projects yet"
      description="Get started by creating your first project to track client work"
      action={onAction ? { label: 'Create Project', onClick: onAction } : undefined}
    />
  )
}

// No Clients
export function NoClientsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No clients yet"
      description="Add your first client to start managing projects and communication"
      action={onAction ? { label: 'Add Client', onClick: onAction } : undefined}
    />
  )
}

// No Invoices
export function NoInvoicesEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="No invoices yet"
      description="Create invoices to track payments and get paid faster"
      action={onAction ? { label: 'Create Invoice', onClick: onAction } : undefined}
    />
  )
}

// No Messages
export function NoMessagesEmpty() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No messages yet"
      description="Start the conversation!"
      size="sm"
    />
  )
}

// No Search Results
export function NoSearchResultsEmpty({ query, onClear }: { query?: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={query ? `No results matching "${query}"` : 'Try adjusting your search or filters'}
      secondaryAction={onClear ? { label: 'Clear search', onClick: onClear } : undefined}
    />
  )
}

// Empty Inbox
export function EmptyInboxEmpty() {
  return (
    <EmptyState
      icon={InboxIcon}
      title="All caught up!"
      description="Nothing to see here. Enjoy the peace and quiet."
    />
  )
}

// Error State
export function ErrorState({ 
  title = 'Something went wrong', 
  description = 'An error occurred while loading this content.',
  onRetry 
}: { 
  title?: string
  description?: string
  onRetry?: () => void 
}) {
  return (
    <EmptyState
      icon={ServerCrash}
      title={title}
      description={description}
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    />
  )
}

// Offline State
export function OfflineState() {
  return (
    <EmptyState
      icon={WifiOff}
      title="You're offline"
      description="Check your internet connection and try again."
    />
  )
}

// Not Found State
export function NotFoundState({ onGoBack }: { onGoBack?: () => void }) {
  return (
    <EmptyState
      icon={FileQuestion}
      title="Page not found"
      description="The page you're looking for doesn't exist or has been moved."
      action={onGoBack ? { label: 'Go Back', onClick: onGoBack, variant: 'secondary' } : undefined}
    />
  )
}

export { EmptyState }
