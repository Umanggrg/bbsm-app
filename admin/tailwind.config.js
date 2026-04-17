/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
      },
      colors: {
        // BBSM Red — primary brand, building signage
        primary: {
          DEFAULT: '#E07830',
          dark: '#B85F20',
          light: '#FFF2EA',
        },
        // BBSM red — accent use (building signage)
        red: {
          DEFAULT: '#C8102E',
          dark: '#A00D24',
          light: '#FFE5E9',
        },
        // Building steel blue — cool architectural accent
        steel: {
          DEFAULT: '#4A7FA0',
          dark: '#346080',
          light: '#E8F2F8',
        },
        // Mountain blue — lighter sky accent from logo
        mountain: '#7BAFC8',
        // Gold — loyalty tiers, highlights
        accent: {
          DEFAULT: '#D4A843',
          light: '#FBF3E0',
        },
        // Warm cream background
        cream: '#FFF8F0',
        // Deep navy text (building-inspired)
        navy: '#1A2D40',
      },
      boxShadow: {
        card: 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px',
        'card-hover': 'rgba(0,0,0,0.04) 0px 0px 0px 1px, rgba(0,0,0,0.08) 0px 4px 16px, rgba(0,0,0,0.14) 0px 8px 24px',
      },
    },
  },
  plugins: [],
};
