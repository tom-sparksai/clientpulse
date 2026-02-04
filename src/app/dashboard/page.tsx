import { createClient } from '@/lib/supabase/server'
import { formatCurrency, getStatusColor } from '@/lib/utils'
import Link from 'next/link'
import { 
  FolderKanban, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user's agency
  const { data: profile } = await supabase
    .from('users')
    .select('agency_id, full_name')
    .eq('id', user!.id)
    .single()

  const agencyId = profile?.agency_id

  // Get stats
  const [
    { count: projectCount },
    { count: clientCount },
    { data: recentProjects },
    { data: pendingInvoices },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('agency_id', agencyId!),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('agency_id', agencyId!),
    supabase.from('projects').select('*, clients(name)').eq('agency_id', agencyId!).order('updated_at', { ascending: false }).limit(5),
    supabase.from('invoices').select('*, clients(name)').eq('agency_id', agencyId!).in('status', ['sent', 'overdue']).limit(5),
  ])

  const totalPending = pendingInvoices?.reduce((sum, inv) => sum + inv.amount, 0) || 0
  const inProgressCount = recentProjects?.filter(p => p.status === 'in_progress').length || 0

  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] tracking-tight">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-[rgb(var(--foreground-secondary))] mt-1">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Projects */}
        <div className="card p-6 hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[rgb(var(--primary-100))] to-[rgb(var(--primary-50))] flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-[rgb(var(--primary-600))]" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-[rgb(var(--success-600))] bg-[rgb(var(--success-50))] px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              Active
            </span>
          </div>
          <p className="text-3xl font-bold text-[rgb(var(--foreground))] tracking-tight">
            {projectCount || 0}
          </p>
          <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
            Total Projects
          </p>
        </div>

        {/* Clients */}
        <div className="card p-6 hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[rgb(var(--success-100))] to-[rgb(var(--success-50))] flex items-center justify-center">
              <Users className="w-6 h-6 text-[rgb(var(--success-600))]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[rgb(var(--foreground))] tracking-tight">
            {clientCount || 0}
          </p>
          <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
            Total Clients
          </p>
        </div>

        {/* Pending Payments */}
        <div className="card p-6 hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[rgb(var(--warning-100))] to-[rgb(var(--warning-50))] flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[rgb(var(--warning-600))]" />
            </div>
            {totalPending > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-[rgb(var(--warning-700))] bg-[rgb(var(--warning-50))] px-2 py-1 rounded-full">
                <AlertCircle className="w-3 h-3" />
                Pending
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-[rgb(var(--foreground))] tracking-tight">
            {formatCurrency(totalPending)}
          </p>
          <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
            Pending Payments
          </p>
        </div>

        {/* In Progress */}
        <div className="card p-6 hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[rgb(var(--primary-100))] to-[rgb(var(--primary-50))] flex items-center justify-center">
              <Clock className="w-6 h-6 text-[rgb(var(--primary-600))]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[rgb(var(--foreground))] tracking-tight">
            {inProgressCount}
          </p>
          <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
            In Progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card">
          <div className="p-6 border-b border-[rgb(var(--border-light))]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">
                  Recent Projects
                </h2>
                <p className="text-sm text-[rgb(var(--foreground-muted))] mt-0.5">
                  Your latest project activity
                </p>
              </div>
              <Link 
                href="/dashboard/projects" 
                className="flex items-center gap-1 text-sm font-medium text-[rgb(var(--primary-600))] hover:text-[rgb(var(--primary-700))] transition-colors"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-4">
            {recentProjects && recentProjects.length > 0 ? (
              <div className="space-y-2">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className="block p-4 rounded-xl hover:bg-[rgb(var(--neutral-50))] transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[rgb(var(--foreground))] group-hover:text-[rgb(var(--primary-600))] transition-colors truncate">
                          {project.name}
                        </h3>
                        <p className="text-sm text-[rgb(var(--foreground-muted))] truncate">
                          {project.clients?.name}
                        </p>
                      </div>
                      <span className={`badge badge-${project.status} ml-3`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="progress">
                          <div
                            className="progress-bar"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[rgb(var(--foreground-secondary))] tabular-nums">
                        {project.progress}%
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[rgb(var(--foreground-muted))] group-hover:text-[rgb(var(--primary-600))] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state py-12">
                <FolderKanban className="empty-state-icon" />
                <p className="empty-state-title">No projects yet</p>
                <p className="empty-state-description">
                  Create your first project to start tracking progress
                </p>
                <Link
                  href="/dashboard/projects/new"
                  className="btn btn-primary mt-4"
                >
                  Create Project
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="card">
          <div className="p-6 border-b border-[rgb(var(--border-light))]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">
                  Pending Invoices
                </h2>
                <p className="text-sm text-[rgb(var(--foreground-muted))] mt-0.5">
                  Awaiting payment
                </p>
              </div>
              <Link 
                href="/dashboard/invoices" 
                className="flex items-center gap-1 text-sm font-medium text-[rgb(var(--primary-600))] hover:text-[rgb(var(--primary-700))] transition-colors"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-4">
            {pendingInvoices && pendingInvoices.length > 0 ? (
              <div className="space-y-2">
                {pendingInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-[rgb(var(--neutral-50))] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[rgb(var(--neutral-100))] flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-[rgb(var(--foreground-muted))]" />
                      </div>
                      <div>
                        <p className="font-medium text-[rgb(var(--foreground))]">
                          #{invoice.number}
                        </p>
                        <p className="text-sm text-[rgb(var(--foreground-muted))]">
                          {invoice.clients?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[rgb(var(--foreground))] tabular-nums">
                        {formatCurrency(invoice.amount)}
                      </p>
                      <span className={`badge badge-${invoice.status} mt-1`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state py-12">
                <CheckCircle2 className="empty-state-icon text-[rgb(var(--success-400))]" />
                <p className="empty-state-title">All caught up!</p>
                <p className="empty-state-description">
                  No pending invoices at the moment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
