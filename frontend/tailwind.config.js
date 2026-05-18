/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        critical: "#ef4444",
        warning:  "#f59e0b",
        safe:     "#22c55e",
        surface:  "#0f172a",
      },
    },
  },
  plugins: [],
}

