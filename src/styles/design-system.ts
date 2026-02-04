/**
 * ClientPulse Design System
 * A comprehensive, production-ready design token system
 * 
 * Design Philosophy:
 * - Linear/Notion/Stripe-level polish
 * - Generous whitespace (breathing room)
 * - Soft shadows with depth
 * - Consistent 4px spacing grid
 * - Muted palette with strategic accent pops
 * - Smooth micro-interactions everywhere
 */

// =============================================================================
// COLORS
// =============================================================================
export const colors = {
  // Primary - Deep Indigo (trust & professionalism)
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  
  // Success - Emerald (positive states)
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
  
  // Warning - Amber (attention needed)
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
  
  // Error - Rose (errors & destructive)
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
  
  // Neutral - Slate (sophisticated grays)
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

// =============================================================================
// TYPOGRAPHY
// =============================================================================
export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
  },
  
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

// =============================================================================
// SPACING (4px grid system)
// =============================================================================
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
} as const

// =============================================================================
// BORDER RADIUS
// =============================================================================
export const radii = {
  none: '0',
  sm: '4px',
  DEFAULT: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
} as const

// =============================================================================
// SHADOWS (soft, layered for depth)
// =============================================================================
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.03)',
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.03)',
  md: '0 6px 12px -2px rgb(0 0 0 / 0.06), 0 3px 6px -3px rgb(0 0 0 / 0.04)',
  lg: '0 10px 25px -3px rgb(0 0 0 / 0.08), 0 4px 10px -4px rgb(0 0 0 / 0.04)',
  xl: '0 20px 40px -5px rgb(0 0 0 / 0.1), 0 8px 15px -6px rgb(0 0 0 / 0.05)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.04)',
  // Colored glow shadows
  primary: '0 4px 14px 0 rgb(99 102 241 / 0.3)',
  success: '0 4px 14px 0 rgb(16 185 129 / 0.3)',
  warning: '0 4px 14px 0 rgb(245 158 11 / 0.3)',
  error: '0 4px 14px 0 rgb(239 68 68 / 0.3)',
} as const

