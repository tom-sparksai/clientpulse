import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'ClientPulse - Agency Dashboard',
    template: '%s | ClientPulse',
  },
  description: 'Real-time client management for modern agencies. Track projects, communicate seamlessly, and delight your clients.',
  keywords: ['agency management', 'client portal', 'project tracking', 'invoicing', 'client communication'],
  authors: [{ name: 'Sparks AI', url: 'https://sparksai.in' }],
  creator: 'Sparks AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://clientpulse.app',
    siteName: 'ClientPulse',
    title: 'ClientPulse - Agency Dashboard',
    description: 'Real-time client management for modern agencies',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ClientPulse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClientPulse - Agency Dashboard',
    description: 'Real-time client management for modern agencies',
    images: ['/og-image.png'],
    creator: '@sparksai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
