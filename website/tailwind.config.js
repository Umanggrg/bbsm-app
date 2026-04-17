/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#E07830',
          dark: '#B85F20',
          light: '#FFF2EA',
          lighter: '#FFF8F4',
        },
        steel: {
          DEFAULT: '#4A7FA0',
          light: '#EBF4FA',
        },
        navy: '#1D1D1F',
        cream: '#F5F5F7',
        'mid-gray': '#6E6E73',
      },
      boxShadow: {
        card: 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px',
        'card-hover': 'rgba(0,0,0,0.04) 0px 0px 0px 1px, rgba(0,0,0,0.08) 0px 4px 16px, rgba(0,0,0,0.14) 0px 8px 24px',
        nav: 'rgba(0,0,0,0.04) 0px 2px 8px',
      },
      letterSpacing: {
        heading: '-0.44px',
        'heading-sm': '-0.18px',
      },
    },
  },
  plugins: [],
};
