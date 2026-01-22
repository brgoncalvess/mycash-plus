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
          400: '#a3e635', // Primary Lime
          DEFAULT: '#a3e635',
          dark: '#65a30d',
        },
        surface: {
          500: '#FFFFFF', // White
          DEFAULT: '#FFFFFF',
        },
        background: {
          400: '#F5F6F8', // Light Gray Bg
          DEFAULT: '#F5F6F8',
        },
        secondary: {
          500: '#1A1A1A', // Dark Text
          50: '#E7E8EA',  // Light Border
          DEFAULT: '#1A1A1A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        'float': '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem', // 16px
        '2xl': '1.5rem', // 24px
        '3xl': '2rem', // 32px
      }
    },
  },
  plugins: [],
}

