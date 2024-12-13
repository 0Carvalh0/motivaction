/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#0A2239",
        secondary: "#FDCA40",
        background: "#0A2239",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        logo: ["Staatliches", "serif"],
      },
    },
  },
  plugins: [],
};
