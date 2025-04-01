/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          brown: "#6F4E37",
          cream: "#FFF8E1",
          dark: "#3A2D21",
          light: "#D2B48C",
          accent: "#A67C52",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
