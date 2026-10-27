import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090C",
        surface: "#0E1117",
        panel: "#141820",
        panelBorder: "rgba(255, 255, 255, 0.08)",
        survival: {
          light: "#34D399",
          DEFAULT: "#10B981",
          dark: "#059669",
          muted: "rgba(16, 185, 129, 0.15)",
        },
        mystic: {
          light: "#A78BFA",
          DEFAULT: "#8B5CF6",
          dark: "#6D28D9",
          muted: "rgba(139, 92, 246, 0.15)",
        },
        danger: {
          light: "#F87171",
          DEFAULT: "#EF4444",
          dark: "#B91C1C",
          muted: "rgba(239, 68, 68, 0.15)",
        },
        hazard: {
          light: "#FBBF24",
          DEFAULT: "#F59E0B",
          dark: "#D97706",
          muted: "rgba(245, 158, 11, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        radarPulse: {
          "0%": { transform: "scale(0.95)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "0.4" },
          "100%": { transform: "scale(0.95)", opacity: "0.8" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        radarPulse: "radarPulse 3s ease-in-out infinite",
        glitch: "glitch 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
