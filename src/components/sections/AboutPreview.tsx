import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ServiceIcon from "@/components/ui/ServiceIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { services } from "@/data/services";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPreview() {
  const coreServices = services.slice(0, 4);

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
                <linearGradient id="room-bg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0e1c2a" />
                  <stop offset="100%" stopColor="#0a1520" />
                </linearGradient>
                <radialGradient id="table-light" cx="50%" cy="65%" r="60%">
                  <stop offset="0%" stopColor="#c8a840" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#c8a840" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="win-light" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#253a52" />
                  <stop offset="60%" stopColor="#1a2e44" />
                  <stop offset="100%" stopColor="#112030" />
                </linearGradient>
                {/* Ambient window glow */}
                <radialGradient id="win-glow" cx="50%" cy="25%" r="50%">
                  <stop offset="0%" stopColor="#4a7090" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#4a7090" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background */}
              <rect width="640" height="480" fill="url(#room-bg)" />

              {/* Window ambient light glow */}
              <rect width="640" height="480" fill="url(#win-glow)" />

              {/* Windows on back wall — lit with more depth */}
              <rect x="55" y="55" width="125" height="185" fill="url(#win-light)" rx="3" />
              <rect x="195" y="55" width="125" height="185" fill="url(#win-light)" rx="3" />
              <rect x="335" y="55" width="125" height="185" fill="url(#win-light)" rx="3" />
              <rect x="477" y="55" width="110" height="185" fill="url(#win-light)" rx="3" />
              {/* Window frames */}
              <rect x="55" y="55" width="125" height="185" fill="none" stroke="rgba(55,80,105,0.90)" strokeWidth="3.5" rx="3" />
              <rect x="195" y="55" width="125" height="185" fill="none" stroke="rgba(55,80,105,0.90)" strokeWidth="3.5" rx="3" />
              <rect x="335" y="55" width="125" height="185" fill="none" stroke="rgba(55,80,105,0.90)" strokeWidth="3.5" rx="3" />
              <rect x="477" y="55" width="110" height="185" fill="none" stroke="rgba(55,80,105,0.90)" strokeWidth="3.5" rx="3" />
              {/* Window cross bars */}
              <line x1="117" y1="55" x2="117" y2="240" stroke="rgba(55,80,105,0.85)" strokeWidth="2.5" />
              <line x1="55" y1="147" x2="180" y2="147" stroke="rgba(55,80,105,0.85)" strokeWidth="2.5" />
              <line x1="257" y1="55" x2="257" y2="240" stroke="rgba(55,80,105,0.85)" strokeWidth="2.5" />
              <line x1="195" y1="147" x2="320" y2="147" stroke="rgba(55,80,105,0.85)" strokeWidth="2.5" />
              <line x1="397" y1="55" x2="397" y2="240" stroke="rgba(55,80,105,0.85)" strokeWidth="2.5" />
              <line x1="335" y1="147" x2="460" y2="147" stroke="rgba(55,80,105,0.85)" strokeWidth="2.5" />

              {/* Wall — darker band below windows */}
              <rect x="0" y="240" width="640" height="120" fill="rgba(8,14,22,0.60)" />

              {/* Conference table */}
              <ellipse cx="320" cy="355" rx="215" ry="55" fill="#0f1c2c" stroke="rgba(50,72,95,0.95)" strokeWidth="2.5" />
              <rect x="105" y="342" width="430" height="44" fill="#0f1c2c" stroke="rgba(50,72,95,0.95)" strokeWidth="2.5" rx="4" />

              {/* Table ambient glow */}
              <rect width="640" height="480" fill="url(#table-light)" />

              {/* People silhouettes — more contrast */}
              {/* Person 1 */}
              <ellipse cx="160" cy="300" rx="23" ry="23" fill="#1f3348" />
              <rect x="137" y="321" width="46" height="36" fill="#1f3348" rx="6" />
              {/* Person 2 */}
              <ellipse cx="265" cy="293" rx="23" ry="23" fill="#22364c" />
              <rect x="242" y="314" width="46" height="40" fill="#22364c" rx="6" />
              {/* Person 3 (presenting) */}
              <ellipse cx="385" cy="258" rx="26" ry="26" fill="#253952" />
              <rect x="359" y="282" width="52" height="58" fill="#253952" rx="6" />
              {/* Person 4 */}
              <ellipse cx="495" cy="297" rx="23" ry="23" fill="#1f3348" />
              <rect x="472" y="318" width="46" height="37" fill="#1f3348" rx="6" />

              {/* Presentation screen (left wall) */}
              <rect x="18" y="118" width="38" height="28" fill="#0c1926" stroke="rgba(201,168,76,0.45)" strokeWidth="2" rx="2" />
              <rect x="23" y="123" width="28" height="18" fill="rgba(201,168,76,0.15)" rx="1" />

              {/* Gold accent line at bottom */}
              <line x1="0" y1="475" x2="640" y2="475" stroke="rgba(201,168,76,0.40)" strokeWidth="1.5" />

              {/* Depth overlay */}
              <rect width="640" height="480" fill="rgba(4,10,18,0.12)" />
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
                  className={`flex items-center gap-3 p-3 rounded-lg border border-[#2A3340] hover:border-[rgba(201,168,76,0.35)] transition-colors duration-200 group reveal reveal-delay-${i + 1 as 1 | 2 | 3 | 4}`}
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
