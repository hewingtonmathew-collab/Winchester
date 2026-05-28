"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, ctaPrimary } from "@/data/nav";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type NavGroup = (typeof mainNav)[number];

/* ─── Desktop dropdown ───────────────────────────────────────────────────── */
function DesktopDropdown({
  group,
  isActive,
}: {
  group: NavGroup;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasChildren = Boolean(group.children?.length);

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, close]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  if (!hasChildren) {
    return (
      <Link
        href={group.href}
        className={cn(
          "relative font-sans text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/75 rounded px-1 py-0.5",
          isActive
            ? "text-primary text-glow after:absolute after:bottom-[-18px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full"
            : "text-on-surface-variant hover:text-on-surface"
        )}
      >
        {group.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className={cn(
          "flex items-center gap-1 font-sans text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/75 rounded px-1 py-0.5",
          isActive
            ? "text-primary text-glow"
            : "text-on-surface-variant hover:text-on-surface"
        )}
      >
        {group.label}
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200 motion-reduce:transition-none",
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
          "absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 z-50 min-w-[280px] rounded-lg glass-panel border border-outline-variant/60",
          "transition-all duration-200 motion-reduce:transition-none",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        {/* small caret */}
        <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-surface-low border-l border-t border-outline-variant/60" />

        <ul className="py-2">
          {group.children!.map((child) => (
            <li key={child.href} role="none">
              <Link
                href={child.href}
                role="menuitem"
                onClick={close}
                className="flex flex-col gap-0.5 px-4 py-3 group hover:bg-white/[0.04] transition-colors duration-150 focus-visible:outline-none focus-visible:bg-white/[0.06]"
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

/* ─── Mobile nav item ────────────────────────────────────────────────────── */
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

  if (!hasChildren) {
    return (
      <li>
        <Link
          href={group.href}
          onClick={onClose}
          className={cn(
            "block font-sans text-base font-medium py-3 border-b border-outline-variant/40 transition-colors duration-150",
            isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
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
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
        aria-expanded={expanded}
        className={cn(
          "flex items-center justify-between w-full font-sans text-base font-medium py-3 border-b border-outline-variant/40 transition-colors duration-150",
          isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
        )}
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

      {expanded && (
        <ul className="pl-4 mt-1 mb-2 space-y-1">
          {group.children!.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onClose}
                className="block py-2 font-sans text-sm text-on-surface-variant hover:text-primary transition-colors duration-150"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/* ─── SiteHeader ─────────────────────────────────────────────────────────── */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  const isGroupActive = (group: NavGroup): boolean => {
    if (pathname === group.href) return true;
    if (group.children) {
      return group.children.some((child) => pathname === child.href || pathname.startsWith(child.href + "/"));
    }
    return false;
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 motion-reduce:transition-none",
          scrolled ? "glass-nav" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">
            {/* Logo */}
            <Link
              href="/"
              aria-label="SafeShield — Home"
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/75 rounded"
            >
              <Shield
                size={26}
                className="text-primary transition-all duration-200 group-hover:drop-shadow-[0_0_8px_rgba(168,232,255,0.7)]"
                aria-hidden="true"
              />
              <span className="font-sans font-bold text-xl text-primary tracking-tight">
                SafeShield
              </span>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6">
              {mainNav.map((group) => (
                <DesktopDropdown
                  key={group.href}
                  group={group}
                  isActive={isGroupActive(group)}
                />
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Link href={ctaPrimary.href} className="btn-primary text-sm">
                {ctaPrimary.label}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded text-on-surface-variant hover:text-on-surface transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/75"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? (
                <X size={22} aria-hidden="true" />
              ) : (
                <Menu size={22} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — full-screen slide-down */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed inset-0 z-40 lg:hidden glass-nav flex flex-col",
          "transition-all duration-300 motion-reduce:transition-none",
          mobileOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        )}
      >
        {/* Spacer to sit below header */}
        <div className="h-16" aria-hidden="true" />

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-8">
          <nav aria-label="Mobile navigation">
            <ul className="divide-y divide-outline-variant/20">
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
              className="btn-primary w-full justify-center"
            >
              {ctaPrimary.label}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
