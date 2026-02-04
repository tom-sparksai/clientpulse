'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { generatePortalToken } from '@/lib/utils'
import { ArrowLeft, Users, Info, Mail, Building2, Phone, User } from 'lucide-react'
import { Button, Input, Card, CardContent } from '@/components/ui'
import { useToast } from '@/components/ui/toast'

export default function NewClientPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()
  const supabase = createClient()
  const { success, error: showError } = useToast()

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!name.trim()) {
      newErrors.name = 'Contact name is required'
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (phone && !/^[\d\s\-+()]+$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number'
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
        .from('clients')
        .insert({
          agency_id: profile.agency_id,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          company: company.trim() || null,
          phone: phone.trim() || null,
          portal_token: generatePortalToken(),
        })

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('A client with this email already exists')
        }
        throw insertError
      }

      success('Client added', 'Your new client has been added successfully')
      router.push('/dashboard/clients')
    } catch (err) {
      showError('Failed to add client', err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-2 text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--foreground))] transition-colors mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] rounded-lg px-1 py-0.5"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Clients
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--success-100))] to-[rgb(var(--success-50))] flex items-center justify-center">
            <Users className="w-6 h-6 text-[rgb(var(--success-600))]" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] tracking-tight">
              Add New Client
            </h1>
            <p className="text-[rgb(var(--foreground-secondary))] mt-0.5">
              Create a new client account with portal access
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Contact Name */}
            <Input
              id="name"
              label="Contact Name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
              }}
              placeholder="John Doe"
              error={errors.name}
              leftIcon={<User className="w-4 h-4" />}
              aria-required="true"
            />

            {/* Email */}
            <Input
              id="email"
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
              }}
              placeholder="john@example.com"
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              aria-required="true"
            />

            {/* Company */}
            <Input
              id="company"
              label="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Inc."
              helperText="Optional. The client's company or organization."
              leftIcon={<Building2 className="w-4 h-4" />}
            />

            {/* Phone */}
            <Input
              id="phone"
              label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }))
              }}
              placeholder="+1 (555) 123-4567"
              error={errors.phone}
              helperText="Optional. For direct communication."
              leftIcon={<Phone className="w-4 h-4" />}
            />

            {/* Info Box */}
            <div className="bg-[rgb(var(--primary-50))] border border-[rgb(var(--primary-200))] p-4 rounded-xl">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-[rgb(var(--primary-600))] shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-[rgb(var(--primary-800))]">
                  <strong>Portal Access:</strong> A unique portal link will be generated for this client. 
                  They can use it to view their projects, communicate with your team, and track progress.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-[rgb(var(--border-light))]">
              <Link href="/dashboard/clients" className="flex-1 sm:flex-none">
                <Button type="button" variant="secondary" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
                className="flex-1"
              >
                Add Client
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