// =============================================================================
// ANIMATIONS & TRANSITIONS
// =============================================================================
export const transitions = {
  none: 'none',
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  DEFAULT: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

export const animations = {
  fadeIn: 'fadeIn 200ms ease-out forwards',
  fadeOut: 'fadeOut 150ms ease-in forwards',
  slideUp: 'slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
  slideDown: 'slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
  slideLeft: 'slideLeft 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
  slideRight: 'slideRight 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
  scaleIn: 'scaleIn 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
  scaleOut: 'scaleOut 150ms ease-in forwards',
  shimmer: 'shimmer 2s infinite linear',
  pulse: 'pulse 2s infinite',
  spin: 'spin 1s infinite linear',
  bounce: 'bounce 1s infinite',
  float: 'float 3s ease-in-out infinite',
  shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
} as const

// =============================================================================
// BREAKPOINTS
// =============================================================================
export const breakpoints = {
  xs: '375px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// =============================================================================
// Z-INDEX SCALE
// =============================================================================
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const

// =============================================================================
// SEMANTIC MAPPINGS
// =============================================================================
export const semanticColors = {
  // Backgrounds
  background: {
    page: 'rgb(var(--background))',
    elevated: 'rgb(var(--background-elevated))',
    sunken: 'rgb(var(--background-sunken))',
    overlay: 'rgba(15, 23, 42, 0.5)',
  },
  
  // Text
  text: {
    primary: 'rgb(var(--foreground))',
    secondary: 'rgb(var(--foreground-secondary))',
    muted: 'rgb(var(--foreground-muted))',
    inverse: 'rgb(var(--neutral-0))',
    link: 'rgb(var(--primary-600))',
  },
  
  // Borders
  border: {
    default: 'rgb(var(--border))',
    light: 'rgb(var(--border-light))',
    focus: 'rgb(var(--ring))',
    error: 'rgb(var(--error-500))',
  },
  
  // Interactive states
  interactive: {
    default: 'rgb(var(--primary-600))',
    hover: 'rgb(var(--primary-700))',
    active: 'rgb(var(--primary-800))',
    disabled: 'rgb(var(--neutral-300))',
  },
  
  // Status indicators
  status: {
    todo: {
      bg: 'rgb(var(--neutral-100))',
      text: 'rgb(var(--neutral-600))',
      border: 'rgb(var(--neutral-200))',
    },
    planning: {
      bg: 'rgb(var(--primary-50))',
      text: 'rgb(var(--primary-700))',
      border: 'rgb(var(--primary-200))',
    },
    in_progress: {
      bg: 'rgb(var(--warning-50))',
      text: 'rgb(var(--warning-700))',
      border: 'rgb(var(--warning-200))',
    },
    review: {
      bg: 'rgb(var(--primary-50))',
      text: 'rgb(var(--primary-700))',
      border: 'rgb(var(--primary-200))',
    },
    done: {
      bg: 'rgb(var(--success-50))',
      text: 'rgb(var(--success-700))',
      border: 'rgb(var(--success-200))',
    },
    completed: {
      bg: 'rgb(var(--success-50))',
      text: 'rgb(var(--success-700))',
      border: 'rgb(var(--success-200))',
    },
    on_hold: {
      bg: 'rgb(var(--neutral-100))',
      text: 'rgb(var(--neutral-600))',
      border: 'rgb(var(--neutral-200))',
    },
    overdue: {
      bg: 'rgb(var(--error-50))',
      text: 'rgb(var(--error-700))',
      border: 'rgb(var(--error-200))',
    },
    draft: {
      bg: 'rgb(var(--neutral-100))',
      text: 'rgb(var(--neutral-500))',
      border: 'rgb(var(--neutral-200))',
    },
    sent: {
      bg: 'rgb(var(--primary-50))',
      text: 'rgb(var(--primary-700))',
      border: 'rgb(var(--primary-200))',
    },
    paid: {
      bg: 'rgb(var(--success-50))',
      text: 'rgb(var(--success-700))',
      border: 'rgb(var(--success-200))',
    },
  },
} as const

// =============================================================================
// COMPONENT TOKENS
// =============================================================================
export const components = {
  button: {
    sizes: {
      xs: { height: '28px', px: '10px', fontSize: '12px', iconSize: '14px' },
      sm: { height: '32px', px: '12px', fontSize: '13px', iconSize: '16px' },
      md: { height: '40px', px: '16px', fontSize: '14px', iconSize: '18px' },
      lg: { height: '48px', px: '20px', fontSize: '15px', iconSize: '20px' },
      xl: { height: '56px', px: '24px', fontSize: '16px', iconSize: '22px' },
    },
    variants: {
      primary: {
        bg: 'rgb(var(--primary-600))',
        text: 'white',
        hoverBg: 'rgb(var(--primary-700))',
        activeBg: 'rgb(var(--primary-800))',
        shadow: 'var(--shadow-sm)',
        hoverShadow: 'var(--shadow-primary)',
      },
      secondary: {
        bg: 'rgb(var(--neutral-100))',
        text: 'rgb(var(--neutral-700))',
        hoverBg: 'rgb(var(--neutral-200))',
        activeBg: 'rgb(var(--neutral-300))',
      },
      ghost: {
        bg: 'transparent',
        text: 'rgb(var(--foreground-secondary))',
        hoverBg: 'rgb(var(--neutral-100))',
        activeBg: 'rgb(var(--neutral-200))',
      },
      danger: {
        bg: 'rgb(var(--error-600))',
        text: 'white',
        hoverBg: 'rgb(var(--error-700))',
        activeBg: 'rgb(var(--error-800))',
        shadow: 'var(--shadow-sm)',
        hoverShadow: 'var(--shadow-error)',
      },
      outline: {
        bg: 'transparent',
        text: 'rgb(var(--primary-600))',
        border: 'rgb(var(--primary-600))',
        hoverBg: 'rgb(var(--primary-50))',
        activeBg: 'rgb(var(--primary-100))',
      },
    },
  },
  
  input: {
    sizes: {
      sm: { height: '32px', px: '10px', fontSize: '13px' },
      md: { height: '40px', px: '14px', fontSize: '14px' },
      lg: { height: '48px', px: '16px', fontSize: '15px' },
    },
  },
  
  card: {
    padding: {
      sm: '16px',
      md: '24px',
      lg: '32px',
    },
    radius: '16px',
    shadow: 'var(--shadow-sm)',
    hoverShadow: 'var(--shadow-md)',
  },
  
  avatar: {
    sizes: {
      xs: '24px',
      sm: '32px',
      md: '40px',
      lg: '48px',
      xl: '64px',
      '2xl': '96px',
    },
  },
  
  badge: {
    sizes: {
      sm: { height: '20px', px: '8px', fontSize: '11px' },
      md: { height: '24px', px: '10px', fontSize: '12px' },
      lg: { height: '28px', px: '12px', fontSize: '13px' },
    },
  },
  
  modal: {
    sizes: {
      sm: '400px',
      md: '500px',
      lg: '640px',
      xl: '800px',
      full: '100%',
    },
  },
} as const

// =============================================================================
// EXPORTS
// =============================================================================
export default {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  transitions,
  animations,
  breakpoints,
  zIndex,
  semanticColors,
  components,
}
