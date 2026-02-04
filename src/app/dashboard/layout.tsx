import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/sidebar'
import MobileHeader from '@/components/dashboard/mobile-header'
import { ErrorBoundary } from '@/components/error-boundary'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*, agencies(*)')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen bg-[rgb(var(--background))]">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar user={profile} />
      </div>

      {/* Mobile Header */}
      <MobileHeader user={profile} />

      {/* Main Content */}
      <main 
        className="flex-1 overflow-y-auto pt-16 lg:pt-0"
        role="main"
        aria-label="Main content"
      >
        <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>

      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[rgb(var(--primary-600))] focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>
    </div>
  )
}
