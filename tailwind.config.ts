import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0F172A",
        emerald: { DEFAULT: "#10B981", dark: "#047857" },
        paper: "#FAF6EE",
        paperLine: "#E4DCC8",
        inkSoft: "#4B5266",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
