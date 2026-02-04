'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })
    // Log to error reporting service in production
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-[rgb(var(--error-100))] blur-2xl opacity-50" />
              </div>
              <div className="relative w-20 h-20 mx-auto rounded-2xl bg-[rgb(var(--error-50))] flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-[rgb(var(--error-500))]" />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-2">
              Something went wrong
            </h2>
            <p className="text-[rgb(var(--foreground-secondary))] mb-6">
              An unexpected error occurred. Don't worry, your data is safe.
            </p>

            {/* Error details (dev only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-[rgb(var(--neutral-100))] rounded-xl p-4">
                <summary className="cursor-pointer text-sm font-medium text-[rgb(var(--foreground-secondary))] flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Error details
                </summary>
                <pre className="mt-3 text-xs overflow-auto max-h-40 p-3 bg-[rgb(var(--neutral-900))] text-[rgb(var(--neutral-100))] rounded-lg">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="btn btn-primary w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                href="/dashboard"
                className="btn btn-secondary w-full sm:w-auto"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional wrapper for use in app directory
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
