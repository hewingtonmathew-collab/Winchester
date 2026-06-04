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
        glass: {
          bg: "rgba(255,255,255,0.04)",
          border: "rgba(255,255,255,0.08)",
          hover: "rgba(255,255,255,0.07)",
        },
        accent: {
          DEFAULT: "#38BDF8",
          glow: "rgba(56,189,248,0.25)",
          dim: "rgba(56,189,248,0.12)",
        },
        surface: {
          DEFAULT: "#020610",
          raised: "#060D1A",
        },
      },
      backdropBlur: {
        glass: "12px",
      },
      boxShadow: {
        glass: "0 4px 24px 0 rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-hover": "0 8px 32px 0 rgba(0,0,0,0.6), 0 0 0 1px rgba(56,189,248,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
        glow: "0 0 32px rgba(56,189,248,0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
