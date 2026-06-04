"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Sun, Moon, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { getTheme, setTheme, applyTheme, type Theme } from "@/lib/theme";

const links = [
  { label: "Dashboard", href: "/" },
  { label: "AI Detector", href: "/tools/ai-detector" },
  { label: "Safeguarding", href: "/tools/safeguarding" },
  { label: "Governance", href: "/tools/governance" },
  { label: "AI Readiness", href: "/tools/ai-readiness" },
  { label: "DPIA Wizard", href: "/tools/dpia" },
  { label: "Accessibility", href: "/tools/accessibility" },
  { label: "Ofsted Ready", href: "/tools/ofsted" },
];

export default function Navbar() {
  const path = usePathname();
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    applyTheme();
    setThemeState(getTheme());
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

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
          {links.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  active
                    ? "bg-[rgba(56,189,248,0.15)] text-[#38BDF8] border border-[rgba(56,189,248,0.25)]"
                    : "hover:bg-white/5"
                }`}
                style={{ color: active ? "#38BDF8" : "var(--text-dim)" }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={14} style={{ color: "var(--text-dim)" }} /> : <Moon size={14} style={{ color: "var(--text-dim)" }} />}
          </button>
          <Link href="/admin"
            className={`w-8 h-8 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all ${path.startsWith("/admin") ? "border-[rgba(56,189,248,0.3)] text-[#38BDF8]" : ""}`}
            title="Admin Panel"
          >
            <LayoutDashboard size={14} style={{ color: path.startsWith("/admin") ? "#38BDF8" : "var(--text-dim)" }} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
