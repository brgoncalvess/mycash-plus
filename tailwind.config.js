/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'md': '768px',   // Tablet
      'lg': '1280px',  // Desktop
      'xl': '1920px',  // Wide / 4K
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#a3e635', // lime-400
          dark: '#65a30d', // lime-600
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

