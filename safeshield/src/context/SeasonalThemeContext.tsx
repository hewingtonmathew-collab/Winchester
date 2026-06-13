"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { SEASONAL_THEMES, type SeasonalTheme, type SeasonalThemeSlug, type ThemeAssignment } from "@/lib/seasonalThemes";
import { useAuth } from "@/context/AuthContext";

type SeasonalThemeContextValue = {
  activeTheme: SeasonalTheme;
  assignment: ThemeAssignment | null;
  // For super admin panel
  allAssignments: ThemeAssignment[];
  saveAssignment: (params: {
    themeSlug: SeasonalThemeSlug;
    targetType: "org" | "school" | "user";
    targetId: string;
    bannerUrl?: string | null;
  }) => Promise<void>;
  removeAssignment: (id: string) => Promise<void>;
  uploadBanner: (file: File, assignmentId: string) => Promise<string>;
  refresh: () => void;
};

const Ctx = createContext<SeasonalThemeContextValue | null>(null);

export function useSeasonalTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSeasonalTheme must be used within SeasonalThemeProvider");
  return ctx;
}

export function SeasonalThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, enabledTools } = useAuth();
  const isSuperAdmin = enabledTools.includes("*");
  const [assignment, setAssignment] = useState<ThemeAssignment | null>(null);
  const [allAssignments, setAllAssignments] = useState<ThemeAssignment[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  // Resolve which theme applies to this user (user > school > org priority)
  useEffect(() => {
    if (!user) { setAssignment(null); return; }
    (async () => {
      // Get user's membership
      const { data: membership } = await supabase
        .from("org_members").select("org_id, school_id")
        .eq("user_id", user.id).limit(1).maybeSingle();
      const m = membership as { org_id: string | null; school_id: string | null } | null;

      // Build list of IDs to check in priority order: user, school, org
      const checks: { target_type: string; target_id: string }[] = [
        { target_type: "user", target_id: user.id },
        ...(m?.school_id ? [{ target_type: "school", target_id: m.school_id }] : []),
        ...(m?.org_id ? [{ target_type: "org", target_id: m.org_id }] : []),
      ];

      let found: ThemeAssignment | null = null;
      for (const check of checks) {
        const { data } = await supabase
          .from("theme_assignments")
          .select("*")
          .eq("target_type", check.target_type)
          .eq("target_id", check.target_id)
          .limit(1)
          .maybeSingle();
        if (data) { found = data as ThemeAssignment; break; }
      }
      setAssignment(found);
    })();
  }, [user, refreshKey]);

  // Load all assignments for super admin panel
  useEffect(() => {
    if (!isSuperAdmin) return;
    supabase.from("theme_assignments").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setAllAssignments((data as ThemeAssignment[]) ?? []));
  }, [isSuperAdmin, refreshKey]);

  // Apply CSS variable overrides when assignment changes
  useEffect(() => {
    const slug = (assignment?.theme_slug ?? "default") as SeasonalThemeSlug;
    const theme = SEASONAL_THEMES[slug] ?? SEASONAL_THEMES.default;
    const root = document.documentElement;
    // Remove any previously applied theme vars
    for (const slug of Object.keys(SEASONAL_THEMES) as SeasonalThemeSlug[]) {
      for (const key of Object.keys(SEASONAL_THEMES[slug].cssVars)) {
        root.style.removeProperty(key);
      }
    }
    // Apply new vars
    for (const [key, val] of Object.entries(theme.cssVars)) {
      root.style.setProperty(key, val);
    }
  }, [assignment]);

  const activeTheme = SEASONAL_THEMES[(assignment?.theme_slug ?? "default") as SeasonalThemeSlug] ?? SEASONAL_THEMES.default;

  async function saveAssignment({ themeSlug, targetType, targetId, bannerUrl }: {
    themeSlug: SeasonalThemeSlug;
    targetType: "org" | "school" | "user";
    targetId: string;
    bannerUrl?: string | null;
  }) {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id ?? null;
    const { error } = await supabase.from("theme_assignments").upsert({
      theme_slug: themeSlug,
      target_type: targetType,
      target_id: targetId,
      banner_url: bannerUrl ?? null,
      assigned_by: userId,
    }, { onConflict: "target_type,target_id" });
    if (error) throw error;
    refresh();
  }

  async function removeAssignment(id: string) {
    const { error } = await supabase.from("theme_assignments").delete().eq("id", id);
    if (error) throw error;
    refresh();
  }

  async function uploadBanner(file: File, assignmentId: string): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `theme-banners/${assignmentId}.${ext}`;
    const { error } = await supabase.storage.from("theme-assets").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("theme-assets").getPublicUrl(path);
    return data.publicUrl;
  }

  return (
    <Ctx.Provider value={{ activeTheme, assignment, allAssignments, saveAssignment, removeAssignment, uploadBanner, refresh }}>
      {children}
    </Ctx.Provider>
  );
}
