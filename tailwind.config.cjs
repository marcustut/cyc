/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./node_modules/flowbite-react/**/*.js', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        lemonDays: ['Lemon Days', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [require('flowbite/plugin')],
};
