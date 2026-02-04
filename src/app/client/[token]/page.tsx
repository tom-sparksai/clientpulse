import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { 
  FolderKanban, 
  MessageSquare, 
  File, 
  Clock, 
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Target
} from 'lucide-react'
import ClientChat from '@/components/client/client-chat'

export default async function ClientPortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  // Get client by portal token
  const { data: client } = await supabase
    .from('clients')
    .select('*, agencies(name, logo_url)')
    .eq('portal_token', token)
    .single()

  if (!client) {
    notFound()
  }

  // Get client's projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*, tasks(count), messages(count), files(count)')
    .eq('client_id', client.id)
    .order('updated_at', { ascending: false })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-[rgb(var(--border-light))]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[rgb(var(--foreground))]">
                  {client.agencies?.name || 'Agency'} Portal
                </h1>
                <p className="text-xs text-[rgb(var(--foreground-muted))]">
                  Client Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[rgb(var(--primary-400))] to-[rgb(var(--primary-600))] flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {client.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome section */}
        <div className="mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-[rgb(var(--foreground))] tracking-tight mb-2">
            {greeting}, {client.name.split(' ')[0]} 👋
          </h2>
          <p className="text-lg text-[rgb(var(--foreground-secondary))]">
            Here's the latest on your projects with {client.agencies?.name || 'us'}.
          </p>
        </div>

        {/* Quick stats */}
        {projects && projects.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgb(var(--primary-100))] to-[rgb(var(--primary-50))] flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-[rgb(var(--primary-600))]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[rgb(var(--foreground))]">
                    {projects.length}
                  </p>
                  <p className="text-xs text-[rgb(var(--foreground-muted))]">
                    Active Projects
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgb(var(--success-100))] to-[rgb(var(--success-50))] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[rgb(var(--success-600))]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[rgb(var(--foreground))]">
                    {projects.filter(p => p.status === 'done').length}
                  </p>
                  <p className="text-xs text-[rgb(var(--foreground-muted))]">
                    Completed
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgb(var(--warning-100))] to-[rgb(var(--warning-50))] flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[rgb(var(--warning-600))]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[rgb(var(--foreground))]">
                    {projects.filter(p => p.status === 'in_progress').length}
                  </p>
                  <p className="text-xs text-[rgb(var(--foreground-muted))]">
                    In Progress
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgb(var(--primary-100))] to-[rgb(var(--primary-50))] flex items-center justify-center">
                  <Target className="w-5 h-5 text-[rgb(var(--primary-600))]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[rgb(var(--foreground))]">
                    {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
                  </p>
                  <p className="text-xs text-[rgb(var(--foreground-muted))]">
                    Avg Progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[rgb(var(--foreground))] mb-6">
            Your Projects
          </h3>
        </div>

        {projects && projects.length > 0 ? (
          <div className="space-y-6">
            {projects.map((project) => {
              const taskCount = (project.tasks as { count: number }[])?.[0]?.count || 0
              const messageCount = (project.messages as { count: number }[])?.[0]?.count || 0
              const fileCount = (project.files as { count: number }[])?.[0]?.count || 0

              return (
                <div key={project.id} className="card overflow-hidden">
                  {/* Project Header */}
                  <div className="p-6 lg:p-8 border-b border-[rgb(var(--border-light))]">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl lg:text-2xl font-semibold text-[rgb(var(--foreground))]">
                            {project.name}
                          </h3>
                          <span className={`badge badge-${project.status}`}>
                            {project.status.replace('_', ' ')}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-[rgb(var(--foreground-secondary))] mb-4 max-w-2xl">
                            {project.description}
                          </p>
                        )}

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-5 text-sm text-[rgb(var(--foreground-muted))]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>Due: {project.due_date ? formatDate(project.due_date) : 'Not set'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FolderKanban className="w-4 h-4" />
                            <span>{taskCount} tasks</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4" />
                            <span>{messageCount} messages</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <File className="w-4 h-4" />
                            <span>{fileCount} files</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress ring */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="rgb(var(--neutral-100))"
                              strokeWidth="8"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="rgb(var(--primary-500))"
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={`${project.progress * 2.51} 251`}
                              className="transition-all duration-500"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-[rgb(var(--foreground))]">
                              {project.progress}%
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-[rgb(var(--foreground-muted))]">Progress</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[rgb(var(--foreground-secondary))]">
                          Overall Progress
                        </span>
                        <span className="text-xs font-semibold text-[rgb(var(--foreground))] tabular-nums">
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
                  </div>

                  {/* Chat Section */}
                  <div className="p-6 lg:p-8 bg-[rgb(var(--neutral-50))]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-[rgb(var(--foreground))]">
                          Discussion
                        </h4>
                        <p className="text-sm text-[rgb(var(--foreground-muted))]">
                          Chat with the team about this project
                        </p>
                      </div>
                    </div>
                    <div className="card">
                      <ClientChat projectId={project.id} clientId={client.id} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card">
            <div className="empty-state py-20">
              <div className="w-20 h-20 rounded-2xl bg-[rgb(var(--neutral-100))] flex items-center justify-center mb-6">
                <FolderKanban className="w-10 h-10 text-[rgb(var(--foreground-muted))]" />
              </div>
              <p className="empty-state-title text-xl">No projects yet</p>
              <p className="empty-state-description">
                Your agency will add projects here soon. Check back later!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgb(var(--border-light))] mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[rgb(var(--foreground-muted))]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[rgb(var(--primary-500))]" />
              <span>Powered by ClientPulse</span>
            </div>
            <p>© 2026 All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
