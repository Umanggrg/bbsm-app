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
        },
        steel: {
          DEFAULT: '#4A7FA0',
          light: '#EBF4FA',
        },
        navy: '#1D1D1F',
        cream: '#F2F2F7',
      },
    },
  },
  plugins: [],
};


