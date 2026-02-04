import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/sidebar'

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
      <Sidebar user={profile} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  )
}
