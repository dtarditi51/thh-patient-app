import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        thh: {
          red: "#C8102E",
          "red-dark": "#8B0A1F",
          "red-50": "#FFE8EC",
          "red-100": "#FFD0D8",
          ink: "#1A1A1A",
          muted: "#6B6B6B",
          surface: "#F7F7F5",
          line: "#E8E8E4"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px"
      }
    }
  },
  plugins: []
};

export default config;
