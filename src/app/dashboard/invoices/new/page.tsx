'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, FileText, Info, DollarSign, Calendar, Loader2 } from 'lucide-react'
import { Button, Input, Select, Card, CardContent } from '@/components/ui'
import { useToast } from '@/components/ui/toast'

interface Client {
  id: string
  name: string
  company: string | null
}

interface Project {
  id: string
  name: string
  client_id: string
}

export default function NewInvoicePage() {
  const [clientId, setClientId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()
  const supabase = createClient()
  const { success, error: showError } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('users')
          .select('agency_id')
          .eq('id', user.id)
          .single()

        if (profile?.agency_id) {
          const [clientsRes, projectsRes] = await Promise.all([
            supabase
              .from('clients')
              .select('id, name, company')
              .eq('agency_id', profile.agency_id)
              .order('name'),
            supabase
              .from('projects')
              .select('id, name, client_id')
              .eq('agency_id', profile.agency_id)
              .order('name'),
          ])

          if (clientsRes.data) setClients(clientsRes.data)
          if (projectsRes.data) setProjects(projectsRes.data)
        }
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [supabase])

  // Filter projects when client changes
  useEffect(() => {
    if (clientId) {
      setFilteredProjects(projects.filter(p => p.client_id === clientId))
      setProjectId('')
    } else {
      setFilteredProjects([])
    }
  }, [clientId, projects])

  // Set default due date to 30 days from now
  useEffect(() => {
    const defaultDue = new Date()
    defaultDue.setDate(defaultDue.getDate() + 30)
    setDueDate(defaultDue.toISOString().split('T')[0])
  }, [])

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `INV-${year}-${random}`
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!clientId) {
      newErrors.clientId = 'Please select a client'
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    
    if (!dueDate) {
      newErrors.dueDate = 'Please select a due date'
    } else if (new Date(dueDate) < new Date(new Date().toDateString())) {
      newErrors.dueDate = 'Due date cannot be in the past'
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

      const invoiceNumber = generateInvoiceNumber()
      
      const { error: insertError } = await supabase
        .from('invoices')
        .insert({
          agency_id: profile.agency_id,
          client_id: clientId,
          project_id: projectId || null,
          number: invoiceNumber,
          amount: parseFloat(amount),
          due_date: dueDate,
          status: 'draft',
        })

      if (insertError) throw insertError

      success('Invoice created', `Invoice ${invoiceNumber} has been created as a draft`)
      router.push('/dashboard/invoices')
    } catch (err) {
      showError('Failed to create invoice', err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/invoices"
          className="inline-flex items-center gap-2 text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--foreground))] transition-colors mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] rounded-lg px-1 py-0.5"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Invoices
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--warning-100))] to-[rgb(var(--warning-50))] flex items-center justify-center">
            <FileText className="w-6 h-6 text-[rgb(var(--warning-600))]" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] tracking-tight">
              Create New Invoice
            </h1>
            <p className="text-[rgb(var(--foreground-secondary))] mt-0.5">
              Generate an invoice for a client
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
              {loadingData ? (
                <div className="flex items-center gap-2 h-10 text-[rgb(var(--foreground-muted))]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading clients...</span>
                </div>
              ) : (
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
              )}
            </div>

            {/* Project Selection (Optional) */}
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-1.5">
                Project <span className="text-[rgb(var(--foreground-muted))]">(optional)</span>
              </label>
              <Select
                id="project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                options={filteredProjects.map(project => ({
                  value: project.id,
                  label: project.name
                }))}
                placeholder="No specific project"
                disabled={!clientId}
                helperText={
                  clientId && filteredProjects.length === 0 
                    ? 'No projects for this client' 
                    : 'Link this invoice to a specific project'
                }
              />
            </div>

            {/* Amount */}
            <Input
              id="amount"
              label="Amount (USD)"
              type="number"
              min="0"
              step="0.01"
              required
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }))
              }}
              placeholder="0.00"
              error={errors.amount}
              leftIcon={<DollarSign className="w-4 h-4" />}
              aria-required="true"
            />

            {/* Due Date */}
            <Input
              id="dueDate"
              label="Due Date"
              type="date"
              required
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value)
                if (errors.dueDate) setErrors(prev => ({ ...prev, dueDate: '' }))
              }}
              error={errors.dueDate}
              leftIcon={<Calendar className="w-4 h-4" />}
              aria-required="true"
            />

            {/* Info Box */}
            <div className="bg-[rgb(var(--neutral-100))] border border-[rgb(var(--border))] p-4 rounded-xl">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-[rgb(var(--foreground-secondary))] shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                  <strong>Draft Invoice:</strong> This invoice will be created as a draft. 
                  You can mark it as sent once you've delivered it to the client.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-[rgb(var(--border-light))]">
              <Link href="/dashboard/invoices" className="flex-1 sm:flex-none">
                <Button type="button" variant="secondary" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading || !clientId || !amount || loadingData}
                className="flex-1"
              >
                Create Invoice
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
