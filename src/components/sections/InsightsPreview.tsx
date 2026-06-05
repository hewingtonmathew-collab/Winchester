import GlassCard from "@/components/ui/GlassCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { articles } from "@/data/insights";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

function InsightVisual1() {
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="ins-bg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0c1f30" /><stop offset="100%" stopColor="#102540" />
        </linearGradient>
        <radialGradient id="ins-glow1" cx="50%" cy="50%" r="48%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#c9a84c" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill="url(#ins-bg1)" />
      <rect width="400" height="200" fill="url(#ins-glow1)" />
      {/* Outer rings */}
      <circle cx="200" cy="100" r="82" fill="none" stroke="rgba(201,168,76,0.10)" strokeWidth="0.8" strokeDasharray="4 6" />
      <circle cx="200" cy="100" r="72" fill="none" stroke="rgba(201,168,76,0.16)" strokeWidth="1" />
      <circle cx="200" cy="100" r="52" fill="none" stroke="rgba(201,168,76,0.28)" strokeWidth="1.2" />
      <circle cx="200" cy="100" r="33" fill="none" stroke="rgba(201,168,76,0.40)" strokeWidth="1.4" />
      {/* Shield fill + outline */}
      <path d="M200 56 L220 67 L220 93 Q220 115 200 126 Q180 115 180 93 L180 67 Z"
        fill="rgba(201,168,76,0.14)" stroke="rgba(201,168,76,0.85)" strokeWidth="1.8" />
      {/* Shield centre mark */}
      <path d="M200 74 L208 79 L208 91 Q208 101 200 106 Q192 101 192 91 L192 79 Z"
        fill="none" stroke="rgba(201,168,76,0.45)" strokeWidth="1" />
      {/* Spoke lines */}
      {[0,60,120,180,240,300].map((a, i) => (
        <line key={i}
          x1={200 + 33*Math.cos(a*Math.PI/180)} y1={100 + 33*Math.sin(a*Math.PI/180)}
          x2={200 + 72*Math.cos(a*Math.PI/180)} y2={100 + 72*Math.sin(a*Math.PI/180)}
          stroke="rgba(201,168,76,0.22)" strokeWidth="0.8" />
      ))}
      {/* Node dots */}
      {[30,90,150,210,270,330].map((a, i) => (
        <circle key={i}
          cx={200 + 52*Math.cos(a*Math.PI/180)} cy={100 + 52*Math.sin(a*Math.PI/180)}
          r="3.5" fill="rgba(201,168,76,0.65)" />
      ))}
      {/* Outer node rings */}
      {[30,90,150,210,270,330].map((a, i) => (
        <circle key={`or-${i}`}
          cx={200 + 52*Math.cos(a*Math.PI/180)} cy={100 + 52*Math.sin(a*Math.PI/180)}
          r="6" fill="none" stroke="rgba(201,168,76,0.22)" strokeWidth="0.8" />
      ))}
      <rect width="400" height="200" fill="rgba(4,10,18,0.16)" />
    </svg>
  );
}

function InsightVisual2() {
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="ins-bg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0e1e2e" /><stop offset="100%" stopColor="#0b1828" />
        </linearGradient>
        <radialGradient id="ins-glow2" cx="50%" cy="50%" r="44%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.26" />
          <stop offset="60%" stopColor="#c9a84c" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill="url(#ins-bg2)" />
      <rect width="400" height="200" fill="url(#ins-glow2)" />
      {/* Central chip body */}
      <rect x="148" y="64" width="104" height="72" fill="rgba(201,168,76,0.10)" stroke="rgba(201,168,76,0.72)" strokeWidth="2" rx="5" />
      {/* Inner chip detail frame */}
      <rect x="162" y="77" width="76" height="46" fill="none" stroke="rgba(201,168,76,0.35)" strokeWidth="1" rx="2" />
      {/* Circuit traces inside — horizontal */}
      <line x1="162" y1="91" x2="238" y2="91" stroke="rgba(201,168,76,0.18)" strokeWidth="0.8" />
      <line x1="162" y1="109" x2="238" y2="109" stroke="rgba(201,168,76,0.18)" strokeWidth="0.8" />
      {/* Circuit traces inside — vertical */}
      <line x1="185" y1="77" x2="185" y2="123" stroke="rgba(201,168,76,0.15)" strokeWidth="0.8" />
      <line x1="215" y1="77" x2="215" y2="123" stroke="rgba(201,168,76,0.15)" strokeWidth="0.8" />
      {/* Left pins */}
      {[80, 96, 112].map((y, i) => (
        <g key={`l-${i}`}>
          <line x1="120" y1={y} x2="148" y2={y} stroke="rgba(201,168,76,0.50)" strokeWidth="1.5" />
          <rect x="113" y={y - 3} width="7" height="6" fill="rgba(201,168,76,0.35)" rx="1" />
        </g>
      ))}
      {/* Right pins */}
      {[80, 96, 112].map((y, i) => (
        <g key={`r-${i}`}>
          <line x1="252" y1={y} x2="280" y2={y} stroke="rgba(201,168,76,0.50)" strokeWidth="1.5" />
          <rect x="280" y={y - 3} width="7" height="6" fill="rgba(201,168,76,0.35)" rx="1" />
        </g>
      ))}
      {/* Top pins */}
      {[172, 200, 228].map((x, i) => (
        <g key={`t-${i}`}>
          <line x1={x} y1="46" x2={x} y2="64" stroke="rgba(201,168,76,0.50)" strokeWidth="1.5" />
          <rect x={x - 3} y="39" width="6" height="7" fill="rgba(201,168,76,0.35)" rx="1" />
        </g>
      ))}
      {/* Bottom pins */}
      {[172, 200, 228].map((x, i) => (
        <g key={`b-${i}`}>
          <line x1={x} y1="136" x2={x} y2="154" stroke="rgba(201,168,76,0.50)" strokeWidth="1.5" />
          <rect x={x - 3} y="154" width="6" height="7" fill="rgba(201,168,76,0.35)" rx="1" />
        </g>
      ))}
      <text x="200" y="106" textAnchor="middle" fill="rgba(201,168,76,0.92)" fontSize="20" fontFamily="monospace" fontWeight="bold">AI</text>
      <rect width="400" height="200" fill="rgba(4,10,18,0.14)" />
    </svg>
  );
}

