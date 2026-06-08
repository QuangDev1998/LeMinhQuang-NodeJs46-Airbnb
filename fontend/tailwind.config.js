/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rausch: {
          DEFAULT: "#ff385c",
          dark: "#e00b41",
        },
        hof: "#222222",
        foggy: "#717171",
      },
      fontFamily: {
        sans: [
          "Circular",
          "-apple-system",
          "BlinkMacSystemFont",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      boxShadow: {
        airbnb: "0 6px 16px rgba(0,0,0,0.12)",
        "airbnb-hover": "0 10px 28px rgba(0,0,0,0.18)",
      },
    },
  },
  plugins: [],
};
