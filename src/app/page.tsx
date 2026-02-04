import Link from 'next/link'
import { 
  ArrowRight, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Shield, 
  Zap, 
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-[rgb(var(--foreground))]">ClientPulse</span>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="px-4 py-2 text-sm font-medium text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--foreground))] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="btn btn-primary"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[rgb(var(--primary-200))] rounded-full blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[rgb(var(--primary-100))] rounded-full blur-3xl opacity-20" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--primary-50))] border border-[rgb(var(--primary-200))] mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[rgb(var(--success-500))] animate-pulse" />
              <span className="text-sm font-medium text-[rgb(var(--primary-700))]">
                Now with real-time collaboration
              </span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-5xl lg:text-7xl font-bold text-[rgb(var(--foreground))] mb-6 animate-slide-up tracking-tight">
              Client management
              <span className="block text-[rgb(var(--primary-600))]">made delightful</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-[rgb(var(--foreground-secondary))] mb-10 max-w-2xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '100ms' }}>
              Keep your clients in the loop with live project updates, instant messaging, 
              and transparent progress tracking. No more "where are we?" emails.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link
                href="/signup"
                className="btn btn-primary text-base px-8 py-3.5 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="btn btn-secondary text-base px-8 py-3.5"
              >
                See How It Works
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-[rgb(var(--foreground-muted))] animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[rgb(var(--success-500))]" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[rgb(var(--success-500))]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[rgb(var(--success-500))]" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
          
          {/* Hero visual - Dashboard preview */}
          <div className="mt-20 relative animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="relative mx-auto max-w-5xl">
              {/* Glow effect behind card */}
              <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--primary-400))] to-[rgb(var(--primary-600))] rounded-2xl blur-2xl opacity-20 scale-95" />
              
              {/* Dashboard mockup card */}
              <div className="relative card-elevated p-2 rounded-2xl overflow-hidden">
                <div className="bg-[rgb(var(--neutral-100))] rounded-xl p-6">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-[rgb(var(--error-400))]" />
                    <div className="w-3 h-3 rounded-full bg-[rgb(var(--warning-400))]" />
                    <div className="w-3 h-3 rounded-full bg-[rgb(var(--success-400))]" />
                    <div className="flex-1 mx-4">
                      <div className="h-6 bg-[rgb(var(--neutral-200))] rounded-full max-w-xs" />
                    </div>
                  </div>
                  
                  {/* Dashboard content preview */}
                  <div className="grid grid-cols-12 gap-4">
                    {/* Sidebar placeholder */}
                    <div className="col-span-2 space-y-3">
                      <div className="h-8 bg-[rgb(var(--primary-100))] rounded-lg" />
                      <div className="h-6 bg-[rgb(var(--neutral-200))] rounded-lg w-4/5" />
                      <div className="h-6 bg-[rgb(var(--neutral-200))] rounded-lg w-3/4" />
                      <div className="h-6 bg-[rgb(var(--neutral-200))] rounded-lg w-4/5" />
                    </div>
                    
                    {/* Main content placeholder */}
                    <div className="col-span-10 space-y-4">
                      <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="h-4 bg-[rgb(var(--neutral-200))] rounded w-1/2 mb-2" />
                            <div className="h-6 bg-[rgb(var(--primary-100))] rounded w-3/4" />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-4 rounded-xl shadow-sm h-32" />
                        <div className="bg-white p-4 rounded-xl shadow-sm h-32" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[rgb(var(--background-elevated))]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[rgb(var(--primary-600))] uppercase tracking-wider">
              Features
            </span>
            <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[rgb(var(--foreground))]">
              Everything you need to
              <span className="text-[rgb(var(--primary-600))]"> delight clients</span>
            </h2>
            <p className="mt-4 text-lg text-[rgb(var(--foreground-secondary))] max-w-2xl mx-auto">
              Streamline your workflow with powerful features designed for modern agencies.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 hover-lift group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(var(--primary-100))] to-[rgb(var(--primary-50))] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-[rgb(var(--primary-600))]" />
              </div>
              <h3 className="text-xl font-semibold text-[rgb(var(--foreground))] mb-3">
                Live Progress Tracking
              </h3>
              <p className="text-[rgb(var(--foreground-secondary))] leading-relaxed">
                Clients see real-time project status, milestones, and completion percentages 
                without asking. Beautiful progress visualizations keep everyone aligned.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 hover-lift group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(var(--success-100))] to-[rgb(var(--success-50))] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-[rgb(var(--success-600))]" />
              </div>
              <h3 className="text-xl font-semibold text-[rgb(var(--foreground))] mb-3">
                Instant Messaging
              </h3>
              <p className="text-[rgb(var(--foreground-secondary))] leading-relaxed">
                In-project chat keeps all communication in context. No more lost emails 
                or Slack threads. Everything stays organized and searchable.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 hover-lift group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(var(--warning-100))] to-[rgb(var(--warning-50))] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-[rgb(var(--warning-600))]" />
              </div>
              <h3 className="text-xl font-semibold text-[rgb(var(--foreground))] mb-3">
                File Sharing
              </h3>
              <p className="text-[rgb(var(--foreground-secondary))] leading-relaxed">
                Share deliverables, gather feedback, and keep all project files organized 
                in one place. Version history included.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card p-8 hover-lift group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(var(--error-100))] to-[rgb(var(--error-50))] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-[rgb(var(--error-600))]" />
              </div>
              <h3 className="text-xl font-semibold text-[rgb(var(--foreground))] mb-3">
                Secure Client Portals
              </h3>
              <p className="text-[rgb(var(--foreground-secondary))] leading-relaxed">
                Each client gets their own secure portal with unique access tokens. 
                No passwords to remember, no accounts to manage.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card p-8 hover-lift group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(var(--primary-100))] to-[rgb(var(--primary-50))] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-[rgb(var(--primary-600))]" />
              </div>
              <h3 className="text-xl font-semibold text-[rgb(var(--foreground))] mb-3">
                Real-time Updates
              </h3>
              <p className="text-[rgb(var(--foreground-secondary))] leading-relaxed">
                Changes sync instantly across all devices. Clients see updates the 
                moment you make them—no refresh needed.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card p-8 hover-lift group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(var(--success-100))] to-[rgb(var(--success-50))] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-[rgb(var(--success-600))]" />
              </div>
              <h3 className="text-xl font-semibold text-[rgb(var(--foreground))] mb-3">
                Team Collaboration
              </h3>
              <p className="text-[rgb(var(--foreground-secondary))] leading-relaxed">
                Invite team members, assign tasks, and track who's doing what. 
                Perfect visibility for the whole team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof / Stats section */}
      <section className="py-20 bg-gradient-to-b from-[rgb(var(--background-elevated))] to-[rgb(var(--background))]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Projects Managed' },
              { value: '2,500+', label: 'Happy Clients' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9/5', label: 'User Rating' },
            ].map((stat, i) => (
              <div key={i} className="p-6">
                <div className="text-4xl lg:text-5xl font-bold text-[rgb(var(--foreground))] mb-2">
                  {stat.value}
                </div>
                <div className="text-[rgb(var(--foreground-secondary))]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative card-elevated p-12 lg:p-16 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 gradient-mesh opacity-30" />
            
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold text-[rgb(var(--foreground))] mb-4">
                Ready to transform your client experience?
              </h2>
              <p className="text-lg text-[rgb(var(--foreground-secondary))] mb-8 max-w-2xl mx-auto">
                Join thousands of agencies already using ClientPulse to keep their 
                clients happy and projects on track.
              </p>
              <Link
                href="/signup"
                className="btn btn-primary text-base px-10 py-4"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[rgb(var(--border-light))]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-[rgb(var(--foreground))]">ClientPulse</span>
            </div>
            <p className="text-sm text-[rgb(var(--foreground-muted))]">
              Built by Sparks AI • © 2026 All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
