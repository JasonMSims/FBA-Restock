/* eslint-disable */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '80%': { opacity: 1 },
          '100%': { opacity: 0.5, width: '100%' },
        },
      },
      animation: {
        progress: 'progress 1 forwards linear',
      },
      transitionProperty: {
        width: 'width',
        spacing: 'margin, padding',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
