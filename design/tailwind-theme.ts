/**
 * Tennis Recommender — Tailwind CSS theme extension
 *
 * Uso em tailwind.config.ts:
 *
 *   import { tennisTheme } from './design/tailwind-theme'
 *
 *   export default {
 *     content: ['./src/**\/*.{ts,tsx}'],
 *     theme: {
 *       extend: tennisTheme,
 *     },
 *   }
 */

export const tennisTheme = {
  colors: {
    saibro: {
      DEFAULT: '#4A7C59',
      dark: '#3A6347',
      light: '#6B9E7A',
    },
    laranja: {
      DEFAULT: '#E8622A',
      dark: '#C94E1E',
      light: '#F08055',
    },
    creme: {
      DEFAULT: '#F5F0E8',
      dark: '#EDE7D9',
    },
    cinza: {
      DEFAULT: '#2C2C2C',
      medium: '#6B6B6B',
      light: '#ADADAD',
    },
    // aliases semânticos
    background: '#F5F0E8',
    surface: '#FFFFFF',
    'text-primary': '#2C2C2C',
    'text-secondary': '#6B6B6B',
    'text-disabled': '#ADADAD',
    'border-default': '#EDE7D9',
    'border-focus': '#4A7C59',
  },

  fontFamily: {
    display: ['Clash Display', 'sans-serif'],
    body: ['Inter', 'sans-serif'],
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.65rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '1.875rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.625rem' }],
  },

  borderRadius: {
    xs: '4px',
    sm: '6px',
    md: '12px',
    lg: '20px',
    xl: '28px',
  },

  spacing: {
    // valores adicionais que o Tailwind default não cobre
    '5': '1.25rem',
    '10': '2.5rem',
    '18': '4.5rem',
    '20': '5rem',
    '24': '6rem',
    '28': '7rem',
  },

  boxShadow: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 4px 16px rgba(0,0,0,0.10)',
    lg: '0 8px 32px rgba(0,0,0,0.12)',
    focus: '0 0 0 3px rgba(74, 124, 89, 0.30)',
    'focus-laranja': '0 0 0 3px rgba(232, 98, 42, 0.25)',
  },

  transitionTimingFunction: {
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  transitionDuration: {
    fast: '150ms',
    base: '250ms',
    slow: '400ms',
  },

  maxWidth: {
    quiz: '480px',
    result: '720px',
    content: '1200px',
  },
} as const
