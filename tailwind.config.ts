import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#4C0000", // Rojo granate principal
          foreground: "#FFFFF9", // Blanco crema para texto
          50: "#FFF5F5",
          100: "#FED7D7",
          200: "#FEB2B2",
          300: "#FC8181",
          400: "#F56565",
          500: "#E53E3E",
          600: "#C53030",
          700: "#9B2C2C",
          800: "#711919", // Rojo oscuro de la paleta
          900: "#4C0000", // Color principal
        },
        secondary: {
          DEFAULT: "#FF6400", // Naranja principal
          foreground: "#FFFFF9", // Blanco crema para texto
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#FF6400", // Naranja principal
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        accent: {
          DEFAULT: "#FF8F00", // Naranja dorado
          foreground: "#FFFFF9", // Blanco crema para texto
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#FF8F00", // Naranja dorado principal
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        destructive: {
          DEFAULT: "#711919", // Rojo oscuro para destructivo
          foreground: "#FFFFF9",
        },
        muted: {
          DEFAULT: "#F5F5F0", // Derivado del blanco crema
          foreground: "#4C0000",
        },
        popover: {
          DEFAULT: "#FFFFF9", // Blanco crema
          foreground: "#4C0000",
        },
        card: {
          DEFAULT: "#FFFFF9", // Blanco crema
          foreground: "#4C0000",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
