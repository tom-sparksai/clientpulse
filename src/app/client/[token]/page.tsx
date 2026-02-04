import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDate, getStatusColor } from '@/lib/utils'
import { FolderKanban, MessageSquare, File, Clock } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-blue-600">
                {client.agencies?.name || 'Agency'} Portal
              </h1>
              <p className="text-sm text-gray-500">Welcome back, {client.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Your Projects</h2>

        {projects && projects.length > 0 ? (
          <div className="space-y-6">
            {projects.map((project) => {
              const taskCount = (project.tasks as { count: number }[])?.[0]?.count || 0
              const messageCount = (project.messages as { count: number }[])?.[0]?.count || 0
              const fileCount = (project.files as { count: number }[])?.[0]?.count || 0

              return (
                <div key={project.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Project Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{project.name}</h3>
                        {project.description && (
                          <p className="text-gray-600 mt-1">{project.description}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>

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
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Due: {project.due_date ? formatDate(project.due_date) : 'Not set'}
                      </div>
                      <div className="flex items-center gap-2">
                        <FolderKanban className="w-4 h-4" />
                        {taskCount} tasks
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {messageCount} messages
                      </div>
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        {fileCount} files
                      </div>
                    </div>
                  </div>

                  {/* Chat Section */}
                  <div className="p-6">
                    <h4 className="font-medium mb-4">Discussion</h4>
                    <ClientChat projectId={project.id} clientId={client.id} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No projects yet. Your agency will add them soon.</p>
          </div>
        )}
      </main>

      <footer className="container mx-auto px-6 py-8 text-center text-gray-400 text-sm">
        Powered by ClientPulse
      </footer>
    </div>
  )
}
