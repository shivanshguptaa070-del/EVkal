/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        evkal: {
          dark: '#0B0F17',
          panel: '#111827',
          card: '#1F2937',
          border: '#374151',
          emerald: '#10B981',
          blue: '#3B82F6',
          amber: '#F59E0B',
          crimson: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
