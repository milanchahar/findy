/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Tight', 'San Francisco', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
