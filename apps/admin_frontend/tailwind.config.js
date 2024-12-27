/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"],
        helvetica: ["Helvetica", "Arial", "sans-serif"],
      },
      backdropBlur: {
        16: "16px", // Add custom blur value
      },
    },
  },
  plugins: [],
};
