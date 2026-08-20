/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#1A1A2E',
          hover: '#2A2A42',
        },
        accent: {
          DEFAULT: '#E85D26',
          hover: '#D44C15',
          light: '#FFF0EA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '0.75rem',
      }
    },
  },
  plugins: [],
}
