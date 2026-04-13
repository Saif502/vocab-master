/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sunset: "#f97316",
        mint: "#10b981",
        sky: "#0ea5e9"
      },
      boxShadow: {
        soft: "0 12px 30px -12px rgba(2, 6, 23, 0.28)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(249, 115, 22, 0.35)" },
          "50%": { boxShadow: "0 0 0 10px rgba(249, 115, 22, 0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 500ms ease-out both",
        "pulse-glow": "pulseGlow 1500ms ease-in-out infinite"
      }
    }
  },
  plugins: []
};

