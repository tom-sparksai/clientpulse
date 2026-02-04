'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Plus, Circle, CheckCircle2, Clock } from 'lucide-react'

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
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)

    if (!error) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t))
    }
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return <Circle className="w-5 h-5 text-gray-400" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
    }
  }

  const nextStatus = (current: Task['status']): Task['status'] => {
    if (current === 'todo') return 'in_progress'
    if (current === 'in_progress') return 'done'
    return 'todo'
  }

  return (
    <div className="space-y-4">
      {/* Add task */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a task..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          disabled={loading}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Task list */}
      {tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group"
            >
              <button
                onClick={() => updateTaskStatus(task.id, nextStatus(task.status))}
                className="shrink-0"
              >
                {getStatusIcon(task.status)}
              </button>
              <span className={cn(
                'flex-1 text-sm',
                task.status === 'done' && 'line-through text-gray-400'
              )}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center py-4">No tasks yet</p>
      )}
    </div>
  )
}
