'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Mail, Lock, User, Building2, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      // Create agency
      const slug = agencyName.toLowerCase().replace(/\s+/g, '-')
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .insert({ name: agencyName, slug })
        .select()
        .single()

      if (agencyError) {
        setError('Failed to create agency')
        setLoading(false)
        return
      }

      // Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: 'admin',
        agency_id: agency.id,
      })

      if (profileError) {
        setError('Failed to create profile')
        setLoading(false)
        return
      }

      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex bg-[rgb(var(--background))]">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--primary-600))] to-[rgb(var(--primary-800))] opacity-90" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">ClientPulse</span>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Start managing clients like a pro.
            </h1>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[rgb(var(--success-400))]" />
                <span className="text-white/90">Real-time project tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[rgb(var(--success-400))]" />
                <span className="text-white/90">Secure client portals</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[rgb(var(--success-400))]" />
                <span className="text-white/90">In-project messaging</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[rgb(var(--success-400))]" />
                <span className="text-white/90">14-day free trial</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-white/60">
            © 2026 ClientPulse by Sparks AI
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[rgb(var(--foreground))]">ClientPulse</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[rgb(var(--foreground))] tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-[rgb(var(--foreground-secondary))]">
              Start your free 14-day trial today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgb(var(--error-50))] border border-[rgb(var(--error-200))]">
                <AlertCircle className="w-5 h-5 text-[rgb(var(--error-600))] shrink-0" />
                <p className="text-sm text-[rgb(var(--error-700))]">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-[rgb(var(--foreground))]">
                Your name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--foreground-muted))]" />
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input pl-12 py-3"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="agencyName" className="block text-sm font-medium text-[rgb(var(--foreground))]">
                Agency name
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--foreground-muted))]" />
                <input
                  id="agencyName"
                  type="text"
                  required
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="input pl-12 py-3"
                  placeholder="Acme Agency"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--foreground))]">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--foreground-muted))]" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-12 py-3"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[rgb(var(--foreground))]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--foreground-muted))]" />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-12 py-3"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-[rgb(var(--foreground-muted))]">
                Must be at least 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[rgb(var(--foreground-muted))]">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>

          <div className="mt-6 text-center">
            <p className="text-[rgb(var(--foreground-secondary))]">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-medium text-[rgb(var(--primary-600))] hover:text-[rgb(var(--primary-700))] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
