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
        card: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
};
