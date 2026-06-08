"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, Sun, Moon, LayoutDashboard, LogOut, User, ChevronDown, Building2, Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getTheme, setTheme, applyTheme, type Theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { ALL_TOOLS } from "@/lib/supabase";
import { useToolIcon } from "@/hooks/useToolIcon";

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
  const { iconUrl: logoUrl, saveIcon: saveLogo, clearIcon: clearLogo } = useToolIcon("safeshield-logo");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoHovered, setLogoHovered] = useState(false);

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) { alert("Image must be under 2 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => saveLogo(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  // Build visible tool links based on permissions
  const toolLinks = ALL_TOOLS.filter(t =>
    isAdmin || enabledTools.includes("*") || enabledTools.includes(t.slug)
  ).map(t => ({ label: t.name.replace(" Checker", "").replace(" Assessment", "").replace(" Wizard", ""), href: `/tools/${t.slug}` }));

  const allLinks = [...NAV_LINKS, ...toolLinks];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass" style={{ borderBottom: "1px solid var(--liquid-border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0 mr-1">
          <div
            className="relative w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(56,189,248,0.15)] border border-[rgba(56,189,248,0.3)] overflow-visible"
            onMouseEnter={() => isAdmin && setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}>
            {logoUrl
              ? <img src={logoUrl} alt="SafeShield logo" className="w-5 h-5 object-contain rounded" />
              : <Shield size={14} className="text-[#38BDF8]" />}
            {isAdmin && logoHovered && (
              <div
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); logoInputRef.current?.click(); }}
                className="absolute inset-0 rounded-lg flex items-center justify-center cursor-pointer z-10"
                style={{ background: "rgba(0,0,0,0.6)" }}>
                <Camera size={10} color="#fff" />
              </div>
            )}
            {isAdmin && logoUrl && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearLogo(); }}
                title="Remove custom logo"
                className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center z-20"
                style={{ background: "rgba(239,68,68,0.9)" }}>
                <span style={{ color: "#fff", fontSize: 8, lineHeight: 1 }}>✕</span>
              </button>
            )}
          </div>
          <Link href="/">
            <span className="font-semibold text-sm tracking-wide" style={{ color: "var(--text)" }}>SafeShield</span>
          </Link>
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
        </div>

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
            className="glass-btn w-9 h-9 flex items-center justify-center"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            {theme === "dark" ? <Sun size={14} style={{ color: "var(--text-muted)" }} /> : <Moon size={14} style={{ color: "var(--text-muted)" }} />}
          </button>

          {(isAdmin || isOrgAdmin) && (
            <Link href="/org" className="glass-btn w-9 h-9 flex items-center justify-center" title="Organisations" aria-label="Organisations">
              <Building2 size={14} style={{ color: path.startsWith("/org") ? "var(--accent)" : "var(--text-muted)" }} />
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin" className="glass-btn w-9 h-9 flex items-center justify-center" title="Admin Panel" aria-label="Admin panel">
              <LayoutDashboard size={14} style={{ color: path.startsWith("/admin") ? "var(--accent)" : "var(--text-muted)" }} />
            </Link>
          )}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="Open user menu"
                aria-expanded={userMenuOpen}
                className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-lg glass hover:bg-white/10 transition-all">
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
                    <p className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>{profile?.full_name ?? "User"}</p>
                    <p className="text-[0.65rem] truncate" style={{ color: "var(--text-muted)" }}>{user.email}</p>
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
