/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oep: {
          dark: '#083324',
          primary: '#0e5a3e',
          secondary: '#168058',
          light: '#e8f5ee',
          accent: '#d48b19',
          gold: '#c27803',
          red: '#b91c1c',
          card: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
