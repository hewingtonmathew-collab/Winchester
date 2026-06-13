// ── Seasonal theme definitions ────────────────────────────────────────────────
// Each theme overrides CSS variables and supplies a palette for the
// SeasonalBanner component. Super admin applies themes via theme_assignments.

export type SeasonalThemeSlug =
  | "christmas"
  | "halloween"
  | "easter"
  | "summer"
  | "new-year"
  | "default";

export type SeasonalTheme = {
  slug: SeasonalThemeSlug;
  label: string;
  emoji: string;
  description: string;
  // CSS variable overrides applied to :root when theme is active
  cssVars: Record<string, string>;
  // Banner visual config
  banner: {
    gradient: string;          // CSS gradient for banner background
    accentColor: string;       // primary accent for text highlights
    accentAlt: string;         // secondary accent
    textColor: string;         // banner heading text colour
    particleEmoji: string;     // falling particle emoji
    particleCount: number;
  };
};

export const SEASONAL_THEMES: Record<SeasonalThemeSlug, SeasonalTheme> = {
  christmas: {
    slug: "christmas",
    label: "Christmas",
    emoji: "🎄",
    description: "Festive red and gold for the Christmas season.",
    cssVars: {
      "--accent":       "#E8334A",
      "--accent-2":     "#C8973A",
      "--accent-3":     "#2D7A3A",
      "--accent-glow":  "rgba(232,51,74,0.45)",
      "--orb1":         "rgba(232,51,74,0.10)",
      "--orb2":         "rgba(200,151,58,0.08)",
      "--orb3":         "rgba(45,122,58,0.07)",
    },
    banner: {
      gradient: "linear-gradient(135deg, #1a0a0a 0%, #2d0b0b 40%, #1a2e0a 100%)",
      accentColor: "#E8334A",
      accentAlt: "#C8973A",
      textColor: "#FFF5F5",
      particleEmoji: "❄️",
      particleCount: 20,
    },
  },

  halloween: {
    slug: "halloween",
    label: "Halloween",
    emoji: "🎃",
    description: "Spooky orange and purple for Halloween.",
    cssVars: {
      "--accent":       "#F97316",
      "--accent-2":     "#A855F7",
      "--accent-3":     "#6B21A8",
      "--accent-glow":  "rgba(249,115,22,0.45)",
      "--orb1":         "rgba(249,115,22,0.10)",
      "--orb2":         "rgba(168,85,247,0.09)",
      "--orb3":         "rgba(107,33,168,0.07)",
    },
    banner: {
      gradient: "linear-gradient(135deg, #0d0010 0%, #1a0a00 50%, #120020 100%)",
      accentColor: "#F97316",
      accentAlt: "#A855F7",
      textColor: "#FFF0E0",
      particleEmoji: "🦇",
      particleCount: 12,
    },
  },

  easter: {
    slug: "easter",
    label: "Easter",
    emoji: "🐣",
    description: "Soft pastels and spring colours for Easter.",
    cssVars: {
      "--accent":       "#34D399",
      "--accent-2":     "#FBBF24",
      "--accent-3":     "#F472B6",
      "--accent-glow":  "rgba(52,211,153,0.40)",
      "--orb1":         "rgba(52,211,153,0.10)",
      "--orb2":         "rgba(251,191,36,0.08)",
      "--orb3":         "rgba(244,114,182,0.07)",
    },
    banner: {
      gradient: "linear-gradient(135deg, #0a1a0e 0%, #0e1a0a 50%, #1a0a12 100%)",
      accentColor: "#34D399",
      accentAlt: "#FBBF24",
      textColor: "#F0FFF8",
      particleEmoji: "🌸",
      particleCount: 18,
    },
  },

  summer: {
    slug: "summer",
    label: "Summer",
    emoji: "☀️",
    description: "Warm amber and sky blue for the summer holidays.",
    cssVars: {
      "--accent":       "#FBBF24",
      "--accent-2":     "#38BDF8",
      "--accent-3":     "#FB923C",
      "--accent-glow":  "rgba(251,191,36,0.45)",
      "--orb1":         "rgba(251,191,36,0.10)",
      "--orb2":         "rgba(56,189,248,0.09)",
      "--orb3":         "rgba(251,146,60,0.07)",
    },
    banner: {
      gradient: "linear-gradient(135deg, #1a1200 0%, #0a1a1a 60%, #1a0a00 100%)",
      accentColor: "#FBBF24",
      accentAlt: "#38BDF8",
      textColor: "#FFFAF0",
      particleEmoji: "🌟",
      particleCount: 15,
    },
  },

  "new-year": {
    slug: "new-year",
    label: "New Year",
    emoji: "🎆",
    description: "Midnight gold and silver for the New Year celebration.",
    cssVars: {
      "--accent":       "#EAB308",
      "--accent-2":     "#C0C0C0",
      "--accent-3":     "#60A5FA",
      "--accent-glow":  "rgba(234,179,8,0.50)",
      "--orb1":         "rgba(234,179,8,0.10)",
      "--orb2":         "rgba(192,192,192,0.08)",
      "--orb3":         "rgba(96,165,250,0.07)",
    },
    banner: {
      gradient: "linear-gradient(135deg, #05050f 0%, #0a0a20 50%, #050510 100%)",
      accentColor: "#EAB308",
      accentAlt: "#C0C0C0",
      textColor: "#FFFFF0",
      particleEmoji: "✨",
      particleCount: 25,
    },
  },

  default: {
    slug: "default",
    label: "Default",
    emoji: "🛡️",
    description: "SafeShield default theme.",
    cssVars: {},
    banner: {
      gradient: "linear-gradient(135deg, #07090F 0%, #0A0D1C 100%)",
      accentColor: "#38BDF8",
      accentAlt: "#818CF8",
      textColor: "#F0F4FF",
      particleEmoji: "",
      particleCount: 0,
    },
  },
};

export type ThemeAssignment = {
  id: string;
  theme_slug: SeasonalThemeSlug;
  target_type: "org" | "school" | "user";
  target_id: string;
  banner_url: string | null;
  assigned_by: string | null;
  created_at: string;
};
