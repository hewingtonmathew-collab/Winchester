import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import GlassCard from "@/components/ui/GlassCard";
import ShieldLogo from "@/components/ui/ShieldLogo";
import SectionDivider from "@/components/ui/SectionDivider";
import { FileDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      aria-label="Hero"
    >
      {/* Base gradient — deep navy to near-black */}
      <div
        className="absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 15% 55%, #0c1e2e 0%, #0B1118 55%, #060c11 100%)",
        }}
      />

      {/* Dot-grid atmosphere — matches brand "particle wave" aesthetic */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(201,168,76,0.10) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Radial vignette to fade dot-grid edges */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(6,12,17,0.85) 100%)",
        }}
      />

      {/* Top-left glow */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] -z-20 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.25) 0%, transparent 70%)",
        }}
      />

      {/* Bottom-right glow */}
      <div
        className="absolute -bottom-40 right-0 w-[500px] h-[500px] -z-20 rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(13,31,45,0.8) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* LEFT — Headline */}
        <div className="flex flex-col gap-6">
          <p className="eyebrow animate-fade-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            Intelligence. Insight. Assurance.
          </p>

          <h1
            className="heading-display text-5xl sm:text-6xl lg:text-7xl text-balance animate-fade-up"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            Intelligence
            <br />
            That Builds
            <br />
            <span style={{ color: "#C9A84C" }}>Confidence.</span>
          </h1>

          <div
            className="divider-gold w-16 my-1 animate-fade-up"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          />

          <p
            className="font-cinzel text-[#A7B1BE] text-sm lg:text-base tracking-[0.2em] uppercase animate-fade-up"
            style={{ animationDelay: "0.35s", animationFillMode: "both" }}
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

        {/* RIGHT — Glass feature card */}
        <div
          className="flex justify-center lg:justify-end animate-fade-up"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
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
