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

  const isAdmin = profile?.role === "admin" || enabledTools.includes("*");
  const toolLinks = ALL_TOOLS.filter(t =>
    isAdmin || enabledTools.includes("*") || enabledTools.includes(t.slug)
  ).map(t => ({ label: t.name.replace(" Checker", "").replace(" Assessment", "").replace(" Wizard", ""), href: `/tools/${t.slug}` }));

  const allLinks = [...NAV_LINKS, ...toolLinks];

  return (
    /* z-[999] ensures nav stays above all page content including glass cards with stacking contexts */
    <nav className="fixed top-0 inset-x-0 z-[999] glass" style={{ borderBottom: "1px solid var(--glass-border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-2">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-[rgba(56,189,248,0.15)] border border-[rgba(56,189,248,0.35)]">
            <Shield size={20} className="text-[#38BDF8]" strokeWidth={1.8} />
          </span>
          <span className="heading-luxury text-base tracking-tight" style={{ color: "var(--text)" }}>SafeShield</span>
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
            className="glass-btn w-8 h-8 flex items-center justify-center"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            {theme === "dark"
              ? <Sun size={14} style={{ color: "var(--text-muted)" }} />
              : <Moon size={14} style={{ color: "var(--text-muted)" }} />}
          </button>

          {(isAdmin || isOrgAdmin) && (
            <Link href="/org" className="glass-btn w-8 h-8 flex items-center justify-center" title="Organisations">
              <Building2 size={14} style={{ color: path.startsWith("/org") ? "var(--accent)" : "var(--text-dim)" }} />
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin" className="glass-btn w-8 h-8 flex items-center justify-center" title="Admin Panel">
              <LayoutDashboard size={14} style={{ color: path.startsWith("/admin") ? "var(--accent)" : "var(--text-dim)" }} />
            </Link>
          )}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-btn">
                <div className="w-5 h-5 rounded-full bg-[rgba(56,189,248,0.2)] flex items-center justify-center shrink-0">
                  <User size={10} className="text-[#38BDF8]" />
                </div>
                <span className="text-xs max-w-[80px] truncate" style={{ color: "var(--text-muted)" }}>
                  {profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0]}
                </span>
                <ChevronDown size={10} style={{ color: "var(--text-dim)" }} />
              </button>

              {userMenuOpen && (
                /* Fixed position so it escapes any parent stacking context */
                <div
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-[9999]"
                  style={{
                    background: "var(--bg2)",
                    border: "1px solid var(--glass-border)",
                    borderTopColor: "var(--glass-border-top)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}>
                  <div className="px-3 py-3 border-b" style={{ borderColor: "var(--glass-border)" }}>
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>{profile?.full_name ?? "User"}</p>
                    <p className="text-[0.65rem] truncate mt-0.5" style={{ color: "var(--text-dim)" }}>{user.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1.5 text-[0.6rem] px-2 py-0.5 rounded-full bg-[rgba(56,189,248,0.15)] text-[#38BDF8] font-semibold border border-[rgba(56,189,248,0.25)]">Super Admin</span>
                    )}
                  </div>
                  <div className="p-1.5 flex flex-col gap-0.5">
                    <Link href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-white/5"
                      style={{ color: "var(--text-muted)" }}>
                      <User size={12} /> My Profile & Reports
                    </Link>
                    <button onClick={handleSignOut}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full text-left">
                      <LogOut size={12} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login"
              className="glass-btn px-3 py-1.5 text-xs font-medium"
              style={{ color: "var(--accent)" }}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
