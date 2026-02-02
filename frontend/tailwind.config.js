/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#166534",
          dark: "#14532d",
          light: "#22c55e",
        },
      },
    },
  },
  plugins: [],
};
