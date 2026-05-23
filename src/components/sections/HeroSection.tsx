import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import GlassCard from "@/components/ui/GlassCard";
import ShieldLogo from "@/components/ui/ShieldLogo";
import HeroBuildingBg from "@/components/ui/HeroBuildingBg";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      aria-label="Hero"
    >
      {/* ── BACKGROUND: SVG architectural building facade ── */}
      <div className="absolute inset-0 -z-10">
        <HeroBuildingBg />
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

        {/* LEFT — Headline */}
        <div className="flex flex-col gap-6">
          <p
            className="font-inter text-[#C9A84C] text-[0.7rem] font-semibold tracking-[0.35em] uppercase animate-fade-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            Intelligence · Insight · Assurance
          </p>

          <h1
            className="heading-display text-5xl sm:text-6xl lg:text-7xl animate-fade-up"
            style={{
              animationDelay: "0.2s",
              animationFillMode: "both",
              lineHeight: 1.0,
              textShadow: "0 2px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.60)",
            }}
          >
            Intelligence That
            <br />
            Builds <span style={{ color: "#C9A84C" }}>Confidence.</span>
          </h1>

          <div
            className="divider-gold w-14 animate-fade-up"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          />

          <p
            className="font-cinzel text-[#A7B1BE] text-[0.7rem] tracking-[0.28em] uppercase animate-fade-up"
            style={{ animationDelay: "0.33s", animationFillMode: "both" }}
          >
            School Compliance Intelligence
          </p>

          <p
            className="font-inter text-[#E6E9ED] text-base lg:text-lg leading-relaxed max-w-lg animate-fade-up"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            Strategic operational, digital and governance assurance for schools
            and trusts. We deliver clarity, confidence and measurable outcomes.
          </p>

          <div
            className="flex flex-wrap gap-4 pt-2 animate-fade-up"
            style={{ animationDelay: "0.5s", animationFillMode: "both" }}
          >
            <ButtonPrimary href="/services">Explore Our Services</ButtonPrimary>
            <ButtonSecondary href="/about">
              About Winchester Consultancy
            </ButtonSecondary>
          </div>
        </div>

        {/* RIGHT — Brand Card */}
        <div
          className="flex justify-center lg:justify-end animate-fade-up"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          <GlassCard
            variant="prominent"
            className="w-full max-w-[400px] flex flex-col items-center text-center gap-0"
          >
            {/* Large shield mark */}
            <div className="mb-8">
              <ShieldLogo size={100} variant="mark-only" />
            </div>

            {/* ASSURANCE. COMPLIANCE. CONFIDENCE. */}
            <div className="flex flex-col gap-[3px] mb-8">
              {(["Assurance.", "Compliance.", "Confidence."] as const).map((word) => (
                <p
                  key={word}
                  className="font-cinzel font-black leading-tight"
                  style={{
                    fontSize: "clamp(1.5rem, 2.6vw, 1.85rem)",
                    letterSpacing: "0.06em",
                    color: word === "Confidence." ? "#C9A84C" : "#FFFFFF",
                  }}
                >
                  {word}
                </p>
              ))}
            </div>

            <div className="divider-gold w-full mb-6" />

            <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-7">
              We help schools and trusts navigate complex compliance, digital
              risk and operational challenges with clarity and confidence.
            </p>

            {/* CTA */}
            <Link
              href="/services"
              className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 rounded-lg border border-[rgba(201,168,76,0.30)] hover:border-[rgba(201,168,76,0.60)] font-inter text-sm text-[#C9A84C] hover:text-white transition-all duration-200 group"
            >
              Explore Our Services
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
