/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fondo-claro': '#F7F7FF',
        'texto-oscuro': '#070707',
        'barber-azul': '#3F88C5',
        'barber-rojo': '#BB0A21',
      }, 
      
    },
  },
  plugins: [],
}