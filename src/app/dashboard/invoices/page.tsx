import { createClient } from '@/lib/supabase/server'
import { formatDate, formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { 
  Plus, 
  FileText, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  TrendingUp,
  Clock,
  Search,
  Filter
} from 'lucide-react'
import InvoiceActions from '@/components/dashboard/invoice-actions'

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('agency_id')
    .eq('id', user!.id)
    .single()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, clients(name, company), projects(name)')
    .eq('agency_id', profile!.agency_id!)
    .order('created_at', { ascending: false })

  // Calculate summary stats
  const stats = {
    total: invoices?.reduce((sum, inv) => sum + inv.amount, 0) || 0,
    paid: invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0) || 0,
    pending: invoices?.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0) || 0,
    overdue: invoices?.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0) || 0,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-4 h-4" />
      case 'sent':
        return <Send className="w-4 h-4" />
      case 'paid':
        return <CheckCircle className="w-4 h-4" />
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] tracking-tight">
            Invoices
          </h1>
          <p className="text-[rgb(var(--foreground-secondary))] mt-1">
            Track and manage client invoices and payments
          </p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className="btn btn-primary self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="card p-6 hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[rgb(var(--neutral-200))] to-[rgb(var(--neutral-100))] flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[rgb(var(--foreground-secondary))]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[rgb(var(--foreground))] tracking-tight tabular-nums">
            {formatCurrency(stats.total)}
          </p>
          <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
            Total Revenue
          </p>
        </div>

        {/* Paid */}
        <div className="card p-6 hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[rgb(var(--success-100))] to-[rgb(var(--success-50))] flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[rgb(var(--success-600))]" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-[rgb(var(--success-700))] bg-[rgb(var(--success-50))] px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              Collected
            </span>
          </div>
          <p className="text-3xl font-bold text-[rgb(var(--success-600))] tracking-tight tabular-nums">
            {formatCurrency(stats.paid)}
          </p>
          <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
            Paid
          </p>
        </div>

        {/* Pending */}
        <div className="card p-6 hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[rgb(var(--primary-100))] to-[rgb(var(--primary-50))] flex items-center justify-center">
              <Clock className="w-6 h-6 text-[rgb(var(--primary-600))]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[rgb(var(--primary-600))] tracking-tight tabular-nums">
            {formatCurrency(stats.pending)}
          </p>
          <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
            Pending
          </p>
        </div>

        {/* Overdue */}
        <div className="card p-6 hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[rgb(var(--error-100))] to-[rgb(var(--error-50))] flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-[rgb(var(--error-600))]" />
            </div>
            {stats.overdue > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-[rgb(var(--error-700))] bg-[rgb(var(--error-50))] px-2 py-1 rounded-full">
                <AlertCircle className="w-3 h-3" />
                Action needed
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-[rgb(var(--error-600))] tracking-tight tabular-nums">
            {formatCurrency(stats.overdue)}
          </p>
          <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
            Overdue
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--foreground-muted))]" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="input pl-10"
            />
          </div>
          <button className="btn btn-secondary">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {invoices && invoices.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[rgb(var(--neutral-50))] border-b border-[rgb(var(--border-light))]">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-[rgb(var(--foreground-secondary))] uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-[rgb(var(--foreground-secondary))] uppercase tracking-wider">
                    Client
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-[rgb(var(--foreground-secondary))] uppercase tracking-wider">
                    Project
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-[rgb(var(--foreground-secondary))] uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-[rgb(var(--foreground-secondary))] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-[rgb(var(--foreground-secondary))] uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-[rgb(var(--foreground-secondary))] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--border-light))]">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-[rgb(var(--neutral-50))] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-[rgb(var(--foreground))]">
                        {invoice.number}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[rgb(var(--foreground))]">
                          {invoice.clients?.name}
                        </p>
                        {invoice.clients?.company && (
                          <p className="text-sm text-[rgb(var(--foreground-muted))]">
                            {invoice.clients.company}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[rgb(var(--foreground-secondary))]">
                      {invoice.projects?.name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[rgb(var(--foreground))] tabular-nums">
                        {formatCurrency(invoice.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge badge-${invoice.status}`}>
                        <span className="flex items-center gap-1.5">
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[rgb(var(--foreground-secondary))]">
                      {formatDate(invoice.due_date)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <InvoiceActions invoice={invoice} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state py-16">
            <div className="w-20 h-20 rounded-2xl bg-[rgb(var(--neutral-100))] flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-[rgb(var(--foreground-muted))]" />
            </div>
            <p className="empty-state-title text-xl">No invoices yet</p>
            <p className="empty-state-description">
              Create invoices to track payments and get paid faster
            </p>
            <Link
              href="/dashboard/invoices/new"
              className="btn btn-primary mt-6"
            >
              <Plus className="w-4 h-4" />
              Create your first invoice
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
