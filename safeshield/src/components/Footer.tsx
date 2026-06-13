"use client";
import Link from "next/link";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type FooterLink = {
  id: string;
  label: string;
  href: string;
  sort_order: number;
};

const LS_KEY = "safeshield_footer_links";

export function useFooterLinks() {
  const [links, setLinks] = useState<FooterLink[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("footer_links")
          .select("*")
          .order("sort_order", { ascending: true });
        if (data && data.length > 0) { setLinks(data); return; }
      } catch { /* table may not exist */ }
      try {
        const stored = localStorage.getItem(LS_KEY);
        if (stored) setLinks(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    load();
  }, []);

  return { links, setLinks };
}

export default function Footer() {
  const { links } = useFooterLinks();
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto border-t"
      style={{
        borderColor: "var(--glass-border)",
        background: "var(--glass-bg)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-[rgba(56,189,248,0.3)] bg-[rgba(56,189,248,0.08)]">
              <Shield size={14} className="text-[#38BDF8]" strokeWidth={1.8} />
            </div>
            <span className="heading-luxury text-sm" style={{ color: "var(--text)" }}>SafeShield</span>
          </div>

          {/* Links */}
          {links.length > 0 && (
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {links.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={l.href}
                      className="text-xs transition-colors hover:underline"
                      style={{ color: "var(--text-dim)" }}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Copyright */}
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            © {year} SafeShield. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
