import { createClient } from '@/lib/supabase/server'
import { formatDate, getStatusColor } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, File, Clock, CheckCircle } from 'lucide-react'
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

  return (
    <div>
      <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
            <p className="text-gray-600">{project.clients?.name}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
            {project.status.replace('_', ' ')}
          </span>
        </div>

        {project.description && (
          <p className="text-gray-600 mb-4">{project.description}</p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">{project.progress}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              Due: {project.due_date ? formatDate(project.due_date) : 'Not set'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              {completedTasks}/{totalTasks} tasks done
            </span>
          </div>
          <div className="flex items-center gap-2">
            <File className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{files?.length || 0} files</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{messages?.length || 0} messages</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Tasks</h2>
          </div>
          <div className="p-6">
            <TaskList projectId={id} tasks={tasks || []} />
          </div>
        </div>

        {/* Chat */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Discussion</h2>
          </div>
          <ProjectChat projectId={id} messages={messages || []} />
        </div>
      </div>

      {/* Files */}
      <div className="bg-white rounded-xl shadow-sm mt-6">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Files</h2>
        </div>
        <div className="p-6">
          {files && files.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {files.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <File className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No files uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
