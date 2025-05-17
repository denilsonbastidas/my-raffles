/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          50: "#F9FAFB",
          100: "#E5E7EB",
          150: "#E2E8F0",
          200: "#EAECF0",
          300: "#D0D5DD",
          400: "#98A2B3",
          500: "#667085",
          600: "#475467",
          700: "#344054",
          800: "#1D2939",
          900: "#101828",
        },
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', "sans-serif"],
        anton: ['"Anton"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
