'use client'

import { createContext, useContext, useState, ReactNode, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// =============================================================================
// Context
// =============================================================================
interface TabsContextType {
  value: string
  onChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

// =============================================================================
// Tabs Root
// =============================================================================
export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

function Tabs({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  children,
  className,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const onChange = (newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// =============================================================================
// Tabs List
// =============================================================================
export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'pills' | 'underline'
}

function TabsList({ variant = 'default', className, children, ...props }: TabsListProps) {
  const variantStyles = {
    default: 'bg-[rgb(var(--neutral-100))] p-1 rounded-lg gap-1',
    pills: 'gap-2',
    underline: 'border-b border-[rgb(var(--border))] gap-6',
  }

  return (
    <div
      role="tablist"
      className={cn('flex items-center', variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
}

// =============================================================================
// Tab Trigger
// =============================================================================
export interface TabTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
  variant?: 'default' | 'pills' | 'underline'
}

function TabTrigger({
  value,
  disabled = false,
  variant = 'default',
  className,
  children,
  ...props
}: TabTriggerProps) {
  const { value: selectedValue, onChange } = useTabsContext()
  const isSelected = value === selectedValue

  const variantStyles = {
    default: cn(
      'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
      isSelected
        ? 'bg-[rgb(var(--background-elevated))] text-[rgb(var(--foreground))] shadow-sm'
        : 'text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--foreground))]'
    ),
    pills: cn(
      'px-4 py-2 rounded-full text-sm font-medium transition-all',
      isSelected
        ? 'bg-[rgb(var(--primary-600))] text-white shadow-sm'
        : 'text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--neutral-100))]'
    ),
    underline: cn(
      'pb-3 text-sm font-medium transition-all relative',
      isSelected
        ? 'text-[rgb(var(--primary-600))]'
        : 'text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--foreground))]',
      // Active indicator
      isSelected && 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[rgb(var(--primary-600))] after:rounded-full'
    ),
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => onChange(value)}
      className={cn(
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// =============================================================================
// Tab Content
// =============================================================================
export interface TabContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

function TabContent({ value, className, children, ...props }: TabContentProps) {
  const { value: selectedValue } = useTabsContext()

  if (value !== selectedValue) return null

  return (
    <div
      role="tabpanel"
      className={cn('animate-fade-in', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabTrigger, TabContent }
