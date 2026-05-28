import Link from "next/link";
import { Shield } from "lucide-react";

/* ─── Link column data ───────────────────────────────────────────────────── */
type FooterLink = { label: string; href: string };
type FooterColumn = { heading: string; links: FooterLink[] };

const columns: FooterColumn[] = [
  {
    heading: "Services",
    links: [
      { label: "Digital Safeguarding", href: "/services/digital-safeguarding" },
      { label: "Cyber Security", href: "/services/cyber-security" },
      { label: "GDPR & Privacy", href: "/services/gdpr-dpia" },
      { label: "AI Governance", href: "/services/ai-governance" },
      { label: "Filtering & Monitoring", href: "/services/filtering-monitoring" },
      { label: "Governor Oversight", href: "/services/governor-oversight" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Policy Checker", href: "/platform/policy-checker" },
      { label: "Risk Register", href: "/platform/risk-register" },
      { label: "SAR Planner", href: "/platform/sar-planner" },
      { label: "DPIA Wizard", href: "/platform/dpia-wizard" },
      { label: "Evidence Trail", href: "/platform/evidence-audit" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "GuardianOS Framework", href: "/guardian-os" },
      { label: "Schools & Governors", href: "/schools-governors" },
      { label: "MATs & LAs", href: "/mats-las" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Book a Review", href: "/book-review" },
    ],
  },
];

/* ─── SiteFooter ─────────────────────────────────────────────────────────── */
export default function SiteFooter() {
  return (
    <footer className="bg-surface-lowest">
      {/* top cyan divider */}
      <div className="divider-cyan" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* Main grid: logo column + 4 link columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Logo + tagline */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
            <Link
              href="/"
              aria-label="SafeShield — Home"
              className="flex items-center gap-2.5 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/75 rounded"
            >
              <Shield
                size={24}
                className="text-primary"
                aria-hidden="true"
              />
              <span className="font-sans font-bold text-lg text-primary tracking-tight">
                SafeShield
              </span>
            </Link>

            <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-[240px]">
              Expert compliance assurance for schools, governors and multi-academy trusts across England and Wales.
            </p>

            <p className="text-label-caps text-primary tracking-widest uppercase">
              Assurance · Compliance · Intelligence
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <h3 className="eyebrow text-primary">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-on-surface-variant hover:text-on-surface transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/75 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom divider */}
        <div className="divider-cyan mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: copyright + registration */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <p className="font-sans text-xs text-on-surface-variant">
              &copy; 2025 SafeShield. All rights reserved.
            </p>
            <span className="hidden sm:inline text-outline-variant" aria-hidden="true">|</span>
            <p className="font-sans text-xs text-on-surface-variant">
              Registered in England &amp; Wales
            </p>
          </div>

          {/* Centre: trust statement */}
          <p className="font-sans text-xs text-on-surface-variant text-center sm:text-left order-last sm:order-none">
            Trusted by schools and trusts across England and Wales
          </p>

          {/* Right: platform status */}
          <div
            className="flex items-center gap-2"
            role="status"
            aria-label="Platform status: operational"
          >
            {/* Pulsing green dot */}
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rag-green opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rag-green" />
            </span>
            <span className="font-sans text-xs text-on-surface-variant">
              Platform operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
