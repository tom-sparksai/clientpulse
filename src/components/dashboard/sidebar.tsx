'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
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

interface SidebarProps {
  user: {
    full_name: string
    email: string
    agencies: {
      name: string
    } | null
  } | null
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-72 bg-[rgb(var(--background-elevated))] border-r border-[rgb(var(--border-light))] flex flex-col h-screen">
      {/* Logo & Agency */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-[rgb(var(--foreground))] tracking-tight">
              ClientPulse
            </h1>
            {user?.agencies && (
              <p className="text-xs text-[rgb(var(--foreground-muted))] truncate">
                {user.agencies.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-[rgb(var(--primary-50))] text-[rgb(var(--primary-700))] shadow-sm'
                    : 'text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--neutral-100))] hover:text-[rgb(var(--foreground))]'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 transition-colors',
                  isActive 
                    ? 'text-[rgb(var(--primary-600))]' 
                    : 'text-[rgb(var(--foreground-muted))] group-hover:text-[rgb(var(--foreground-secondary))]'
                )} />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-[rgb(var(--primary-400))]" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-[rgb(var(--border-light))]">
        {/* User card */}
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
        
        {/* Sign out button */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--error-600))] hover:bg-[rgb(var(--error-50))] rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
