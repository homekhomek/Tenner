/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        altima: ['altima', 'sans-serif'], // 'sans-serif' is fallback
        chronotype: ['chronotype', 'sans-serif'], // 'sans-serif' is fallback
      },
    },
  },
  plugins: [],
}