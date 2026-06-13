"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, Sun, Moon, LayoutDashboard, LogOut, User, ChevronDown, Building2, Camera, Menu, X, Wrench, Gauge } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getTheme, setTheme, applyTheme, type Theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { ALL_TOOLS } from "@/lib/supabase";
import { useToolIcon } from "@/components/ui/useToolIcon";

const NAV_LINKS = [{ label: "Dashboard", href: "/" }];

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { user, profile, enabledTools, isOrgAdmin, signOut } = useAuth();
  const [theme, setThemeState] = useState<Theme>("dark");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = profile?.role === "admin" || enabledTools.includes("*");
  const { iconUrl: logoUrl, saveIcon: saveLogo, clearIcon: clearLogo } = useToolIcon("safeshield-logo");

  useEffect(() => { applyTheme(); setThemeState(getTheme()); }, []);
  useEffect(() => { setMobileOpen(false); }, [path]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target as Node)) {
        setToolsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next); setThemeState(next);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

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

  const toolLinks = useMemo(() =>
    ALL_TOOLS.filter(t => isAdmin || enabledTools.includes(t.slug))
      .map(t => ({ label: t.name.replace(" Checker", "").replace(" Assessment", "").replace(" Wizard", ""), href: `/tools/${t.slug}` })),
    [isAdmin, enabledTools]
  );

  const allLinks = useMemo(
    () => [...NAV_LINKS, ...(user ? [{ label: "Command Centre", href: "/command-centre" }] : []), ...toolLinks],
    [toolLinks, user]
  );

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-[999] glass"
        style={{ borderBottom: "1px solid var(--glass-border)", paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2">

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0 mr-1">
            <div className="relative">
              <button
                onClick={() => isAdmin && logoInputRef.current?.click()}
                className={`w-8 h-8 rounded-xl flex items-center justify-center border border-[rgba(56,189,248,0.35)] overflow-hidden relative ${logoUrl ? "" : "bg-[rgba(56,189,248,0.15)]"}`}
                style={{ cursor: isAdmin ? "pointer" : "default" }}
                title={isAdmin ? "Upload logo" : undefined}>
                {logoUrl
                  ? <img src={logoUrl} alt="logo" className="w-full h-full object-contain" loading="lazy" decoding="async" />
                  : <Shield size={17} className="text-[#38BDF8]" strokeWidth={1.8} />}
                {/* Camera badge for admin */}
                {isAdmin && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(56,189,248,0.95)" }}>
                    <Camera size={7} color="#fff" />
                  </span>
                )}
              </button>
              {/* Remove custom logo */}
              {isAdmin && logoUrl && (
                <button
                  onClick={() => clearLogo()}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white z-10"
                  style={{ background: "rgba(239,68,68,0.9)", fontSize: 8 }}>✕</button>
              )}
            </div>
            <Link href="/" className="heading-luxury text-sm tracking-tight hidden sm:block" style={{ color: "var(--text)" }}>
              SafeShield
            </Link>
            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
          </div>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {/* Dashboard */}
            <Link href="/"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                path === "/" ? "bg-[rgba(56,189,248,0.15)] border border-[rgba(56,189,248,0.25)]" : "hover:bg-white/5"
              }`}
              style={{ color: path === "/" ? "#38BDF8" : "var(--text-dim)" }}>
              Dashboard
            </Link>

            {/* Command Centre */}
            {user && (
              <Link href="/command-centre"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  path.startsWith("/command-centre") ? "bg-[rgba(56,189,248,0.15)] border border-[rgba(56,189,248,0.25)]" : "hover:bg-white/5"
                }`}
                style={{ color: path.startsWith("/command-centre") ? "#38BDF8" : "var(--text-dim)" }}>
                <Gauge size={11} />
                Command Centre
              </Link>
            )}

            {/* Tools dropdown */}
            {toolLinks.length > 0 && (
              <div className="relative" ref={toolsMenuRef}>
                <button
                  onClick={() => setToolsMenuOpen(o => !o)}
                  aria-expanded={toolsMenuOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                    toolLinks.some(l => path.startsWith(l.href))
                      ? "bg-[rgba(56,189,248,0.15)] border border-[rgba(56,189,248,0.25)]"
                      : "hover:bg-white/5"
                  }`}
                  style={{ color: toolLinks.some(l => path.startsWith(l.href)) ? "#38BDF8" : "var(--text-dim)" }}>
                  <Wrench size={11} />
                  Tools
                  <ChevronDown size={10} className={`transition-transform duration-150 ${toolsMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {toolsMenuOpen && (
                  <div
                    className="absolute left-0 top-full mt-1 rounded-2xl overflow-hidden z-[9999] min-w-[200px]"
                    style={{
                      background: "var(--bg2)",
                      border: "1px solid var(--glass-border)",
                      backdropFilter: "blur(16px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}>
                    <div className="p-1.5 flex flex-col gap-0.5">
                      {toolLinks.map((l) => {
                        const active = path.startsWith(l.href);
                        return (
                          <Link key={l.href} href={l.href}
                            onClick={() => setToolsMenuOpen(false)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                              active ? "bg-[rgba(56,189,248,0.12)]" : "hover:bg-white/5"
                            }`}
                            style={{ color: active ? "#38BDF8" : "var(--text-muted)" }}>
                            {l.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Spacer on mobile */}
          <div className="flex-1 md:hidden" />

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
              title={theme === "dark" ? "Light mode" : "Dark mode"}>
              {theme === "dark"
                ? <Sun size={14} style={{ color: "var(--text-muted)" }} />
                : <Moon size={14} style={{ color: "var(--text-muted)" }} />}
            </button>

            {(isAdmin || isOrgAdmin) && (
              <Link href="/org" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all hidden sm:flex" title="Organisations">
                <Building2 size={14} style={{ color: path.startsWith("/org") ? "var(--accent)" : "var(--text-dim)" }} />
              </Link>
            )}

            {isAdmin && (
              <Link href="/admin" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all hidden sm:flex" title="Admin Panel">
                <LayoutDashboard size={14} style={{ color: path.startsWith("/admin") ? "var(--accent)" : "var(--text-dim)" }} />
              </Link>
            )}

            {user ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-all">
                  <div className="w-6 h-6 rounded-full bg-[rgba(56,189,248,0.2)] flex items-center justify-center shrink-0">
                    <User size={11} className="text-[#38BDF8]" />
                  </div>
                  <span className="text-xs max-w-[60px] truncate hidden sm:block" style={{ color: "var(--text-muted)" }}>
                    {profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0]}
                  </span>
                  <ChevronDown size={10} style={{ color: "var(--text-dim)" }} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-[9999]"
                    style={{
                      background: "var(--bg2)",
                      border: "1px solid var(--glass-border)",
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
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-white/5"
                        style={{ color: "var(--text-muted)" }}>
                        <User size={12} /> My Profile & Reports
                      </Link>
                      {(isAdmin || isOrgAdmin) && (
                        <Link href="/org" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-white/5 sm:hidden"
                          style={{ color: "var(--text-muted)" }}>
                          <Building2 size={12} /> Organisations
                        </Link>
                      )}
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-white/5 sm:hidden"
                          style={{ color: "var(--text-muted)" }}>
                          <LayoutDashboard size={12} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleSignOut}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full text-left">
                        <LogOut size={12} /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38BDF8" }}>
                Sign in
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
              aria-label="Menu">
              {mobileOpen ? <X size={16} style={{ color: "var(--text-dim)" }} /> : <Menu size={16} style={{ color: "var(--text-dim)" }} />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t" style={{ borderColor: "var(--glass-border)", background: "var(--glass-bg)", backdropFilter: "blur(20px)" }}>
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {allLinks.map((l) => {
                const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
                return (
                  <Link key={l.href} href={l.href}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active ? "bg-[rgba(56,189,248,0.15)] border border-[rgba(56,189,248,0.25)]" : "hover:bg-white/5"
                    }`}
                    style={{ color: active ? "#38BDF8" : "var(--text-dim)" }}>
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
