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
                  <stop offset="0%" stopColor="#0d1a26" />
                  <stop offset="100%" stopColor="#091320" />
                </linearGradient>
                <radialGradient id="table-light" cx="50%" cy="60%" r="55%">
                  <stop offset="0%" stopColor="#c8a840" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#c8a840" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="win-light" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a2e42" />
                  <stop offset="100%" stopColor="#0f1e2e" />
                </linearGradient>
              </defs>

              {/* Background */}
              <rect width="640" height="480" fill="url(#room-bg)" />

              {/* Windows on back wall — lit */}
              <rect x="60" y="60" width="120" height="180" fill="url(#win-light)" rx="2" />
              <rect x="200" y="60" width="120" height="180" fill="url(#win-light)" rx="2" />
              <rect x="340" y="60" width="120" height="180" fill="url(#win-light)" rx="2" />
              <rect x="480" y="60" width="100" height="180" fill="url(#win-light)" rx="2" />
              {/* Window frames */}
              <rect x="60" y="60" width="120" height="180" fill="none" stroke="rgba(42,65,85,0.8)" strokeWidth="3" rx="2" />
              <rect x="200" y="60" width="120" height="180" fill="none" stroke="rgba(42,65,85,0.8)" strokeWidth="3" rx="2" />
              <rect x="340" y="60" width="120" height="180" fill="none" stroke="rgba(42,65,85,0.8)" strokeWidth="3" rx="2" />
              <rect x="480" y="60" width="100" height="180" fill="none" stroke="rgba(42,65,85,0.8)" strokeWidth="3" rx="2" />
              {/* Window cross bars */}
              <line x1="120" y1="60" x2="120" y2="240" stroke="rgba(42,65,85,0.8)" strokeWidth="2" />
              <line x1="60" y1="150" x2="180" y2="150" stroke="rgba(42,65,85,0.8)" strokeWidth="2" />
              <line x1="260" y1="60" x2="260" y2="240" stroke="rgba(42,65,85,0.8)" strokeWidth="2" />
              <line x1="200" y1="150" x2="320" y2="150" stroke="rgba(42,65,85,0.8)" strokeWidth="2" />
              <line x1="400" y1="60" x2="400" y2="240" stroke="rgba(42,65,85,0.8)" strokeWidth="2" />
              <line x1="340" y1="150" x2="460" y2="150" stroke="rgba(42,65,85,0.8)" strokeWidth="2" />

              {/* Conference table */}
              <ellipse cx="320" cy="350" rx="200" ry="50" fill="#131f2e" stroke="rgba(42,58,75,0.9)" strokeWidth="2" />
              <rect x="120" y="340" width="400" height="40" fill="#131f2e" stroke="rgba(42,58,75,0.9)" strokeWidth="2" rx="3" />

              {/* Table ambient glow */}
              <rect width="640" height="480" fill="url(#table-light)" />

              {/* People silhouettes — seated */}
              {/* Person 1 */}
              <ellipse cx="160" cy="298" rx="22" ry="22" fill="#1b2d40" />
              <rect x="138" y="318" width="44" height="35" fill="#1b2d40" rx="5" />
              {/* Person 2 */}
              <ellipse cx="260" cy="292" rx="22" ry="22" fill="#1c2f42" />
              <rect x="238" y="312" width="44" height="38" fill="#1c2f42" rx="5" />
              {/* Person 3 (standing/presenting) */}
              <ellipse cx="380" cy="260" rx="24" ry="24" fill="#1e3248" />
              <rect x="356" y="282" width="48" height="55" fill="#1e3248" rx="5" />
              {/* Person 4 */}
              <ellipse cx="490" cy="295" rx="22" ry="22" fill="#1b2d40" />
              <rect x="468" y="315" width="44" height="36" fill="#1b2d40" rx="5" />

              {/* Screen/presentation on left */}
              <rect x="20" y="120" width="35" height="25" fill="#0a1825" stroke="rgba(201,168,76,0.35)" strokeWidth="1.5" rx="2" />
              <rect x="25" y="125" width="25" height="15" fill="rgba(201,168,76,0.12)" rx="1" />

              {/* Gold accent line at bottom */}
              <line x1="0" y1="475" x2="640" y2="475" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />

              {/* Subtle overlay for depth */}
              <rect width="640" height="480" fill="rgba(5,12,20,0.15)" />
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
