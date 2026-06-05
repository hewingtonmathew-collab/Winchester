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
      setEnabledTools(tools?.map((t: { tool_slug: string }) => t.tool_slug) ?? []);
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
