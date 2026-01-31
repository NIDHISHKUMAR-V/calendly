/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#006BFF', // Calendly-ish blue
        secondary: '#0B3558',
        background: '#FFFFFE',
        surface: '#F8F9FA',
      }
    },
  },
  plugins: [],
}
