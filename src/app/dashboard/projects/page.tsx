import { createClient } from '@/lib/supabase/server'
import { formatDate, getStatusColor } from '@/lib/utils'
import Link from 'next/link'
import { Plus, FolderKanban, Search, Filter, ArrowUpRight, Calendar, User } from 'lucide-react'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('agency_id')
    .eq('id', user!.id)
    .single()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, clients(name)')
    .eq('agency_id', profile!.agency_id!)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] tracking-tight">
            Projects
          </h1>
          <p className="text-[rgb(var(--foreground-secondary))] mt-1">
            Manage and track all your client projects
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="btn btn-primary self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--foreground-muted))]" />
            <input
              type="text"
              placeholder="Search projects..."
              className="input pl-10"
            />
          </div>
          <button className="btn btn-secondary">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {projects && projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="card p-6 block hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Project info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--primary-100))] to-[rgb(var(--primary-50))] flex items-center justify-center shrink-0">
                      <FolderKanban className="w-6 h-6 text-[rgb(var(--primary-600))]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] group-hover:text-[rgb(var(--primary-600))] transition-colors truncate">
                          {project.name}
                        </h3>
                        <span className={`badge badge-${project.status} shrink-0`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-sm text-[rgb(var(--foreground-secondary))] line-clamp-1 mb-2">
                          {project.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[rgb(var(--foreground-muted))]">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>{project.clients?.name || 'No client'}</span>
                        </div>
                        {project.due_date && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Due {formatDate(project.due_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress & Action */}
                <div className="flex items-center gap-6 lg:w-64">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[rgb(var(--foreground-secondary))]">
                        Progress
                      </span>
                      <span className="text-sm font-semibold text-[rgb(var(--foreground))] tabular-nums">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="progress progress-lg">
                      <div
                        className="progress-bar"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[rgb(var(--neutral-100))] group-hover:bg-[rgb(var(--primary-50))] flex items-center justify-center transition-colors shrink-0">
                    <ArrowUpRight className="w-5 h-5 text-[rgb(var(--foreground-muted))] group-hover:text-[rgb(var(--primary-600))] transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state py-16">
            <div className="w-20 h-20 rounded-2xl bg-[rgb(var(--neutral-100))] flex items-center justify-center mb-6">
              <FolderKanban className="w-10 h-10 text-[rgb(var(--foreground-muted))]" />
            </div>
            <p className="empty-state-title text-xl">No projects yet</p>
            <p className="empty-state-description">
              Get started by creating your first project to track client work
            </p>
            <Link
              href="/dashboard/projects/new"
              className="btn btn-primary mt-6"
            >
              <Plus className="w-4 h-4" />
              Create your first project
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
