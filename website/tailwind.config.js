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
        glow: '0 0 0 3px rgba(224,120,48,0.18)',
        'glow-lg': '0 8px 32px rgba(224,120,48,0.22)',
      },
      letterSpacing: {
        heading: '-0.44px',
        'heading-sm': '-0.18px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up-sm': 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s infinite linear',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
};
