import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Users, ExternalLink, Building2, Mail, Search, Filter } from 'lucide-react'
import CopyButton from '@/components/copy-button'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('agency_id')
    .eq('id', user!.id)
    .single()

  const { data: clients } = await supabase
    .from('clients')
    .select('*, projects(count)')
    .eq('agency_id', profile!.agency_id!)
    .order('created_at', { ascending: false })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] tracking-tight">
            Clients
          </h1>
          <p className="text-[rgb(var(--foreground-secondary))] mt-1">
            Manage your client relationships and portal access
          </p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="btn btn-primary self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--foreground-muted))]" />
            <input
              type="text"
              placeholder="Search clients..."
              className="input pl-10"
            />
          </div>
          <button className="btn btn-secondary">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {clients && clients.length > 0 ? (
        <div className="space-y-4">
          {clients.map((client) => {
            const portalUrl = `${baseUrl}/client/${client.portal_token}`
            const projectCount = (client.projects as { count: number }[])?.[0]?.count || 0
            
            return (
              <div
                key={client.id}
                className="card p-6 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Client info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--primary-400))] to-[rgb(var(--primary-600))] flex items-center justify-center shadow-sm shrink-0">
                      <span className="text-white font-semibold text-lg">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] group-hover:text-[rgb(var(--primary-600))] transition-colors">
                        {client.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-[rgb(var(--foreground-muted))]">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[200px]">{client.email}</span>
                        </div>
                        {client.company && (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{client.company}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center gap-6">
                    {/* Project count */}
                    <div className="text-center px-4">
                      <p className="text-2xl font-bold text-[rgb(var(--foreground))] tabular-nums">
                        {projectCount}
                      </p>
                      <p className="text-xs text-[rgb(var(--foreground-muted))]">
                        {projectCount === 1 ? 'Project' : 'Projects'}
                      </p>
                    </div>

                    {/* Portal link */}
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgb(var(--neutral-50))] border border-[rgb(var(--border-light))]">
                      <code className="text-xs text-[rgb(var(--foreground-secondary))] max-w-[150px] truncate font-mono">
                        {portalUrl}
                      </code>
                      <div className="flex items-center gap-1">
                        <CopyButton text={portalUrl} />
                        <a
                          href={portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-[rgb(var(--foreground-muted))] hover:text-[rgb(var(--primary-600))] hover:bg-[rgb(var(--primary-50))] transition-colors"
                          title="Open portal"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state py-16">
            <div className="w-20 h-20 rounded-2xl bg-[rgb(var(--neutral-100))] flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-[rgb(var(--foreground-muted))]" />
            </div>
            <p className="empty-state-title text-xl">No clients yet</p>
            <p className="empty-state-description">
              Add your first client to start managing projects and communication
            </p>
            <Link
              href="/dashboard/clients/new"
              className="btn btn-primary mt-6"
            >
              <Plus className="w-4 h-4" />
              Add your first client
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
