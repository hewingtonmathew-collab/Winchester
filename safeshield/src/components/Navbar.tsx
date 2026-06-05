"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, Sun, Moon, LayoutDashboard, LogOut, User, ChevronDown, Building2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getTheme, setTheme, applyTheme, type Theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { ALL_TOOLS } from "@/lib/supabase";

const NAV_LINKS = [
  { label: "Dashboard", href: "/" },
];

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { user, profile, enabledTools, isOrgAdmin, signOut } = useAuth();
  const [theme, setThemeState] = useState<Theme>("dark");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyTheme();
    setThemeState(getTheme());
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  // Build visible tool links based on permissions
  const isAdmin = profile?.role === "admin" || enabledTools.includes("*");
  const toolLinks = ALL_TOOLS.filter(t =>
    isAdmin || enabledTools.includes("*") || enabledTools.includes(t.slug)
  ).map(t => ({ label: t.name.replace(" Checker", "").replace(" Assessment", "").replace(" Wizard", ""), href: `/tools/${t.slug}` }));

  const allLinks = [...NAV_LINKS, ...toolLinks];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0 mr-1">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(56,189,248,0.15)] border border-[rgba(56,189,248,0.3)]">
            <Shield size={14} className="text-[#38BDF8]" />
          </span>
          <span className="font-semibold text-sm tracking-wide" style={{ color: "var(--text)" }}>SafeShield</span>
        </Link>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
          {allLinks.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  active
                    ? "bg-[rgba(56,189,248,0.15)] text-[#38BDF8] border border-[rgba(56,189,248,0.25)]"
                    : "hover:bg-white/5"
                }`}
                style={{ color: active ? "#38BDF8" : "var(--text-dim)" }}>
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            {theme === "dark" ? <Sun size={14} style={{ color: "var(--text-dim)" }} /> : <Moon size={14} style={{ color: "var(--text-dim)" }} />}
          </button>

          {(isAdmin || isOrgAdmin) && (
            <Link href="/org"
              className={`w-8 h-8 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all ${path.startsWith("/org") ? "border border-[rgba(56,189,248,0.3)]" : ""}`}
              title="Organisations">
              <Building2 size={14} style={{ color: path.startsWith("/org") ? "#38BDF8" : "var(--text-dim)" }} />
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin"
              className={`w-8 h-8 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all ${path.startsWith("/admin") ? "border border-[rgba(56,189,248,0.3)]" : ""}`}
              title="Admin Panel">
              <LayoutDashboard size={14} style={{ color: path.startsWith("/admin") ? "#38BDF8" : "var(--text-dim)" }} />
            </Link>
          )}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass hover:bg-white/10 transition-all">
                <div className="w-5 h-5 rounded-full bg-[rgba(56,189,248,0.2)] flex items-center justify-center">
                  <User size={10} className="text-[#38BDF8]" />
                </div>
                <span className="text-xs max-w-[80px] truncate" style={{ color: "var(--text-dim)" }}>
                  {profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0]}
                </span>
                <ChevronDown size={10} style={{ color: "var(--text-dim)" }} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 shadow-xl z-50"
                  style={{ background: "var(--glass-bg)", backdropFilter: "blur(20px)" }}>
                  <div className="px-3 py-2.5 border-b border-white/5">
                    <p className="text-xs font-medium text-white truncate">{profile?.full_name ?? "User"}</p>
                    <p className="text-[0.65rem] text-[#475569] truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 text-[0.6rem] px-1.5 py-0.5 rounded-full bg-[rgba(56,189,248,0.15)] text-[#38BDF8] font-medium">Admin</span>
                    )}
                  </div>
                  <div className="p-1">
                    <Link href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-white/5 transition-all"
                      style={{ color: "var(--text-dim)" }}>
                      <User size={12} /> My Profile & Reports
                    </Link>
                    <button onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all">
                      <LogOut size={12} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login"
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38BDF8" }}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
