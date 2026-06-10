// 🎨 GameTracker Design System
// Modern, accessible, and performant design tokens

export const colors = {
  // Primary Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },
  
  // Secondary Colors
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  
  // Accent Colors
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    950: '#4a044e'
  },
  
  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a'
  },
  
  // Semantic Colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
    display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif']
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  }
};

export const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px'
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // Colored shadows
  primary: '0 4px 14px 0 rgba(59, 130, 246, 0.15)',
  success: '0 4px 14px 0 rgba(34, 197, 94, 0.15)',
  warning: '0 4px 14px 0 rgba(245, 158, 11, 0.15)',
  error: '0 4px 14px 0 rgba(239, 68, 68, 0.15)'
};

export const animations = {
  // Duration
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  
  // Easing
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  
  // Keyframes
  keyframes: {
    fadeIn: {
      from: { opacity: '0' },
      to: { opacity: '1' }
    },
    slideInUp: {
      from: { transform: 'translateY(20px)', opacity: '0' },
      to: { transform: 'translateY(0)', opacity: '1' }
    },
    slideInDown: {
      from: { transform: 'translateY(-20px)', opacity: '0' },
      to: { transform: 'translateY(0)', opacity: '1' }
    },
    slideInLeft: {
      from: { transform: 'translateX(-20px)', opacity: '0' },
      to: { transform: 'translateX(0)', opacity: '1' }
    },
    slideInRight: {
      from: { transform: 'translateX(20px)', opacity: '0' },
      to: { transform: 'translateX(0)', opacity: '1' }
    },
    scaleIn: {
      from: { transform: 'scale(0.9)', opacity: '0' },
      to: { transform: 'scale(1)', opacity: '1' }
    },
    bounce: {
      '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
      '40%, 43%': { transform: 'translateY(-30px)' },
      '70%': { transform: 'translateY(-15px)' },
      '90%': { transform: 'translateY(-4px)' }
    },
    pulse: {
      '0%': { transform: 'scale(1)', opacity: '1' },
      '50%': { transform: 'scale(1.05)', opacity: '0.8' },
      '100%': { transform: 'scale(1)', opacity: '1' }
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' }
    },
    ping: {
      '75%, 100%': { transform: 'scale(2)', opacity: '0' }
    }
  }
};

export const transitions = {
  // Common transitions
  all: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Specific transitions
  button: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  card: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  modal: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  dropdown: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

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
  tooltip: 1800
};

// Component-specific styles
export const components = {
  button: {
    primary: {
      backgroundColor: colors.primary[600],
      color: 'white',
      padding: `${spacing[3]} ${spacing[6]}`,
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.medium,
      transition: transitions.button,
      boxShadow: shadows.sm,
      '&:hover': {
        backgroundColor: colors.primary[700],
        boxShadow: shadows.md,
        transform: 'translateY(-1px)'
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: shadows.sm
      }
    },
    secondary: {
      backgroundColor: colors.neutral[100],
      color: colors.neutral[900],
      padding: `${spacing[3]} ${spacing[6]}`,
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.medium,
      transition: transitions.button,
      border: `1px solid ${colors.neutral[200]}`,
      '&:hover': {
        backgroundColor: colors.neutral[200],
        borderColor: colors.neutral[300]
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.neutral[700],
      padding: `${spacing[3]} ${spacing[6]}`,
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.medium,
      transition: transitions.button,
      '&:hover': {
        backgroundColor: colors.neutral[100],
        color: colors.neutral[900]
      }
    }
  },
  
  card: {
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.sm,
    padding: spacing[6],
    transition: transitions.card,
    '&:hover': {
      boxShadow: shadows.md,
      transform: 'translateY(-2px)'
    }
  },
  
  input: {
    backgroundColor: 'white',
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.lg,
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.base,
    transition: transitions.colors,
    '&:focus': {
      outline: 'none',
      borderColor: colors.primary[500],
      boxShadow: `0 0 0 3px ${colors.primary[100]}`
    },
    '&:hover': {
      borderColor: colors.neutral[400]
    }
  }
};

// Dark theme overrides
export const darkTheme = {
  colors: {
    ...colors,
    neutral: {
      50: '#0a0a0a',
      100: '#171717',
      200: '#262626',
      300: '#404040',
      400: '#525252',
      500: '#737373',
      600: '#a3a3a3',
      700: '#d4d4d4',
      800: '#e5e5e5',
      900: '#f5f5f5',
      950: '#fafafa'
    },
    background: '#0a0a0a',
    surface: '#171717',
    text: '#f5f5f5'
  },
  
  components: {
    ...components,
    card: {
      backgroundColor: colors.darkTheme.surface,
      borderRadius: borderRadius.xl,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      padding: spacing[6],
      transition: transitions.card,
      '&:hover': {
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        transform: 'translateY(-2px)'
      }
    },
    input: {
      backgroundColor: colors.darkTheme.neutral[800],
      border: `1px solid ${colors.darkTheme.neutral[600]}`,
      borderRadius: borderRadius.lg,
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
      color: colors.darkTheme.text,
      transition: transitions.colors,
      '&:focus': {
        outline: 'none',
        borderColor: colors.primary[400],
        boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.1)`
      }
    }
  }
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  transitions,
  breakpoints,
  zIndex,
  components,
  darkTheme
};
