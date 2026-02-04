/**
 * ClientPulse Design System
 * A premium, Dribbble-inspired design token system
 * 
 * Design Principles:
 * - Generous whitespace (breathing room)
 * - Subtle shadows (depth without harshness)
 * - 4px/8px spacing grid
 * - Muted colors with strategic accent pops
 * - Modern rounded corners (12-16px for cards)
 * - Smooth micro-interactions
 */

export const colors = {
  // Primary - Deep indigo for trust & professionalism
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Main
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  
  // Success - Fresh emerald
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  
  // Warning - Warm amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Error - Soft rose
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Neutral - Slate grays for sophistication
  neutral: {
    0: '#ffffff',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
} as const

export const typography = {
  // Font families
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
  },
  
  // Font sizes - following 1.25 ratio (major third)
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.015em' }],
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
    '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
    '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.035em' }],
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

export const spacing = {
  // 4px base unit system
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
} as const

export const borderRadius = {
  none: '0',
  sm: '0.375rem',   // 6px - small elements
  DEFAULT: '0.5rem', // 8px - buttons, inputs
  md: '0.625rem',   // 10px
  lg: '0.75rem',    // 12px - cards
  xl: '1rem',       // 16px - large cards, modals
  '2xl': '1.25rem', // 20px - hero sections
  '3xl': '1.5rem',  // 24px - special elements
  full: '9999px',   // pills, avatars
} as const

export const shadows = {
  // Soft, layered shadows for depth
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.03)',
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.03)',
  md: '0 6px 12px -2px rgb(0 0 0 / 0.06), 0 3px 6px -3px rgb(0 0 0 / 0.04)',
  lg: '0 10px 25px -3px rgb(0 0 0 / 0.08), 0 4px 10px -4px rgb(0 0 0 / 0.04)',
  xl: '0 20px 40px -5px rgb(0 0 0 / 0.1), 0 8px 15px -6px rgb(0 0 0 / 0.05)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.04)',
  // Colored shadows for accent elements
  primary: '0 4px 14px 0 rgb(99 102 241 / 0.25)',
  success: '0 4px 14px 0 rgb(16 185 129 / 0.25)',
  error: '0 4px 14px 0 rgb(239 68 68 / 0.25)',
} as const

export const transitions = {
  // Smooth, premium-feeling transitions
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  DEFAULT: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  // Spring-like for micro-interactions
  bounce: '400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const

export const animation = {
  // Keyframe definitions
  fadeIn: 'fadeIn 200ms ease-out',
  fadeOut: 'fadeOut 150ms ease-in',
  slideUp: 'slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slideDown: 'slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  scaleIn: 'scaleIn 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  shimmer: 'shimmer 2s infinite linear',
  pulse: 'pulse 2s infinite',
  spin: 'spin 1s infinite linear',
} as const

// Semantic color mappings for component states
export const semanticColors = {
  // Background layers
  background: {
    page: colors.neutral[50],
    elevated: colors.neutral[0],
    sunken: colors.neutral[100],
    overlay: 'rgba(15, 23, 42, 0.4)',
  },
  
  // Text colors
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    tertiary: colors.neutral[500],
    muted: colors.neutral[400],
    inverse: colors.neutral[0],
    link: colors.primary[600],
  },
  
  // Border colors
  border: {
    DEFAULT: colors.neutral[200],
    light: colors.neutral[100],
    focus: colors.primary[500],
    error: colors.error[500],
  },
  
  // Status colors
  status: {
    todo: { bg: colors.neutral[100], text: colors.neutral[600], border: colors.neutral[200] },
    in_progress: { bg: colors.warning[50], text: colors.warning[700], border: colors.warning[200] },
    review: { bg: colors.primary[50], text: colors.primary[700], border: colors.primary[200] },
    done: { bg: colors.success[50], text: colors.success[700], border: colors.success[200] },
    overdue: { bg: colors.error[50], text: colors.error[700], border: colors.error[200] },
    sent: { bg: colors.primary[50], text: colors.primary[700], border: colors.primary[200] },
    paid: { bg: colors.success[50], text: colors.success[700], border: colors.success[200] },
  },
} as const

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  animation,
  semanticColors,
}
