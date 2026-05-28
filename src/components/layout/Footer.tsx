import ShieldLogo from "@/components/ui/ShieldLogo";
import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "Home", href: "/" },
    { label: "About SafeShield", href: "/about" },
    { label: "GuardianOS Framework", href: "/guardian-os" },
    { label: "Platform Tools", href: "/platform/tools" },
  ],
  Services: [
    { label: "Digital Safeguarding", href: "/services/digital-safeguarding" },
    { label: "Cyber Security", href: "/services/cyber-security" },
    { label: "GDPR & DPIA", href: "/services/gdpr-dpia" },
    { label: "AI Governance", href: "/services/ai-governance" },
    { label: "View All Services", href: "/services" },
  ],
  Resources: [
    { label: "Insights", href: "/insights" },
    { label: "Resource Library", href: "/resources" },
    { label: "Schools & Governors", href: "/schools-governors" },
    { label: "MATs & LAs", href: "/mats-las" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
};

const compliancePillars = [
  { label: "KCSIE 2024", hint: "Safeguarding" },
  { label: "UK GDPR", hint: "Privacy" },
  { label: "NCSC Aligned", hint: "Cyber" },
  { label: "Ofsted Ready", hint: "Inspection" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: "#060810" }}>
      {/* Top divider with glow */}
      <div
        className="h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.25) 25%, rgba(168,232,255,0.55) 50%, rgba(0,212,255,0.25) 75%, transparent 100%)",
          boxShadow: "0 0 16px rgba(0,212,255,0.18), 0 0 4px rgba(168,232,255,0.3)",
        }}
        aria-hidden="true"
      />

      {/* Ambient background depth */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,212,255,0.10) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Left cyan orb */}
        <div
          className="absolute -left-32 top-0 w-[500px] h-[320px]"
          style={{
            background: "radial-gradient(ellipse at 20% 30%, rgba(0,212,255,0.055) 0%, transparent 65%)",
          }}
        />
        {/* Right blue orb */}
        <div
          className="absolute -right-20 bottom-0 w-[400px] h-[300px]"
          style={{
            background: "radial-gradient(ellipse at 80% 70%, rgba(100,140,255,0.04) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-14">

          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-5">
            <ShieldLogo size={38} />
            <p className="text-[13.5px] text-on-surface-variant leading-relaxed max-w-[260px]">
              Digital safeguarding intelligence and compliance oversight for UK schools, MATs and local authorities.
            </p>

            {/* Compliance pillars */}
            <div className="flex flex-wrap gap-2 mt-1">
              {compliancePillars.map((p) => (
                <span
                  key={p.label}
                  className="inline-flex flex-col items-start px-2.5 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(0,212,255,0.045)",
                    border: "0.5px solid rgba(0,212,255,0.20)",
                  }}
                >
                  <span className="text-[10px] font-bold tracking-widest uppercase text-primary leading-none">{p.label}</span>
                  <span className="text-[9px] text-on-surface-variant/60 mt-0.5">{p.hint}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-3.5">
              <h4
                className="text-[11px] font-bold tracking-[0.12em] uppercase"
                style={{ color: "rgba(168,232,255,0.7)" }}
              >
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-on-surface-variant hover:text-on-surface transition-colors duration-200 leading-snug"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-[12px] text-on-surface-variant/50 order-3 sm:order-1">
            © {new Date().getFullYear()} SafeShield Ltd. Registered in England &amp; Wales.
          </p>

          {/* Centre: subtle tagline */}
          <p
            className="text-[11px] font-semibold tracking-[0.12em] uppercase order-1 sm:order-2"
            style={{ color: "rgba(0,212,255,0.45)" }}
          >
            Intelligence That Builds Confidence
          </p>

          <div className="flex items-center gap-1.5 order-2 sm:order-3">
            <span
              className="w-1.5 h-1.5 rounded-full bg-rag-green"
              style={{ boxShadow: "0 0 4px rgba(74,222,128,0.6)" }}
              aria-hidden="true"
            />
            <p className="text-[12px] text-on-surface-variant/50">
              Trusted by schools across England and Wales
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
