'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  Menu,
  X,
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

interface MobileHeaderProps {
  user: {
    full_name: string
    email: string
    agencies: {
      name: string
    } | null
  } | null
}

export default function MobileHeader({ user }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[rgb(var(--background-elevated))] border-b border-[rgb(var(--border-light))]">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-[rgb(var(--foreground))]">ClientPulse</span>
          </Link>

          {/* Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--neutral-100))] transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <nav
        className={cn(
          'lg:hidden fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw]',
          'bg-[rgb(var(--background-elevated))] shadow-2xl',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Mobile navigation"
      >
        {/* Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--border-light))]">
          <span className="font-semibold text-[rgb(var(--foreground))]">Menu</span>
          <button
            onClick={closeMenu}
            className="p-2 rounded-xl text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--neutral-100))] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-[rgb(var(--primary-50))] text-[rgb(var(--primary-700))]'
                    : 'text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--neutral-100))] hover:text-[rgb(var(--foreground))]'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive
                      ? 'text-[rgb(var(--primary-600))]'
                      : 'text-[rgb(var(--foreground-muted))] group-hover:text-[rgb(var(--foreground-secondary))]'
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-[rgb(var(--primary-400))]" />
                )}
              </Link>
            )
          })}
        </div>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgb(var(--border-light))] bg-[rgb(var(--background-elevated))]">
          {/* User Card */}
          <div className="mb-3 p-3 rounded-xl bg-[rgb(var(--neutral-50))] border border-[rgb(var(--border-light))]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(var(--primary-400))] to-[rgb(var(--primary-600))] flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[rgb(var(--foreground))] truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-[rgb(var(--foreground-muted))] truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--error-600))] hover:bg-[rgb(var(--error-50))] rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </nav>
    </>
  )
}
