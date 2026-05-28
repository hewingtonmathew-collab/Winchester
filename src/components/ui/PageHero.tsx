"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import HeroBackground from "@/components/ui/HeroBackground";

export interface HeroMedia {
  type: "video" | "image";
  src: string;
  poster?: string;
  alt?: string;
  /** Dark overlay opacity 0–1 (default 0.55) */
  overlay?: number;
}

export interface PageHeroProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  description: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  badge?: { label: string; variant?: "cyan" | "green" | "amber" | "red" | "neutral" };
  statusDot?: boolean;
  className?: string;
  children?: React.ReactNode;
  /** Background media — video or high-res photo */
  media?: HeroMedia;
  /** "cinematic" = full-bleed media, full-height, centred text
   *  "centered"  = no media split, text centred
   *  "default"   = left text + right children slot (original layout) */
  variant?: "default" | "cinematic" | "centered";
  /** Show an animated scroll-down chevron */
  scrollIndicator?: boolean;
}

const badgeClass = {
  cyan: "badge-cyan",
  green: "badge-green",
  amber: "badge-amber",
  red: "badge-red",
  neutral: "badge-neutral",
} as const;

function renderTitle(title: string, highlight?: string) {
  if (!highlight || !title.includes(highlight)) return <span>{title}</span>;
  const [before, ...rest] = title.split(highlight);
  return (
    <>
      {before}
      <span className="text-primary text-glow">{highlight}</span>
      {rest.join(highlight)}
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
  media,
  variant = "default",
  scrollIndicator = false,
}: PageHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onCanPlay = () => setVideoLoaded(true);
    vid.addEventListener("canplay", onCanPlay);
    return () => vid.removeEventListener("canplay", onCanPlay);
  }, []);

  const isCinematic = variant === "cinematic";
  const isCentered = variant === "centered";
  const hasMedia = Boolean(media);
  const overlayOpacity = media?.overlay ?? (isCinematic ? 0.6 : 0.45);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        isCinematic
          ? "min-h-[85vh] flex flex-col justify-end"
          : "pt-28 sm:pt-32 pb-section",
        className
      )}
      aria-label={eyebrow ?? "Page hero"}
    >
      {/* ── Background layer ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {/* Animated aurora + orb background */}
        {!hasMedia && (
          <HeroBackground
            intensity={isCinematic ? "intense" : "normal"}
            showOrbs
            showGrid
          />
        )}

        {/* Static base when media is present */}
        {hasMedia && <div className="absolute inset-0 bg-[#0c0e12]" />}

        {/* Video background */}
        {hasMedia && media!.type === "video" && (
          <video
            ref={videoRef}
            src={media!.src}
            poster={media!.poster}
            autoPlay
            muted
            loop
            playsInline
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
              videoLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Image background */}
        {hasMedia && media!.type === "image" && (
          <Image
            src={media!.src}
            alt={media!.alt ?? ""}
            fill
            priority
            quality={90}
            className="object-cover object-center"
            sizes="100vw"
          />
        )}

        {/* Dark overlay — heavier when media exists */}
        {hasMedia && (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(12,14,18,${overlayOpacity * 0.7}) 0%,
                rgba(12,14,18,${overlayOpacity * 0.5}) 40%,
                rgba(12,14,18,${overlayOpacity * 0.85}) 75%,
                rgba(12,14,18,0.98) 100%
              )`,
            }}
          />
        )}

        {/* Bottom fade for seamless section transition */}
        {!isCinematic && (
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(6,8,14,0.7))" }}
          />
        )}
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full",
          isCinematic && "pb-16 sm:pb-20 lg:pb-24"
        )}
      >
        {isCinematic ? (
          /* Cinematic: single column, text over full-bleed media */
          <div className="max-w-3xl">
            <HeroTextStack
              badge={badge}
              eyebrow={eyebrow}
              statusDot={statusDot}
              title={title}
              titleHighlight={titleHighlight}
              description={description}
              ctaPrimary={ctaPrimary}
              ctaSecondary={ctaSecondary}
              size="xl"
            />
          </div>
        ) : isCentered ? (
          /* Centered: full-width centred */
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
            <HeroTextStack
              badge={badge}
              eyebrow={eyebrow}
              statusDot={statusDot}
              title={title}
              titleHighlight={titleHighlight}
              description={description}
              ctaPrimary={ctaPrimary}
              ctaSecondary={ctaSecondary}
              centered
              size="lg"
            />
          </div>
        ) : (
          /* Default: left text + right children */
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <HeroTextStack
                badge={badge}
                eyebrow={eyebrow}
                statusDot={statusDot}
                title={title}
                titleHighlight={titleHighlight}
                description={description}
                ctaPrimary={ctaPrimary}
                ctaSecondary={ctaSecondary}
                size="lg"
              />
            </div>
            {children && (
              <div className="flex justify-center lg:justify-end">{children}</div>
            )}
          </div>
        )}
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      {scrollIndicator && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-on-surface-variant/50 animate-bounce motion-reduce:animate-none">
          <span className="text-[0.65rem] font-semibold tracking-widest uppercase">
            Scroll
          </span>
          <ChevronDown size={16} aria-hidden="true" />
        </div>
      )}
    </section>
  );
}

/* ─── Inner text block ──────────────────────────────────────────────────── */
interface TextStackProps {
  badge?: PageHeroProps["badge"];
  eyebrow?: string;
  statusDot?: boolean;
  title: string;
  titleHighlight?: string;
  description: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  centered?: boolean;
  size?: "lg" | "xl";
}

function HeroTextStack({
  badge,
  eyebrow,
  statusDot,
  title,
  titleHighlight,
  description,
  ctaPrimary,
  ctaSecondary,
  centered,
  size = "lg",
}: TextStackProps) {
  return (
    <>
      {/* Badge */}
      {badge && (
        <div className={centered ? "flex justify-center" : undefined}>
          <span className={cn("badge", badgeClass[badge.variant ?? "cyan"])}>
            {badge.label}
          </span>
        </div>
      )}

      {/* Eyebrow */}
      {eyebrow && (
        <p className={cn("eyebrow flex items-center gap-2", centered && "justify-center")}>
          {statusDot && (
            <span className="relative inline-flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-container opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-container" />
            </span>
          )}
          {eyebrow}
        </p>
      )}

      {/* Title */}
      <h1
        className={cn(
          "font-bold text-on-surface text-balance leading-[1.08]",
          size === "xl"
            ? "text-[clamp(2.5rem,6vw,4.5rem)]"
            : "text-[clamp(2rem,4.5vw,3.5rem)]"
        )}
      >
        {renderTitle(title, titleHighlight)}
      </h1>

      {/* Description */}
      <p
        className={cn(
          "text-body-lg text-on-surface-variant text-balance leading-relaxed",
          centered ? "max-w-2xl" : "max-w-xl",
          size === "xl" && "text-[1.125rem]"
        )}
      >
        {description}
      </p>

      {/* CTAs */}
      {(ctaPrimary || ctaSecondary) && (
        <div
          className={cn(
            "flex flex-wrap gap-4 pt-2",
            centered && "justify-center"
          )}
        >
          {ctaPrimary && (
            <Link href={ctaPrimary.href} className="btn-primary">
              {ctaPrimary.label}
            </Link>
          )}
          {ctaSecondary && (
            <Link href={ctaSecondary.href} className="btn-secondary">
              {ctaSecondary.href.startsWith("#")
                ? ctaSecondary.label
                : ctaSecondary.label}
            </Link>
          )}
        </div>
      )}
    </>
  );
}
