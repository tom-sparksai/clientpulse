// =============================================================================
// ClientPulse UI Component Library
// =============================================================================

// Button
export { Button } from './button'
export type { ButtonProps } from './button'

// Input
export { Input } from './input'
export type { InputProps } from './input'

// Select
export { Select } from './select'
export type { SelectProps, SelectOption } from './select'

// Card
export { Card, CardHeader, CardContent, CardFooter } from './card'
export type { CardProps, CardHeaderProps } from './card'

// Badge
export { Badge } from './badge'
export type { BadgeProps } from './badge'

// Avatar
export { Avatar, AvatarGroup } from './avatar'
export type { AvatarProps, AvatarGroupProps } from './avatar'

// Modal
export { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalContent, 
  ModalFooter,
  ConfirmDialog 
} from './modal'
export type { ModalProps, ConfirmDialogProps } from './modal'

// Toast
export { ToastProvider, useToast, ToastContainer, ToastItem } from './toast'
export type { Toast, ToastType } from './toast'

// Empty State
export {
  EmptyState,
  NoProjectsEmpty,
  NoClientsEmpty,
  NoInvoicesEmpty,
  NoMessagesEmpty,
  NoSearchResultsEmpty,
  EmptyInboxEmpty,
  ErrorState,
  OfflineState,
  NotFoundState,
} from './empty-state'
export type { EmptyStateProps } from './empty-state'

// Skeleton
export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonTable, 
  SkeletonList, 
  SkeletonStats 
} from './skeleton'
export type { SkeletonProps } from './skeleton'

// Tabs
export { Tabs, TabsList, TabTrigger, TabContent } from './tabs'
export type { TabsProps, TabsListProps, TabTriggerProps, TabContentProps } from './tabs'

// Progress
export { ProgressBar, ProgressRing, StepsProgress } from './progress'
export type { ProgressBarProps, ProgressRingProps, StepsProgressProps } from './progress'
