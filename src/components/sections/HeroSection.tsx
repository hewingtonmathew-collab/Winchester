import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import GlassCard from "@/components/ui/GlassCard";

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
            School Compliance Intelligence
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
            Winchester Digital Assurance Framework
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

        {/* RIGHT — Intelligence Dashboard Card */}
        <div
          className="flex justify-center lg:justify-end animate-fade-up"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          <GlassCard variant="prominent" className="w-full max-w-sm">
            {/* Header bar */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#2A3340]">
              <span className="eyebrow" style={{ fontSize: "0.65rem" }}>Compliance Intelligence</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[pulse-slow_3s_ease-in-out_infinite] inline-block" />
                <span className="font-inter text-[#A7B1BE] text-xs">Live Dashboard</span>
              </div>
            </div>

            {/* Score gauge + overall rating */}
            <div className="flex items-center gap-5 mb-6">
              {/* SVG circular progress — 82% filled in gold */}
              <div className="relative w-[72px] h-[72px] flex-shrink-0">
                <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                  <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(42,51,64,0.6)" strokeWidth="5" />
                  <circle
                    cx="36" cy="36" r="28" fill="none"
                    stroke="#C9A84C" strokeWidth="5"
                    strokeDasharray={`${2 * Math.PI * 28 * 0.82} ${2 * Math.PI * 28}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-cinzel font-black text-white text-lg leading-none">82</span>
                  <span className="font-inter text-[#A7B1BE]" style={{ fontSize: "0.6rem" }}>/ 100</span>
                </div>
              </div>
              <div>
                <p className="font-inter text-[#A7B1BE] text-xs uppercase tracking-wider mb-0.5">Overall Readiness</p>
                <p className="font-cinzel font-bold text-white text-sm mb-1">GOOD STANDING</p>
                <span className="badge badge-warning">3 Actions Required</span>
              </div>
            </div>

            {/* Domain status rows */}
            <div className="flex flex-col gap-2.5 mb-5">
              {[
                { label: "Digital Safeguarding", score: 88, status: "success" },
                { label: "Governance", score: 79, status: "warning" },
                { label: "AI Governance", score: 65, status: "warning" },
                { label: "Cyber Resilience", score: 91, status: "success" },
              ].map((domain) => (
                <div key={domain.label} className="flex items-center gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    domain.status === "success" ? "bg-emerald-400" : "bg-amber-400"
                  }`} />
                  <span className="font-inter text-[#A7B1BE] flex-1" style={{ fontSize: "0.72rem" }}>{domain.label}</span>
                  <div className="w-14 h-1 bg-[#2A3340] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C9A84C] rounded-full"
                      style={{ width: `${domain.score}%` }}
                    />
                  </div>
                  <span className="font-inter text-[#E6E9ED] w-6 text-right" style={{ fontSize: "0.7rem" }}>{domain.score}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#2A3340] flex items-center justify-between">
              <span className="font-inter text-[#A7B1BE]" style={{ fontSize: "0.7rem" }}>Demo assessment view</span>
              <a href="/framework" className="font-inter text-[#C9A84C] hover:text-white transition-colors" style={{ fontSize: "0.7rem" }}>
                View Framework →
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
