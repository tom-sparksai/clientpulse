'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Plus, Circle, CheckCircle2, Clock, Loader2, ListTodo } from 'lucide-react'

interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
}

interface TaskListProps {
  projectId: string
  tasks: Task[]
}

export default function TaskList({ projectId, tasks: initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  const addTask = async () => {
    if (!newTask.trim()) return
    setLoading(true)

    const { data, error } = await supabase
      .from('tasks')
      .insert({ project_id: projectId, title: newTask })
      .select()
      .single()

    if (!error && data) {
      setTasks([...tasks, data])
      setNewTask('')
    }
    setLoading(false)
  }

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    setUpdatingId(taskId)
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)

    if (!error) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t))
    }
    setUpdatingId(null)
  }

  const getStatusIcon = (status: Task['status'], isUpdating: boolean) => {
    if (isUpdating) {
      return <Loader2 className="w-5 h-5 text-[rgb(var(--primary-500))] animate-spin" />
    }
    switch (status) {
      case 'todo':
        return <Circle className="w-5 h-5 text-[rgb(var(--neutral-400))] group-hover:text-[rgb(var(--neutral-500))]" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-[rgb(var(--warning-500))]" />
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-[rgb(var(--success-500))]" />
    }
  }

  const getStatusStyles = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return ''
      case 'in_progress':
        return 'bg-[rgb(var(--warning-50))]'
      case 'done':
        return 'bg-[rgb(var(--success-50))]'
    }
  }

  const nextStatus = (current: Task['status']): Task['status'] => {
    if (current === 'todo') return 'in_progress'
    if (current === 'in_progress') return 'done'
    return 'todo'
  }

  // Group tasks by status for better organization
  const todoTasks = tasks.filter(t => t.status === 'todo')
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress')
  const doneTasks = tasks.filter(t => t.status === 'done')

  return (
    <div className="space-y-6">
      {/* Add task */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="input flex-1"
          disabled={loading}
        />
        <button
          onClick={addTask}
          disabled={loading || !newTask.trim()}
          className={cn(
            'btn transition-all',
            newTask.trim()
              ? 'btn-primary'
              : 'bg-[rgb(var(--neutral-100))] text-[rgb(var(--foreground-muted))]'
          )}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Task list */}
      {tasks.length > 0 ? (
        <div className="space-y-4">
          {/* In Progress */}
          {inProgressTasks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[rgb(var(--warning-600))] uppercase tracking-wider mb-2 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                In Progress ({inProgressTasks.length})
              </p>
              <div className="space-y-1.5">
                {inProgressTasks.map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    isUpdating={updatingId === task.id}
                    onToggle={() => updateTaskStatus(task.id, nextStatus(task.status))}
                    getStatusIcon={getStatusIcon}
                    getStatusStyles={getStatusStyles}
                  />
                ))}
              </div>
            </div>
          )}

          {/* To Do */}
          {todoTasks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[rgb(var(--foreground-muted))] uppercase tracking-wider mb-2 flex items-center gap-2">
                <Circle className="w-3.5 h-3.5" />
                To Do ({todoTasks.length})
              </p>
              <div className="space-y-1.5">
                {todoTasks.map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    isUpdating={updatingId === task.id}
                    onToggle={() => updateTaskStatus(task.id, nextStatus(task.status))}
                    getStatusIcon={getStatusIcon}
                    getStatusStyles={getStatusStyles}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Done */}
          {doneTasks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[rgb(var(--success-600))] uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Done ({doneTasks.length})
              </p>
              <div className="space-y-1.5">
                {doneTasks.map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    isUpdating={updatingId === task.id}
                    onToggle={() => updateTaskStatus(task.id, nextStatus(task.status))}
                    getStatusIcon={getStatusIcon}
                    getStatusStyles={getStatusStyles}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-2xl bg-[rgb(var(--neutral-100))] flex items-center justify-center mx-auto mb-4">
            <ListTodo className="w-7 h-7 text-[rgb(var(--foreground-muted))]" />
          </div>
          <p className="text-[rgb(var(--foreground-secondary))] font-medium mb-1">
            No tasks yet
          </p>
          <p className="text-sm text-[rgb(var(--foreground-muted))]">
            Add your first task above
          </p>
        </div>
      )}
    </div>
  )
}

// Separate TaskItem component for cleaner rendering
function TaskItem({ 
  task, 
  isUpdating, 
  onToggle, 
  getStatusIcon, 
  getStatusStyles 
}: { 
  task: Task
  isUpdating: boolean
  onToggle: () => void
  getStatusIcon: (status: Task['status'], isUpdating: boolean) => React.ReactNode
  getStatusStyles: (status: Task['status']) => string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl transition-all group',
        getStatusStyles(task.status),
        'hover:bg-[rgb(var(--neutral-100))]',
        task.status === 'done' && 'opacity-75'
      )}
    >
      <button
        onClick={onToggle}
        disabled={isUpdating}
        className="shrink-0 transition-transform hover:scale-110 active:scale-95"
      >
        {getStatusIcon(task.status, isUpdating)}
      </button>
      <span className={cn(
        'flex-1 text-sm text-[rgb(var(--foreground))] transition-all',
        task.status === 'done' && 'line-through text-[rgb(var(--foreground-muted))]'
      )}>
        {task.title}
      </span>
      {task.status === 'in_progress' && (
        <span className="badge badge-in_progress text-[10px] py-0.5">
          Working
        </span>
      )}
    </div>
  )
}
