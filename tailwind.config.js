/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "mainBackgroundColor":'#FFC0A7',
        "columnBackgroundColor": '#E6E6FA',
      }
    },
  },
  plugins: [],
}

