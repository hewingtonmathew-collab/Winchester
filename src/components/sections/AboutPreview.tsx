import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ServiceIcon from "@/components/ui/ServiceIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { services } from "@/data/services";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPreview() {
  const coreServices = services.slice(0, 5);

  return (
    <section className="py-24 bg-[#0B1118]" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT — Image placeholder with professional SVG scene */}
        <ScrollReveal>
          <div
            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden reveal"
            style={{ border: "1px solid rgba(42,51,64,0.80)" }}
          >
            {/* SVG illustration: meeting room silhouette */}
            <svg
              viewBox="0 0 640 480"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                {/* Room interior — dark navy */}
                <linearGradient id="room-bg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#071018" />
                  <stop offset="100%" stopColor="#050c14" />
                </linearGradient>
                {/* Window glass — vivid daylight blue */}
                <linearGradient id="win-light" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8abcda" />
                  <stop offset="45%" stopColor="#6a9fc0" />
                  <stop offset="100%" stopColor="#4a7a9e" />
                </linearGradient>
                {/* Glow bloom from windows into room */}
                <radialGradient id="win-glow" cx="50%" cy="18%" r="70%">
                  <stop offset="0%" stopColor="#5a9ac0" stopOpacity="0.55" />
                  <stop offset="45%" stopColor="#4080a8" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3070a0" stopOpacity="0" />
                </radialGradient>
                {/* Mid-room ambient light (window light reaching floor) */}
                <radialGradient id="mid-light" cx="50%" cy="60%" r="55%">
                  <stop offset="0%" stopColor="#3a6898" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#1a3860" stopOpacity="0" />
                </radialGradient>
                {/* Warm gold desk lamp glow */}
                <radialGradient id="table-light" cx="50%" cy="72%" r="55%">
                  <stop offset="0%" stopColor="#c8a840" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#c8a840" stopOpacity="0" />
                </radialGradient>
                {/* Table surface highlight */}
                <linearGradient id="table-surface" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a3350" />
                  <stop offset="100%" stopColor="#0d1e30" />
                </linearGradient>
                {/* Floor perspective fade */}
                <linearGradient id="floor-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0a1828" />
                  <stop offset="100%" stopColor="#060e18" />
                </linearGradient>
                {/* Soft glow bloom filter */}
                <filter id="win-bloom" x="-15%" y="-15%" width="130%" height="130%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background room */}
              <rect width="640" height="480" fill="url(#room-bg)" />

              {/* Window glow — ambient light flooding into room */}
              <rect width="640" height="480" fill="url(#win-glow)" />

              {/* ── Windows — bright daylight blue ── */}
              {/* Glow halos behind windows (bloom) */}
              <rect x="48" y="48" width="140" height="200" fill="#5a9abe" opacity="0.35" rx="4" filter="url(#win-bloom)" />
              <rect x="188" y="48" width="140" height="200" fill="#5a9abe" opacity="0.35" rx="4" filter="url(#win-bloom)" />
              <rect x="328" y="48" width="140" height="200" fill="#5a9abe" opacity="0.35" rx="4" filter="url(#win-bloom)" />
              <rect x="472" y="48" width="120" height="200" fill="#5a9abe" opacity="0.30" rx="4" filter="url(#win-bloom)" />

              {/* Window panes */}
              <rect x="55" y="55" width="125" height="185" fill="url(#win-light)" rx="3" />
              <rect x="195" y="55" width="125" height="185" fill="url(#win-light)" rx="3" />
              <rect x="335" y="55" width="125" height="185" fill="url(#win-light)" rx="3" />
              <rect x="477" y="55" width="108" height="185" fill="url(#win-light)" rx="3" />

              {/* Window frames — steel dark */}
              <rect x="55" y="55" width="125" height="185" fill="none" stroke="rgba(20,40,60,0.95)" strokeWidth="4" rx="3" />
              <rect x="195" y="55" width="125" height="185" fill="none" stroke="rgba(20,40,60,0.95)" strokeWidth="4" rx="3" />
              <rect x="335" y="55" width="125" height="185" fill="none" stroke="rgba(20,40,60,0.95)" strokeWidth="4" rx="3" />
              <rect x="477" y="55" width="108" height="185" fill="none" stroke="rgba(20,40,60,0.95)" strokeWidth="4" rx="3" />

              {/* Window cross-bars */}
              <line x1="117" y1="58" x2="117" y2="237" stroke="rgba(20,40,60,0.90)" strokeWidth="3" />
              <line x1="58" y1="148" x2="177" y2="148" stroke="rgba(20,40,60,0.90)" strokeWidth="3" />
              <line x1="257" y1="58" x2="257" y2="237" stroke="rgba(20,40,60,0.90)" strokeWidth="3" />
              <line x1="198" y1="148" x2="317" y2="148" stroke="rgba(20,40,60,0.90)" strokeWidth="3" />
              <line x1="397" y1="58" x2="397" y2="237" stroke="rgba(20,40,60,0.90)" strokeWidth="3" />
              <line x1="338" y1="148" x2="457" y2="148" stroke="rgba(20,40,60,0.90)" strokeWidth="3" />

              {/* Wall below windows — medium dark with blue ambient tint */}
              <rect x="0" y="240" width="640" height="240" fill="rgba(8,18,32,0.75)" />
              {/* Mid-room ambient glow */}
              <rect width="640" height="480" fill="url(#mid-light)" />

              {/* Floor */}
              <rect x="0" y="400" width="640" height="80" fill="url(#floor-grad)" />

              {/* Conference table — dark with slight blue reflection */}
              <ellipse cx="320" cy="360" rx="220" ry="50" fill="url(#table-surface)" stroke="rgba(50,80,110,0.80)" strokeWidth="2" />
              <rect x="100" y="342" width="440" height="40" fill="url(#table-surface)" stroke="rgba(50,80,110,0.80)" strokeWidth="2" rx="4" />
              {/* Table highlight — window reflection */}
              <ellipse cx="300" cy="345" rx="90" ry="8" fill="rgba(90,154,190,0.25)" />

              {/* Table warm glow */}
              <rect width="640" height="480" fill="url(#table-light)" />

              {/* ── Person silhouettes ── */}
              {/* Person 1 — far left, seated */}
              <ellipse cx="148" cy="298" rx="22" ry="22" fill="#162840" />
              <rect x="126" y="318" width="44" height="42" fill="#162840" rx="8" />

              {/* Person 2 — center-left, seated */}
              <ellipse cx="255" cy="290" rx="24" ry="24" fill="#1a3050" />
              <rect x="231" y="312" width="48" height="46" fill="#1a3050" rx="8" />

              {/* Person 3 — center-right, standing (presenter) */}
              <ellipse cx="388" cy="250" rx="27" ry="27" fill="#1e3858" />
              <rect x="361" y="275" width="54" height="80" fill="#1e3858" rx="8" />

              {/* Person 4 — far right, seated */}
              <ellipse cx="498" cy="295" rx="22" ry="22" fill="#162840" />
              <rect x="476" y="315" width="44" height="42" fill="#162840" rx="8" />

              {/* ── Wall / ceiling details ── */}
              {/* Ceiling line */}
              <line x1="0" y1="30" x2="640" y2="30" stroke="rgba(30,55,80,0.50)" strokeWidth="2" />

              {/* Left wall presentation screen */}
              <rect x="10" y="110" width="44" height="34" fill="#0c1926" stroke="rgba(201,168,76,0.55)" strokeWidth="2" rx="2" />
              <rect x="14" y="114" width="36" height="26" fill="rgba(201,168,76,0.18)" rx="1" filter="url(#soft-glow)" />

              {/* Gold accent line at bottom */}
              <line x1="0" y1="475" x2="640" y2="475" stroke="rgba(201,168,76,0.45)" strokeWidth="1.5" />

              {/* Final depth overlay */}
              <rect width="640" height="480" fill="rgba(4,9,16,0.08)" />
            </svg>

            {/* Floating label */}
            <div className="absolute bottom-4 left-4 right-4">
              <div
                className="glass-subtle px-4 py-2.5 flex items-center gap-3"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[pulse-slow_3s_ease-in-out_infinite] flex-shrink-0" />
                <p className="font-inter text-[#A7B1BE] text-xs">
                  Practitioner-led consultancy — 16+ years in schools &amp; trusts
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* RIGHT — Text + service list */}
        <ScrollReveal threshold={0.06}>
          <div className="flex flex-col gap-6">
            <p className="eyebrow reveal">About Us</p>
            <h2
              id="about-heading"
              className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1 text-balance"
            >
              Experience That
              <br />
              <span style={{ color: "#C9A84C" }}>Understands Education.</span>
            </h2>
            <p className="font-inter text-[#E6E9ED] leading-relaxed reveal reveal-delay-2">
              Winchester Consultancy was founded by practitioners with deep roots in
              school business management and ICT leadership. We understand the pressures
              facing school leaders because we&apos;ve lived them.
            </p>
            <p className="font-inter text-[#A7B1BE] leading-relaxed reveal reveal-delay-3">
              Whether you&apos;re a single school or a growing multi-academy trust, we
              deliver intelligence that builds genuine confidence.
            </p>

            {/* Compact service list */}
            <div className="flex flex-col gap-2.5 mt-2">
              {coreServices.map((service, i) => (
                <div
                  key={service.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border border-[#2A3340] hover:border-[rgba(201,168,76,0.35)] transition-colors duration-200 group reveal reveal-delay-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center"
                    style={{
                      background: "rgba(11,17,24,0.6)",
                      border: "1px solid rgba(201,168,76,0.22)",
                    }}
                  >
                    <ServiceIcon name={service.icon} size={14} />
                  </div>
                  <p className="font-cinzel font-bold text-white text-xs group-hover:text-[#C9A84C] transition-colors duration-200 leading-snug flex-1">
                    {service.title}
                  </p>
                  <ArrowRight size={12} className="text-[#2A3340] group-hover:text-[#C9A84C] transition-colors duration-200 flex-shrink-0" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-2 reveal reveal-delay-5">
              <ButtonPrimary href="/about">Learn More</ButtonPrimary>
              <Link
                href="/services"
                className="font-inter text-sm text-[#A7B1BE] hover:text-white transition-colors inline-flex items-center gap-1.5 group"
              >
                View All Services
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
