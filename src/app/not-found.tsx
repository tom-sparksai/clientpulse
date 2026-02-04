import Link from 'next/link'
import { FileQuestion, ArrowLeft, Home, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[rgb(var(--foreground))]">ClientPulse</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          {/* Illustration */}
          <div className="relative mb-8">
            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-[rgb(var(--primary-100))] blur-3xl opacity-50" />
            </div>
            
            {/* Icon container */}
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[rgb(var(--primary-100))] to-[rgb(var(--primary-50))] animate-pulse-soft" />
              <div className="relative w-full h-full rounded-3xl bg-[rgb(var(--neutral-100))] flex items-center justify-center">
                <FileQuestion className="w-14 h-14 text-[rgb(var(--foreground-muted))]" />
              </div>
            </div>
          </div>

          {/* Text */}
          <h1 className="text-6xl font-bold text-[rgb(var(--foreground))] mb-4 tracking-tight">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-[rgb(var(--foreground))] mb-3">
            Page not found
          </h2>
          <p className="text-[rgb(var(--foreground-secondary))] mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="btn btn-primary w-full sm:w-auto"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <button
              onClick={() => history.back()}
              className="btn btn-secondary w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-sm text-[rgb(var(--foreground-muted))]">
          Need help? Contact us at{' '}
          <a 
            href="mailto:support@clientpulse.app" 
            className="text-[rgb(var(--primary-600))] hover:underline"
          >
            support@clientpulse.app
          </a>
        </p>
      </footer>
    </div>
  )
}
