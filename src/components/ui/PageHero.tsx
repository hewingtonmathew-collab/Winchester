import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  description: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  badge?: {
    label: string;
    variant?: "cyan" | "green" | "amber" | "red" | "neutral";
  };
  statusDot?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const badgeVariantClass: Record<
  NonNullable<PageHeroProps["badge"]>["variant"] & string,
  string
> = {
  cyan: "badge-cyan",
  green: "badge-green",
  amber: "badge-amber",
  red: "badge-red",
  neutral: "badge-neutral",
};

function renderTitle(title: string, highlight?: string) {
  if (!highlight || !title.includes(highlight)) {
    return <span>{title}</span>;
  }
  const parts = title.split(highlight);
  return (
    <>
      {parts[0]}
      <span className="text-primary text-glow">{highlight}</span>
      {parts[1]}
    </>
  );
}

export default function PageHero({
  eyebrow,
  title,
  titleHighlight,
  description,
  ctaPrimary,
  ctaSecondary,
  badge,
  statusDot = false,
  className,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full pt-32 pb-section overflow-hidden",
        className
      )}
      aria-label={eyebrow ?? "Page hero"}
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.12) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-center">
          {/* ── Left column ── */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            {badge && (
              <div>
                <span
                  className={cn(
                    "badge",
                    badgeVariantClass[badge.variant ?? "cyan"]
                  )}
                >
                  {badge.label}
                </span>
              </div>
            )}

            {/* Eyebrow */}
            {eyebrow && (
              <p className="eyebrow flex items-center gap-2">
                {statusDot && (
                  <span
                    className="relative inline-flex h-2 w-2"
                    aria-hidden="true"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-container opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-container" />
                  </span>
                )}
                {eyebrow}
              </p>
            )}

            {/* Title */}
            <h1 className="text-display-lg font-bold text-on-surface text-balance">
              {renderTitle(title, titleHighlight)}
            </h1>

            {/* Description */}
            <p className="text-body-lg text-on-surface-variant max-w-xl text-balance">
              {description}
            </p>

            {/* CTAs */}
            {(ctaPrimary || ctaSecondary) && (
              <div className="flex flex-wrap gap-4 pt-2">
                {ctaPrimary && (
                  <Link href={ctaPrimary.href} className="btn-primary">
                    {ctaPrimary.label}
                  </Link>
                )}
                {ctaSecondary && (
                  <Link href={ctaSecondary.href} className="btn-secondary">
                    {ctaSecondary.label}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* ── Right column (visual slot) ── */}
          {children && (
            <div className="flex justify-center lg:justify-end">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
