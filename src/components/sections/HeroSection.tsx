import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import GlassCard from "@/components/ui/GlassCard";
import ShieldLogo from "@/components/ui/ShieldLogo";
import SectionDivider from "@/components/ui/SectionDivider";
import { FileDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-16"
      aria-label="Hero"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, #0d1f2d 0%, #0B1118 60%, #070d13 100%)",
        }}
      />
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* LEFT — Headline */}
        <div className="flex flex-col gap-6">
          <p className="eyebrow">Intelligence. Insight. Assurance.</p>

          <h1 className="heading-display text-5xl sm:text-6xl lg:text-7xl text-balance">
            Intelligence
            <br />
            That Builds
            <br />
            <span style={{ color: "#C9A84C" }}>Confidence.</span>
          </h1>

          <div className="divider-gold w-16 my-1" />

          <p className="font-cinzel text-[#A7B1BE] text-sm lg:text-base tracking-[0.2em] uppercase">
            School Compliance Intelligence
          </p>

          <p className="font-inter text-[#E6E9ED] text-base lg:text-lg leading-relaxed max-w-lg">
            Strategic operational, digital and governance assurance for schools
            and trusts. We deliver clarity, confidence and measurable outcomes.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <ButtonPrimary href="/services">Explore Our Services</ButtonPrimary>
            <ButtonSecondary href="/about">
              About Winchester Consultancy
            </ButtonSecondary>
          </div>
        </div>

        {/* RIGHT — Glass feature card */}
        <div className="flex justify-center lg:justify-end">
          <GlassCard className="w-full max-w-sm flex flex-col items-center text-center gap-6 py-10 px-8">
            <ShieldLogo size={80} variant="mark-only" />

            <div className="flex flex-col gap-1">
              {["ASSURANCE.", "COMPLIANCE.", "CONFIDENCE."].map((word) => (
                <p
                  key={word}
                  className="font-cinzel font-bold text-white text-2xl tracking-[0.15em]"
                >
                  {word}
                </p>
              ))}
            </div>

            <SectionDivider />

            <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
              We help schools and trusts navigate complex compliance, digital
              risk and operational challenges with clarity and confidence.
            </p>

            <a
              href="/capability-statement.pdf"
              download
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-lg w-full justify-center
                border border-[rgba(201,168,76,0.5)] text-[#C9A84C] font-inter text-sm tracking-wide
                hover:bg-[rgba(201,168,76,0.08)] transition-colors duration-200"
            >
              <FileDown size={15} strokeWidth={1.5} />
              Download Our Capability Statement
            </a>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
