"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, type Profile } from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  enabledTools: string[];
  isOrgAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  enabledTools: [],
  isOrgAdmin: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enabledTools, setEnabledTools] = useState<string[]>([]);
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string, appMeta?: Record<string, unknown>) {
    const { data: prof, error: profError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profError) console.error("[AuthContext] profile fetch error:", profError);
    console.log("[AuthContext] profile:", prof, "appMeta:", appMeta);
    setProfile(prof);

    if (!prof) return;

    // Use JWT app_metadata for admin check — no circular DB query
    const isAdmin = appMeta?.role === "admin" || prof.role === "admin";

    if (isAdmin) {
      setEnabledTools(["*"]);
    } else if (prof.status === "active") {
      const { data: tools } = await supabase
        .from("user_tools")
        .select("tool_slug")
        .eq("user_id", userId)
        .eq("enabled", true);
      const userEnabled = tools?.map((t: { tool_slug: string }) => t.tool_slug) ?? [];

      // Effective tools = user_tools AND org entitlement AND school entitlement.
      // Defensive: if any org/school query fails, fall back to userEnabled so
      // existing users are never broken.
      try {
        const { data: membership } = await supabase
          .from("org_members")
          .select("org_id, school_id")
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle();

        if (!membership) {
          // No org membership — nothing to intersect against.
          setEnabledTools(userEnabled);
        } else {
          const { org_id, school_id } = membership as { org_id: string | null; school_id: string | null };

          // If the org or school is disabled, the user loses all access.
          let disabled = false;
          if (org_id) {
            const { data: orgRow } = await supabase
              .from("organisations").select("status").eq("id", org_id).maybeSingle();
            if (orgRow?.status === "disabled") disabled = true;
          }
          if (!disabled && school_id) {
            const { data: schoolRow } = await supabase
              .from("schools").select("status").eq("id", school_id).maybeSingle();
            if (schoolRow?.status === "disabled") disabled = true;
          }

          if (disabled) {
            setEnabledTools([]);
          } else {
            // org_tools: if no rows configured, no org restriction.
            const orgAllows = (slug: string, rows: { tool_slug: string; enabled: boolean }[] | null) => {
              if (!rows || rows.length === 0) return true;
              const row = rows.find((r) => r.tool_slug === slug);
              return row ? row.enabled : false;
            };

            const [orgToolsRes, schoolToolsRes] = await Promise.all([
              org_id
                ? supabase.from("org_tools").select("tool_slug, enabled").eq("org_id", org_id)
                : Promise.resolve({ data: null }),
              school_id
                ? supabase.from("school_tools").select("tool_slug, enabled").eq("school_id", school_id)
                : Promise.resolve({ data: null }),
            ]);

            const orgRows = (orgToolsRes.data ?? null) as { tool_slug: string; enabled: boolean }[] | null;
            const schoolRows = (schoolToolsRes.data ?? null) as { tool_slug: string; enabled: boolean }[] | null;

            setEnabledTools(
              userEnabled.filter((slug) => orgAllows(slug, orgRows) && orgAllows(slug, schoolRows))
            );
          }
        }
      } catch (err) {
        console.error("[AuthContext] org/school entitlement calc failed, falling back to user_tools:", err);
        setEnabledTools(userEnabled);
      }
    } else {
      setEnabledTools([]);
    }

    // Check if user is an org admin
    const { data: orgAdminRows } = await supabase
      .from("org_members")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .limit(1);
    setIsOrgAdmin((orgAdminRows?.length ?? 0) > 0);
  }

  async function refreshProfile() {
    if (user) await loadProfile(user.id, user.app_metadata);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id, session.user.app_metadata).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id, session.user.app_metadata);
      } else {
        setProfile(null);
        setEnabledTools([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    setEnabledTools([]);
    setIsOrgAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, enabledTools, isOrgAdmin, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
