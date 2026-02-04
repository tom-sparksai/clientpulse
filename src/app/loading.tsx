import { Sparkles } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-[rgb(var(--primary-500))] blur-xl opacity-30 animate-pulse" />
          
          {/* Logo container */}
          <div className="relative w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg animate-bounce">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">
            Loading...
          </h2>
          
          {/* Loading bar */}
          <div className="w-48 h-1 bg-[rgb(var(--neutral-200))] rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-[rgb(var(--primary-500))] to-[rgb(var(--primary-400))] rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  )
}
