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
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
