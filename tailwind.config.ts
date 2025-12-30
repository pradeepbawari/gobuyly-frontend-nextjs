import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
  './src/**/*.{js,ts,jsx,tsx,mdx}', // ← This works for src directory
  './app/**/*.{js,ts,jsx,tsx,mdx}', // ← If using app directory directly
],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
        },
        teal: {
          500: '#14b8a6',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  // ADD THESE PLUGINS
  plugins: [],
  // ADD THIS FOR VARIANT SUPPORT
  variants: {
    extend: {
      gridColumn: ['responsive'], // This enables md:grid-cols-*
    }
  }
}

export default config