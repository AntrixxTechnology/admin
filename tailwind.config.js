/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        inkBlack: '#111111',
        inkDark: '#222222',
        amberAccent: '#F2A33C',
        amberAccentDark: '#D98A22',
        offWhite: '#F8F9FA',
        charcoal: '#343A40',
        gray100: '#F3F3F3',
        gray200: '#E9ECEF',
        gray500: '#6C757D',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        amberGlow: '0 4px 20px -2px rgba(242, 163, 60, 0.35)',
        cardLight: '0 4px 20px -4px rgba(0, 0, 0, 0.05)',
        cardHover: '0 12px 30px -4px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
