/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#061a14',
          900: '#0e382c',
          800: '#134e3e',
          700: '#1b6753',
          600: '#268169',
        },
        mint: {
          50: '#f0fdf7',
          100: '#dcfce9',
          200: '#bbf7d2',
          300: '#86efb0',
          400: '#4ade8b',
          500: '#10b981',
          600: '#059669',
        },
        canvas: '#f8faf9',
        surface: '#ffffff',
      },
    },
  },
  plugins: [],
}
