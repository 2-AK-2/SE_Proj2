/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        olaYellow: "#FFD700",   // Ola’s signature yellow
        olaBlack: "#121212",    // Deep black
        olaGray: "#F4F4F4",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
