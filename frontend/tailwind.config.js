/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: "#1F6F43",
          dark: "#124B2B",
          light: "#E0FAE9",
        },
        brand: {
          DEFAULT: "#1F6F43",
          dark: "#124B2B",
          base: "#1F6F43",
        },
        // Grayscale (projeto)
        gray: {
          50: "#F8F9FA",
          100: "#F8F9FA",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#111827",
          900: "#111827",
        },
        // Neutral
        black: "#000000",
        white: "#ffffff",
        // Feedback
        danger: "#EF4444",
        success: "#19AD70",
        // Blue
        blue: {
          100: "#DBEAFE",
          400: "#2563EB",
          500: "#2563EB",
          600: "#2563EB",
          800: "#1D4ED8",
        },
        // Purple
        purple: {
          100: "#F3E8FF",
          400: "#9333EA",
          500: "#9333EA",
          600: "#9333EA",
          800: "#7E22CE",
        },
        // Pink
        pink: {
          100: "#FCE7F3",
          400: "#DB2777",
          500: "#DB2777",
          600: "#DB2777",
          800: "#BE185D",
        },
        // Red
        red: {
          50: "#FEE2E2",
          100: "#FEE2E2",
          400: "#DC2626",
          500: "#DC2626",
          600: "#DC2626",
          800: "#B91C1C",
        },
        // Orange
        orange: {
          100: "#FFEDD5",
          400: "#EA580C",
          500: "#EA580C",
          600: "#EA580C",
          800: "#C2410C",
        },
        // Yellow
        yellow: {
          100: "#F7F3CA",
          400: "#CA8A04",
          500: "#CA8A04",
          600: "#A16207",
          800: "#A16207",
        },
        // Green
        green: {
          50: "#E0FAE9",
          100: "#E0FAE9",
          400: "#16A34A",
          500: "#16A34A",
          600: "#16A34A",
          800: "#15803D",
        },
      },
    },
  },
  plugins: [],
};
