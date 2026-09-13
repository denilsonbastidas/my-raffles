/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
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
        // Semantic design tokens — reuse existing palette, avoid ad-hoc colors.
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#93C5FD",
        },
        accent: {
          DEFAULT: "#FBBF24",
          hover: "#F59E0B",
        },
        success: {
          DEFAULT: "#22C55E",
          hover: "#16A34A",
        },
        danger: {
          DEFAULT: "#EF4444",
          hover: "#DC2626",
        },
        warning: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
        },
        info: {
          DEFAULT: "#38BDF8",
          hover: "#0EA5E9",
        },
        surface: {
          DEFAULT: "#101828",
          alt: "#1D2939",
          muted: "rgba(0,0,0,0.25)",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
        bebas: ['"Bebas Neue"', "sans-serif"],
        anton: ['"Anton"', "sans-serif"],
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shine: {
          "0%": { transform: "translateX(-100%)" },
          "60%, 100%": { transform: "translateX(150%)" },
        },
      },
      animation: {
        floatY: "floatY 0.85s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        shine: "shine 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
