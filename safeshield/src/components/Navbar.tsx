"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";

const links = [
  { label: "Dashboard", href: "/" },
  { label: "AI Detector", href: "/tools/ai-detector" },
  { label: "Safeguarding", href: "/tools/safeguarding" },
  { label: "Governance", href: "/tools/governance" },
  { label: "AI Readiness", href: "/tools/ai-readiness" },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 glass"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(56,189,248,0.15)] border border-[rgba(56,189,248,0.3)]">
            <Shield size={14} className="text-[#38BDF8]" />
          </span>
          <span className="text-white font-semibold text-sm tracking-wide">SafeShield</span>
        </Link>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {links.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  active
                    ? "bg-[rgba(56,189,248,0.15)] text-[#38BDF8] border border-[rgba(56,189,248,0.25)]"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
