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
        primary: {
          DEFAULT: '#22c55e',
          dark: '#15803d',
          light: '#86efac',
        },
        secondary: {
          DEFAULT: '#15803d',
          dark: '#166534',
          light: '#bbf7d0',
        },
        accent: {
          DEFAULT: '#10b981',
          dark: '#0f766e',
          light: '#a7f3d0',
        },
        darkbg: {
          DEFAULT: '#0f172a', // Slate 900
          card: '#1e293b',    // Slate 800
          border: '#334155',  // Slate 700
          text: '#f1f5f9',    // Slate 100
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