function InsightVisual3() {
  const cols = [
    { x: 134, h: 105, y: 65 },
    { x: 156, h: 118, y: 52 },
    { x: 178, h: 130, y: 40 },
    { x: 200, h: 137, y: 33 },
    { x: 222, h: 130, y: 40 },
    { x: 244, h: 118, y: 52 },
    { x: 266, h: 105, y: 65 },
  ];
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="ins-bg3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d1e2e" /><stop offset="100%" stopColor="#0a1925" />
        </linearGradient>
        <radialGradient id="ins-glow3" cx="50%" cy="65%" r="50%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.26" />
          <stop offset="55%" stopColor="#c9a84c" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill="url(#ins-bg3)" />
      <rect width="400" height="200" fill="url(#ins-glow3)" />
      {/* Entablature — thick top band */}
      <rect x="122" y="167" width="156" height="9" fill="rgba(201,168,76,0.12)" stroke="rgba(201,168,76,0.65)" strokeWidth="1.2" />
      {/* Frieze band */}
      <rect x="125" y="158" width="150" height="9" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.35)" strokeWidth="0.8" />
      {/* Stylobate step 1 */}
      <line x1="116" y1="178" x2="284" y2="178" stroke="rgba(201,168,76,0.60)" strokeWidth="2" />
      {/* Stylobate step 2 */}
      <line x1="110" y1="185" x2="290" y2="185" stroke="rgba(201,168,76,0.35)" strokeWidth="1.2" />
      {/* Columns */}
      {cols.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width="15" height={c.h}
          fill="rgba(201,168,76,0.09)" stroke="rgba(201,168,76,0.65)" strokeWidth="1.4" />
      ))}
      {/* Capital caps (wider) */}
      {cols.map((c, i) => (
        <line key={`cap-${i}`} x1={c.x - 3} y1={c.y} x2={c.x + 18} y2={c.y}
          stroke="rgba(201,168,76,0.70)" strokeWidth="2.5" />
      ))}
      {/* Base moulding */}
      {cols.map((c, i) => (
        <line key={`base-${i}`} x1={c.x - 2} y1={c.y + c.h} x2={c.x + 17} y2={c.y + c.h}
          stroke="rgba(201,168,76,0.45)" strokeWidth="1.8" />
      ))}
      {/* Top pediment */}
      <path d="M124 40 L200 16 L276 40" fill="rgba(201,168,76,0.04)" stroke="rgba(201,168,76,0.55)" strokeWidth="1.8" />
      {/* Pediment acroterion dot */}
      <circle cx="200" cy="15" r="2.5" fill="rgba(201,168,76,0.70)" />
      <rect width="400" height="200" fill="rgba(4,10,18,0.14)" />
    </svg>
  );
}

const articleVisualComponents = [InsightVisual1, InsightVisual2, InsightVisual3];

export default function InsightsPreview() {
  return (
    <section className="py-24 bg-[#0B1118] relative overflow-hidden" aria-labelledby="insights-heading">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 90% 50% at 50% 20%, rgba(201,168,76,0.04) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          {/* Header */}
          <div className="text-center mb-14">
            <p className="eyebrow mb-3 reveal">Intelligence &amp; Analysis</p>
            <h2 id="insights-heading" className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1">
              Expert Insights.
              <br />
              <span style={{ color: "#C9A84C" }}>Practical Resources. Real Impact.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <GlassCard
                key={article.id}
                hover
                as="article"
                className={`flex flex-col gap-0 overflow-hidden !p-0 reveal reveal-delay-${i + 1 as 1 | 2 | 3}`}
              >
                {/* Visual panel */}
                <div className="relative w-full h-44 overflow-hidden">
                  {(() => { const V = articleVisualComponents[i % articleVisualComponents.length]; return <V />; })()}
                  {/* Bottom fade to content */}
                  <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(18,27,38,0.85), transparent)" }} />
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-gold uppercase tracking-widest text-[0.6rem]">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <p className="font-inter text-[#A7B1BE] text-xs">{article.date}</p>

                  <h3 className="font-cinzel font-bold text-white text-sm leading-snug">
                    {article.title}
                  </h3>

                  <p className="font-inter text-[#A7B1BE] text-xs leading-relaxed flex-1 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#2A3340]">
                    <div className="flex items-center gap-2">
                      <span className="font-inter text-[#A7B1BE] text-[0.68rem]">{article.author}</span>
                      <span className="inline-flex items-center gap-1 font-inter text-[#A7B1BE] text-[0.68rem]">
                        <Clock size={9} strokeWidth={1.5} aria-hidden="true" />
                        {article.readTime}
                      </span>
                    </div>
                    <Link
                      href={article.href}
                      className="inline-flex items-center gap-1 text-[#C9A84C] text-xs font-inter font-medium group transition-all duration-200"
                    >
                      Read More
                      <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="flex justify-center mt-10 reveal reveal-delay-4">
            <ButtonPrimary href="/insights">View All Insights</ButtonPrimary>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
