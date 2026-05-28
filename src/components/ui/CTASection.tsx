import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  variant?: "default" | "prominent";
}

export default function CTASection({
  eyebrow = "Get started",
  title,
  description,
  primaryCTA = { label: "Book a Readiness Review", href: "/book-review" },
  secondaryCTA = { label: "Explore GuardianOS", href: "/guardian-os" },
  variant = "default",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden" aria-labelledby="cta-section-heading">
      {/* Top divider */}
      <div className="divider-cyan" aria-hidden="true" />

      <div
        className={cn(
          "relative w-full py-24 md:py-32 overflow-hidden",
          "glass-panel",
          variant === "prominent" && "glass-panel-active"
        )}
      >
        {/* Animated ambient depth */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* Animated cyan orb — top centre */}
          <div
            className="absolute left-1/2 -top-32 -translate-x-1/2 w-[900px] h-[600px] rounded-full will-change-transform"
            style={{
              background: "radial-gradient(ellipse, rgba(0,212,255,0.14) 0%, rgba(0,212,255,0.05) 40%, transparent 70%)",
              filter: "blur(60px)",
              animation: "orb-drift-1 24s ease-in-out infinite",
            }}
          />
          {/* Animated violet orb — bottom left */}
          <div
            className="absolute -bottom-20 -left-20 w-[600px] h-[400px] rounded-full will-change-transform"
            style={{
              background: "radial-gradient(ellipse, rgba(139,92,246,0.09) 0%, transparent 65%)",
              filter: "blur(80px)",
              animation: "orb-drift-2 32s ease-in-out infinite",
            }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(0,212,255,0.18) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-7">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span
                className="w-8 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.7))" }}
                aria-hidden="true"
              />
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary">
                {eyebrow}
              </p>
              <span
                className="w-8 h-px"
                style={{ background: "linear-gradient(90deg, rgba(0,212,255,0.7), transparent)" }}
                aria-hidden="true"
              />
            </div>

            {/* Title */}
            <h2
              id="cta-section-heading"
              className="font-bold text-on-surface text-balance leading-[1.1]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", letterSpacing: "-0.025em" }}
            >
              {title}
            </h2>

            {/* Description */}
            <p className="text-[1.05rem] text-on-surface-variant max-w-2xl leading-relaxed text-balance">
              {description}
            </p>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-semibold tracking-widest uppercase text-on-surface-variant/45">
              {["KCSIE 2024", "UK GDPR", "NCSC Aligned", "No long contracts"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4 pt-1">
              {primaryCTA && (
                <Link href={primaryCTA.href} className="btn-primary inline-flex items-center gap-2">
                  {primaryCTA.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
              {secondaryCTA && (
                <Link href={secondaryCTA.href} className="btn-secondary">
                  {secondaryCTA.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="divider-cyan" aria-hidden="true" />
    </section>
  );
}
