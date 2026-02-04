import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  MessageSquare, 
  File, 
  Clock, 
  CheckCircle2, 
  Download,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  User,
  Target
} from 'lucide-react'
import ProjectChat from '@/components/dashboard/project-chat'
import TaskList from '@/components/dashboard/task-list'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*, clients(*)')
    .eq('id', id)
    .single()

  if (!project) {
    notFound()
  }

  const [
    { data: tasks },
    { data: files },
    { data: messages },
  ] = await Promise.all([
    supabase.from('tasks').select('*').eq('project_id', id).order('created_at', { ascending: true }),
    supabase.from('files').select('*').eq('project_id', id).order('created_at', { ascending: false }),
    supabase.from('messages').select('*, users(full_name)').eq('project_id', id).order('created_at', { ascending: true }),
  ])

  const completedTasks = tasks?.filter(t => t.status === 'done').length || 0
  const totalTasks = tasks?.length || 0
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Back link */}
      <Link 
        href="/dashboard/projects" 
        className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--foreground))] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Project Header Card */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-[rgb(var(--foreground))] tracking-tight">
                {project.name}
              </h1>
              <span className={`badge badge-${project.status}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            
            {project.description && (
              <p className="text-[rgb(var(--foreground-secondary))] text-lg mb-6 max-w-2xl">
                {project.description}
              </p>
            )}

            {/* Project meta */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-[rgb(var(--foreground-secondary))]">
                <div className="w-8 h-8 rounded-lg bg-[rgb(var(--neutral-100))] flex items-center justify-center">
                  <User className="w-4 h-4 text-[rgb(var(--foreground-muted))]" />
                </div>
                <div>
                  <p className="text-xs text-[rgb(var(--foreground-muted))]">Client</p>
                  <p className="font-medium text-[rgb(var(--foreground))]">{project.clients?.name || 'No client'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-[rgb(var(--foreground-secondary))]">
                <div className="w-8 h-8 rounded-lg bg-[rgb(var(--neutral-100))] flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[rgb(var(--foreground-muted))]" />
                </div>
                <div>
                  <p className="text-xs text-[rgb(var(--foreground-muted))]">Due Date</p>
                  <p className="font-medium text-[rgb(var(--foreground))]">
                    {project.due_date ? formatDate(project.due_date) : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress ring - visual enhancement */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
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
                <span className="text-2xl font-bold text-[rgb(var(--foreground))]">
                  {project.progress}%
                </span>
              </div>
            </div>
            <p className="text-sm text-[rgb(var(--foreground-secondary))]">Complete</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[rgb(var(--border-light))]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgb(var(--neutral-50))]">
            <div className="w-10 h-10 rounded-lg bg-[rgb(var(--primary-100))] flex items-center justify-center">
              <Target className="w-5 h-5 text-[rgb(var(--primary-600))]" />
            </div>
            <div>
              <p className="text-xs text-[rgb(var(--foreground-muted))]">Task Progress</p>
              <p className="font-semibold text-[rgb(var(--foreground))]">
                {completedTasks}/{totalTasks} done
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgb(var(--neutral-50))]">
            <div className="w-10 h-10 rounded-lg bg-[rgb(var(--success-100))] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[rgb(var(--success-600))]" />
            </div>
            <div>
              <p className="text-xs text-[rgb(var(--foreground-muted))]">Completion</p>
              <p className="font-semibold text-[rgb(var(--foreground))]">{taskProgress}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgb(var(--neutral-50))]">
            <div className="w-10 h-10 rounded-lg bg-[rgb(var(--warning-100))] flex items-center justify-center">
              <File className="w-5 h-5 text-[rgb(var(--warning-600))]" />
            </div>
            <div>
              <p className="text-xs text-[rgb(var(--foreground-muted))]">Files</p>
              <p className="font-semibold text-[rgb(var(--foreground))]">{files?.length || 0} uploaded</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgb(var(--neutral-50))]">
            <div className="w-10 h-10 rounded-lg bg-[rgb(var(--primary-100))] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[rgb(var(--primary-600))]" />
            </div>
            <div>
              <p className="text-xs text-[rgb(var(--foreground-muted))]">Messages</p>
              <p className="font-semibold text-[rgb(var(--foreground))]">{messages?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tasks */}
        <div className="card">
          <div className="p-6 border-b border-[rgb(var(--border-light))]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">Tasks</h2>
                <p className="text-sm text-[rgb(var(--foreground-muted))]">
                  {completedTasks} of {totalTasks} completed
                </p>
              </div>
              <div className="w-16">
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${taskProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <TaskList projectId={id} tasks={tasks || []} />
          </div>
        </div>

        {/* Chat */}
        <div className="card flex flex-col">
          <div className="p-6 border-b border-[rgb(var(--border-light))]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">Discussion</h2>
                <p className="text-sm text-[rgb(var(--foreground-muted))]">
                  {messages?.length || 0} messages
                </p>
              </div>
            </div>
          </div>
          <ProjectChat projectId={id} messages={messages || []} />
        </div>
      </div>

      {/* Files */}
      <div className="card">
        <div className="p-6 border-b border-[rgb(var(--border-light))]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">Files</h2>
              <p className="text-sm text-[rgb(var(--foreground-muted))]">
                Project deliverables and assets
              </p>
            </div>
            <button className="btn btn-secondary">
              Upload File
            </button>
          </div>
        </div>
        <div className="p-6">
          {files && files.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 rounded-xl border border-[rgb(var(--border))] hover:border-[rgb(var(--primary-300))] hover:bg-[rgb(var(--primary-50))] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[rgb(var(--neutral-100))] group-hover:bg-[rgb(var(--primary-100))] flex items-center justify-center transition-colors">
                      <File className="w-6 h-6 text-[rgb(var(--foreground-muted))] group-hover:text-[rgb(var(--primary-600))]" />
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/50 transition-all">
                      <Download className="w-4 h-4 text-[rgb(var(--foreground-secondary))]" />
                    </button>
                  </div>
                  <p className="font-medium text-sm text-[rgb(var(--foreground))] truncate mb-1">
                    {file.name}
                  </p>
                  <p className="text-xs text-[rgb(var(--foreground-muted))]">
                    {Math.round(file.size / 1024)} KB
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="empty-state py-12">
              <File className="empty-state-icon" />
              <p className="empty-state-title">No files uploaded</p>
              <p className="empty-state-description">
                Upload project files and deliverables for your client
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
