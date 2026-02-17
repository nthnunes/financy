/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand
        brand: {
          dark: "#124B2B",
          base: "#1F6F43",
        },
        // Grayscale
        gray: {
          100: "#F8F9FA",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#111827",
        },
        // Feedback
        danger: "#EF4444",
        success: "#19AD70",
        // Colors
        blue: {
          dark: "#1D4ED8",
          base: "#2563EB",
          light: "#DBEAFE",
        },
        purple: {
          dark: "#7E22CE",
          base: "#9333EA",
          light: "#F3E8FF",
        },
        pink: {
          dark: "#BE185D",
          base: "#DB2777",
          light: "#FCE7F3",
        },
        red: {
          dark: "#B91C1C",
          base: "#DC2626",
          light: "#FEE2E2",
        },
        orange: {
          dark: "#C2410C",
          base: "#EA580C",
          light: "#FFEDD5",
        },
        yellow: {
          dark: "#A16207",
          base: "#CA8A04",
          light: "#F7F3CA",
        },
        green: {
          dark: "#15803D",
          base: "#16A34A",
          light: "#E0FAE9",
        },
      },
    },
  },
  plugins: [],
};
