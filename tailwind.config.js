/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './data/**/*.{js,ts,jsx,tsx}',
    './services/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Design Token System - Einheitliche Design-Sprache
      colors: {
        // Primary Color System (mapped to Solar "energy" green palette)
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#22c55e', // solar-green-500
          600: '#16a34a', // solar-green-600
          700: '#15803d', // solar-green-700
          800: '#166534',
          900: '#14532d',
        },

        // Accent Color System
        accent: {
          50: '#fefce8',
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

        // Energy Color System (alias auf primary für Lesbarkeit)
        energy: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },

        // Status Color System
        status: {
          success: {
            50: '#f0fdf4',
            500: '#22c55e',
            600: '#16a34a',
          },
          warning: {
            50: '#fffbeb',
            500: '#f59e0b',
            600: '#d97706',
          },
          error: {
            50: '#fef2f2',
            500: '#ef4444',
            600: '#dc2626',
          },
          info: {
            50: '#f0f9ff',
            500: '#0ea5e9',
            600: '#0284c7',
          },
        },

        // Neutral Color System
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
      },
      
      // Typography System
      fontSize: {
        'text-xs': ['0.75rem', { lineHeight: '1rem' }],
        'text-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'text-base': ['1rem', { lineHeight: '1.5rem' }],
        'text-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'text-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'text-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'text-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'text-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        'text-5xl': ['3rem', { lineHeight: '1.1' }],
        'text-6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      
      // Spacing System (Design Tokens)
      spacing: {
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
        '16': '4rem',     // 64px
        '20': '5rem',     // 80px
        '24': '6rem',     // 96px
        '32': '8rem',     // 128px
      },
      
      // Border Radius System
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',    // 2px
        'base': '0.25rem',   // 4px
        'md': '0.375rem',    // 6px
        'lg': '0.5rem',      // 8px
        'xl': '0.75rem',     // 12px
        '2xl': '1rem',       // 16px
        '3xl': '1.5rem',     // 24px
      },
      
      // Shadow System
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'base': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      
      // Animation System
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      
      // Responsive Breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    // Dark Mode Support
    function({ addUtilities, addComponents, theme }) {
      addComponents({
        '.dark-mode': {
          '--tw-bg-opacity': '1',
          'background-color': theme('colors.neutral.900'),
          'color': theme('colors.neutral.100'),
        },
        '.light-mode': {
          '--tw-bg-opacity': '1',
          'background-color': theme('colors.neutral.50'),
          'color': theme('colors.neutral.900'),
        },
      });
    },
  ],
};