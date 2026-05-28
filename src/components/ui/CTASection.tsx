import Link from "next/link";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  variant?: "default" | "prominent";
}

export default function CTASection({
  eyebrow,
  title,
  description,
  primaryCTA = { label: "Book a Readiness Review", href: "/book-review" },
  secondaryCTA = {
    label: "Explore GuardianOS Framework",
    href: "/guardian-os",
  },
  variant = "default",
}: CTASectionProps) {
  return (
    <section aria-labelledby="cta-section-heading">
      {/* Top divider */}
      <div className="divider-cyan" aria-hidden="true" />

      <div
        className={cn(
          "relative w-full py-section overflow-hidden",
          "glass-panel",
          variant === "prominent" && "glass-panel-active"
        )}
      >
        {/* Ambient cyan glow */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[400px]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 20%, rgba(0,212,255,0.10) 0%, transparent 65%)",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-6">
            {/* Eyebrow */}
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}

            {/* Title */}
            <h2
              id="cta-section-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              {title}
            </h2>

            {/* Description */}
            <p className="text-body-lg text-on-surface-variant max-w-2xl text-balance">
              {description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {primaryCTA && (
                <Link href={primaryCTA.href} className="btn-primary">
                  {primaryCTA.label}
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
