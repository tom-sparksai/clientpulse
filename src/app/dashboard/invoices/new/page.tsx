'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'

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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
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

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `INV-${year}-${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
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
        .from('invoices')
        .insert({
          agency_id: profile.agency_id,
          client_id: clientId,
          project_id: projectId || null,
          number: generateInvoiceNumber(),
          amount: parseFloat(amount),
          due_date: dueDate,
          status: 'draft',
        })

      if (insertError) throw insertError

      router.push('/dashboard/invoices')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  // Set default due date to 30 days from now
  useEffect(() => {
    const defaultDue = new Date()
    defaultDue.setDate(defaultDue.getDate() + 30)
    setDueDate(defaultDue.toISOString().split('T')[0])
  }, [])

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard/invoices"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Invoices
        </Link>
        <h1 className="text-2xl font-bold">Create New Invoice</h1>
        <p className="text-gray-600 mt-1">Generate an invoice for a client</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
            Client <span className="text-red-500">*</span>
          </label>
          <select
            id="client"
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.company && `(${client.company})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
            Project (optional)
          </label>
          <select
            id="project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={!clientId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="">No specific project</option>
            {filteredProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {clientId && filteredProjects.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">No projects for this client</p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (USD) <span className="text-red-500">*</span>
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            id="dueDate"
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            The invoice will be created as a <strong>draft</strong>. You can mark it as sent once you&apos;ve delivered it to the client.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !clientId || !amount}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
          <Link
            href="/dashboard/invoices"
            className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
