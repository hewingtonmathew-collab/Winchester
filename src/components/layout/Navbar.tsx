"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ShieldLogo from "@/components/ui/ShieldLogo";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Guardian OS", href: "/guardian-os" },
  { label: "Platform", href: "/platform/tools" },
  { label: "Insights", href: "/insights" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "glass-nav"
          : "bg-transparent"
      )}
    >
      {/* Top accent line — only visible when scrolled */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-px transition-opacity duration-500 pointer-events-none",
          scrolled ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.4) 30%, rgba(168,232,255,0.7) 50%, rgba(0,212,255,0.4) 70%, transparent 100%)",
          boxShadow: "0 0 8px rgba(0,212,255,0.3)",
        }}
        aria-hidden="true"
      />

      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
        style={{ height: scrolled ? "60px" : "72px", transition: "height 0.4s ease" }}
        aria-label="SafeShield main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label="SafeShield — Home"
        >
          <ShieldLogo size={scrolled ? 30 : 34} />
          <span
            className="hidden sm:block font-bold text-[15px] tracking-[-0.01em] text-on-surface group-hover:text-primary transition-colors duration-300"
            style={{ transition: "font-size 0.4s ease" }}
          >
            Safe<span className="text-primary">Shield</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1" role="list">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 rounded-lg text-[13.5px] font-medium tracking-wide transition-all duration-200",
                    active
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-white/[0.04]"
                  )}
                >
                  {link.label}
                  {/* Active underline */}
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.9), transparent)",
                        boxShadow: "0 0 6px rgba(0,212,255,0.5)",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: separator + CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          {/* Vertical separator */}
          <div
            className="hidden lg:block w-px h-5 bg-white/10"
            aria-hidden="true"
          />

          {/* CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex btn-primary text-[13px] px-5 py-2 min-h-[36px] rounded-lg"
          >
            Get in Touch
          </Link>

          {/* Mobile toggle */}
          <button
            className="lg:hidden relative flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/[0.06] transition-all duration-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            <Menu
              size={20}
              className={cn(
                "absolute transition-all duration-200",
                mobileOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
              )}
            />
            <X
              size={20}
              className={cn(
                "absolute transition-all duration-200",
                mobileOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-400 ease-out",
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
        style={{ transitionProperty: "max-height, opacity" }}
      >
        <div
          className="mx-3 mb-3 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(10,12,20,0.96)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <ul className="flex flex-col p-3 gap-1" role="list">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200",
                      active
                        ? "text-primary bg-primary/[0.07] border border-primary/20"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-white/[0.05]"
                    )}
                  >
                    {link.label}
                    {active && (
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                        style={{ boxShadow: "0 0 6px rgba(0,212,255,0.8)" }}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="px-3 pb-3">
            <Link
              href="/contact"
              className="btn-primary w-full justify-center text-[14px]"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
