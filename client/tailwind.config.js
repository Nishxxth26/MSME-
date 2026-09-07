/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f2f9f4',
          100: '#e1f3e7',
          200: '#c4e6ce',
          300: '#97d2aa',
          400: '#63b581',
          500: '#3e9960',
          600: '#2e7c4b',
          700: '#26623d',
          800: '#214e32',
          900: '#1c412b',
          950: '#0b2416',
        },
        earth: {
          50: '#faf7f2',
          100: '#f3ece1',
          200: '#e5d7c3',
          300: '#d3bd9f',
          400: '#c0a17e',
          500: '#b18c66',
          600: '#a37a59',
          700: '#876249',
          800: '#6f503e',
          900: '#5c4335',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
