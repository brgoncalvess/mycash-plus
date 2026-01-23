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
          400: '#D7FF00', // Primary Lime (Figma Primary-500)
          500: '#D7FF00',
          DEFAULT: '#D7FF00',
          dark: '#c4e703', // Figma Brand-700
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
          50: '#E7E8EA',  // Light Border
          500: '#1A1A1A', // Dark Text
          900: '#060A11', // Figma Secondary-900
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

