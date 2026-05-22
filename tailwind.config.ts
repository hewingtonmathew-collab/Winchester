import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkest: "#0B1118",
          dark: "#111A23",
          card: "#1B2430",
          border: "#2A3340",
          muted: "#A7B1BE",
          light: "#E6E9ED",
          white: "#FFFFFF",
          gold: "#C9A84C",
        },
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-overlay":
          "linear-gradient(135deg, rgba(11,17,24,0.95) 0%, rgba(17,26,35,0.80) 60%, rgba(11,17,24,0.70) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-slow": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
        "float": { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        "glow-pulse": { "0%, 100%": { boxShadow: "0 0 0 rgba(201,168,76,0)" }, "50%": { boxShadow: "0 0 24px rgba(201,168,76,0.20)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.95)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "slide-down": { "0%": { opacity: "0", transform: "translateY(-12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "float": "float 7s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "scale-in": "scale-in 0.45s ease-out forwards",
        "slide-down": "slide-down 0.4s ease-out forwards",
      },
      boxShadow: {
        "card-lift": "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
        "gold-glow": "0 0 24px rgba(201,168,76,0.18), 0 0 8px rgba(201,168,76,0.10)",
        "inner-subtle": "inset 0 1px 0 rgba(255,255,255,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
