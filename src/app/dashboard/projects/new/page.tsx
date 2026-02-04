'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, FolderKanban, AlertCircle, Loader2 } from 'lucide-react'
import { Button, Input, Select, Card, CardContent, CardHeader } from '@/components/ui'
import { useToast } from '@/components/ui/toast'

interface Client {
  id: string
  name: string
  company: string | null
}

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
]

export default function NewProjectPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [clientId, setClientId] = useState('')
  const [status, setStatus] = useState<string>('planning')
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [budget, setBudget] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingClients, setLoadingClients] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()
  const supabase = createClient()
  const { success, error: showError } = useToast()

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('users')
          .select('agency_id')
          .eq('id', user.id)
          .single()

        if (profile?.agency_id) {
          const { data } = await supabase
            .from('clients')
            .select('id, name, company')
            .eq('agency_id', profile.agency_id)
            .order('name')

          if (data) setClients(data)
        }
      } finally {
        setLoadingClients(false)
      }
    }

    fetchClients()
  }, [supabase])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!name.trim()) {
      newErrors.name = 'Project name is required'
    }
    
    if (!clientId) {
      newErrors.clientId = 'Please select a client'
    }
    
    if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) {
      newErrors.dueDate = 'Due date must be after start date'
    }
    
    if (budget && (isNaN(parseFloat(budget)) || parseFloat(budget) < 0)) {
      newErrors.budget = 'Please enter a valid budget amount'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: profile } = await supabase
        .from('users')
        .select('agency_id')
        .eq('id', user.id)
        .single()

      if (!profile?.agency_id) throw new Error('No agency found')

      const { error: insertError } = await supabase
        .from('projects')
        .insert({
          agency_id: profile.agency_id,
          client_id: clientId,
          name: name.trim(),
          description: description.trim() || null,
          status,
          start_date: startDate || null,
          due_date: dueDate || null,
          budget: budget ? parseFloat(budget) : null,
          progress: 0,
        })

      if (insertError) throw insertError

      success('Project created', 'Your new project has been created successfully')
      router.push('/dashboard/projects')
    } catch (err) {
      showError('Failed to create project', err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-2 text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--foreground))] transition-colors mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] rounded-lg px-1 py-0.5"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Projects
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--primary-100))] to-[rgb(var(--primary-50))] flex items-center justify-center">
            <FolderKanban className="w-6 h-6 text-[rgb(var(--primary-600))]" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] tracking-tight">
              Create New Project
            </h1>
            <p className="text-[rgb(var(--foreground-secondary))] mt-0.5">
              Add a new project for one of your clients
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Client Selection */}
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-1.5">
                Client <span className="text-[rgb(var(--error-500))]">*</span>
              </label>
              {loadingClients ? (
                <div className="flex items-center gap-2 h-10 text-[rgb(var(--foreground-muted))]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading clients...</span>
                </div>
              ) : (
                <>
                  <Select
                    id="client"
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value)
                      if (errors.clientId) setErrors(prev => ({ ...prev, clientId: '' }))
                    }}
                    options={clients.map(client => ({
                      value: client.id,
                      label: client.company ? `${client.name} (${client.company})` : client.name
                    }))}
                    placeholder="Select a client"
                    error={errors.clientId}
                    aria-required="true"
                  />
                  {clients.length === 0 && (
                    <p className="text-sm text-[rgb(var(--foreground-muted))] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      No clients yet.{' '}
                      <Link 
                        href="/dashboard/clients/new" 
                        className="text-[rgb(var(--primary-600))] hover:underline"
                      >
                        Add a client first
                      </Link>
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Project Name */}
            <Input
              id="name"
              label="Project Name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
              }}
              placeholder="e.g., Website Redesign"
              error={errors.name}
              aria-required="true"
            />

            {/* Description */}
            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-[rgb(var(--foreground))] mb-1.5"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the project..."
                className="input resize-none"
                aria-describedby="description-hint"
              />
              <p id="description-hint" className="mt-1.5 text-xs text-[rgb(var(--foreground-muted))]">
                Optional. Add context about the project scope.
              </p>
            </div>

            {/* Status */}
            <Select
              id="status"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
            />

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="startDate"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                id="dueDate"
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value)
                  if (errors.dueDate) setErrors(prev => ({ ...prev, dueDate: '' }))
                }}
                error={errors.dueDate}
              />
            </div>

            {/* Budget */}
            <Input
              id="budget"
              label="Budget (USD)"
              type="number"
              min="0"
              step="0.01"
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value)
                if (errors.budget) setErrors(prev => ({ ...prev, budget: '' }))
              }}
              placeholder="0.00"
              error={errors.budget}
              helperText="Optional. Set a budget for this project."
            />

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-[rgb(var(--border-light))]">
              <Link href="/dashboard/projects" className="flex-1 sm:flex-none">
                <Button type="button" variant="secondary" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading || !clientId || loadingClients}
                className="flex-1"
              >
                Create Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
