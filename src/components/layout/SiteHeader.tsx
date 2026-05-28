"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, ctaPrimary } from "@/data/nav";

type NavGroup = (typeof mainNav)[number];

/* ─── Desktop dropdown ───────────────────────────────────────────────────── */
function DesktopDropdown({ group, isActive }: { group: NavGroup; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasChildren = Boolean(group.children?.length);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  const linkClass = cn(
    "relative flex items-center px-3.5 py-2 font-sans text-sm font-medium rounded-full",
    "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/75",
    "min-h-[36px]",
    isActive
      ? "text-primary bg-white/[0.06] text-glow-sm"
      : "text-on-surface-variant/80 hover:text-on-surface hover:bg-white/[0.05]"
  );

  if (!hasChildren) {
    return (
      <Link href={group.href} className={linkClass}>
        {group.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative h-full flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((v) => !v); }
        }}
        className={cn(linkClass, "gap-1.5")}
      >
        {group.label}
        <ChevronDown
          size={13}
          className={cn(
            "transition-transform duration-200 motion-reduce:transition-none opacity-60",
            open ? "rotate-180" : "rotate-0"
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown panel */}
      <div
        role="menu"
        aria-label={group.label}
        className={cn(
          "absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 min-w-[260px] rounded-xl",
          "glass-panel border border-outline-variant/50",
          "transition-all duration-200 motion-reduce:transition-none origin-top",
          open
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
        )}
      >
        {/* Caret */}
        <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-surface-low border-l border-t border-outline-variant/50" />

        <ul className="py-1.5">
          {group.children!.map((child) => (
            <li key={child.href} role="none">
              <Link
                href={child.href}
                role="menuitem"
                onClick={close}
                className="flex flex-col gap-0.5 px-4 py-3.5 group hover:bg-white/[0.05] transition-colors duration-150 focus-visible:outline-none focus-visible:bg-white/[0.07] rounded-lg mx-1"
              >
                <span className="font-sans text-sm font-semibold text-on-surface group-hover:text-primary transition-colors duration-150">
                  {child.label}
                </span>
                {child.description && (
                  <span className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    {child.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Mobile nav group ───────────────────────────────────────────────────── */
function MobileNavGroup({
  group,
  isActive,
  onClose,
}: {
  group: NavGroup;
  isActive: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = Boolean(group.children?.length);

  const baseClass = cn(
    "flex items-center w-full font-sans text-base font-medium py-4 min-h-[52px]",
    "border-b border-outline-variant/30 transition-colors duration-150",
    isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
  );

  if (!hasChildren) {
    return (
      <li>
        <Link href={group.href} onClick={onClose} className={baseClass}>
          {group.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className={cn(baseClass, "justify-between")}
      >
        {group.label}
        <ChevronDown
          size={16}
          className={cn(
            "transition-transform duration-200 motion-reduce:transition-none",
            expanded ? "rotate-180" : "rotate-0"
          )}
          aria-hidden="true"
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 motion-reduce:transition-none",
          expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="pl-4 pt-1 pb-3 space-y-0.5">
          {group.children!.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onClose}
                className="flex flex-col gap-0.5 py-3 min-h-[48px] font-sans text-sm text-on-surface-variant hover:text-primary transition-colors duration-150"
              >
                <span className="font-semibold">{child.label}</span>
                {child.description && (
                  <span className="text-xs text-on-surface-variant/70 leading-relaxed">
                    {child.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/* ─── SiteHeader ─────────────────────────────────────────────────────────── */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  const isGroupActive = (group: NavGroup): boolean => {
    if (pathname === group.href) return true;
    return group.children?.some(
      (child) => pathname === child.href || pathname.startsWith(child.href + "/")
    ) ?? false;
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 motion-reduce:transition-none",
          scrolled
            ? "glass-nav shadow-[0_1px_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(0,0,0,0),0_1px_0_rgba(0,212,255,0.08)]"
            : "bg-[rgba(8,9,14,0.55)] backdrop-blur-xl border-b border-white/[0.05]"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px] lg:h-[72px]">
            {/* Logo */}
            <Link
              href="/"
              aria-label="SafeShield — Home"
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/75 rounded-md py-2 pr-2"
            >
              <div className="relative">
                <Shield
                  size={28}
                  className="text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                  aria-hidden="true"
                />
                <span className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="font-sans font-bold text-xl tracking-tight"
                style={{
                  background: "linear-gradient(130deg, #ffffff 30%, #a8e8ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Safe<span style={{ WebkitTextFillColor: "#3cd7ff" }}>Shield</span>
              </span>
            </Link>

            {/* Desktop nav — pill container */}
            <nav
              aria-label="Main navigation"
              className="hidden lg:flex items-center gap-0.5 px-2 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {mainNav.map((group) => (
                <DesktopDropdown
                  key={group.href}
                  group={group}
                  isActive={isGroupActive(group)}
                />
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href={ctaPrimary.href} className="btn-primary text-sm">
                {ctaPrimary.label}
              </Link>
            </div>

            {/* Mobile hamburger — 48×48 tap target */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center w-12 h-12 -mr-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/[0.06] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/75"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed inset-0 z-40 lg:hidden flex flex-col",
          "bg-[rgba(12,14,18,0.97)] backdrop-blur-2xl",
          "transition-all duration-300 motion-reduce:transition-none",
          mobileOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        )}
      >
        {/* Spacer below header */}
        <div className="h-[68px]" aria-hidden="true" />

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,212,255,0.07) 0%, transparent 60%)",
          }}
        />

        <div className="relative flex-1 overflow-y-auto px-5 sm:px-8 pb-10">
          <nav aria-label="Mobile navigation">
            <ul>
              {mainNav.map((group) => (
                <MobileNavGroup
                  key={group.href}
                  group={group}
                  isActive={isGroupActive(group)}
                  onClose={() => setMobileOpen(false)}
                />
              ))}
            </ul>
          </nav>

          <div className="mt-8 space-y-3">
            <Link
              href={ctaPrimary.href}
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full justify-center text-base"
            >
              {ctaPrimary.label}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
