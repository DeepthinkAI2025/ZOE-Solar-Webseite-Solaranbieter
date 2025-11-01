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
      typography: {
        DEFAULT: {
          css: {
            h2: {
              fontSize: '1.5rem', // text-2xl
              fontWeight: '700',
              marginTop: '1.5rem',
              marginBottom: '1rem',
            },
            h3: {
              fontSize: '1.125rem', // text-lg
              fontWeight: '600',
              marginTop: '1.25rem',
              marginBottom: '0.75rem',
            },
            p: {
              fontSize: '1rem', // text-base
              lineHeight: '1.625',
              marginBottom: '1rem',
            },
            li: {
              fontSize: '1rem',
              marginBottom: '0.5rem',
            },
            'ul > li': {
              paddingLeft: '1.5rem',
            },
            'ol > li': {
              paddingLeft: '1.5rem',
            },
          },
        },
      },
      spacing: {
        'touch-target': '44px', // Minimum touch target size for accessibility
      },
      fontSize: {
        'heading-1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }], // text-4xl
        'heading-2': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }], // text-3xl
        'heading-3': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }], // text-2xl
        'heading-4': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }], // text-xl
        'heading-5': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }], // text-lg
        'body-large': ['1.125rem', { lineHeight: '1.75rem' }], // text-lg
        'body-base': ['1rem', { lineHeight: '1.625rem' }], // text-base
        'body-small': ['0.875rem', { lineHeight: '1.5rem' }], // text-sm
      },
      colors: {
        'brand-green': '#16a34a', // green-600
        'brand-dark': '#0f172a', // slate-900
        'brand-light': '#f1f5f9', // slate-100
      },
    },
  },
  plugins: [],
}

