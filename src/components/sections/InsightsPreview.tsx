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
        <radialGradient id="ins-glow1" cx="50%" cy="50%" r="45%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill="url(#ins-bg1)" />
      <rect width="400" height="200" fill="url(#ins-glow1)" />
      {/* Outer rings */}
      <circle cx="200" cy="100" r="75" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
      <circle cx="200" cy="100" r="55" fill="none" stroke="rgba(201,168,76,0.20)" strokeWidth="1" />
      <circle cx="200" cy="100" r="35" fill="none" stroke="rgba(201,168,76,0.30)" strokeWidth="1.2" />
      {/* Shield mark */}
      <path d="M200 58 L218 68 L218 92 Q218 112 200 122 Q182 112 182 92 L182 68 Z"
        fill="rgba(201,168,76,0.10)" stroke="rgba(201,168,76,0.75)" strokeWidth="1.8" />
      {/* Spoke lines */}
      {[0,60,120,180,240,300].map((a, i) => (
        <line key={i}
          x1={200 + 35*Math.cos(a*Math.PI/180)} y1={100 + 35*Math.sin(a*Math.PI/180)}
          x2={200 + 75*Math.cos(a*Math.PI/180)} y2={100 + 75*Math.sin(a*Math.PI/180)}
          stroke="rgba(201,168,76,0.18)" strokeWidth="1" />
      ))}
      {/* Node dots */}
      {[30,90,150,210,270,330].map((a, i) => (
        <circle key={i}
          cx={200 + 55*Math.cos(a*Math.PI/180)} cy={100 + 55*Math.sin(a*Math.PI/180)}
          r="3" fill="rgba(201,168,76,0.55)" />
      ))}
      <rect width="400" height="200" fill="rgba(4,10,18,0.20)" />
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
        <radialGradient id="ins-glow2" cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill="url(#ins-bg2)" />
      <rect width="400" height="200" fill="url(#ins-glow2)" />
      {/* Central chip */}
      <rect x="152" y="68" width="96" height="64" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.65)" strokeWidth="1.8" rx="5" />
      {/* Inner chip detail */}
      <rect x="165" y="80" width="70" height="40" fill="none" stroke="rgba(201,168,76,0.30)" strokeWidth="1" rx="2" />
      {/* Left pins */}
      {[82, 96, 110].map((y, i) => (
        <line key={`l-${i}`} x1="125" y1={y} x2="152" y2={y} stroke="rgba(201,168,76,0.45)" strokeWidth="1.5" />
      ))}
      {/* Right pins */}
      {[82, 96, 110].map((y, i) => (
        <line key={`r-${i}`} x1="248" y1={y} x2="275" y2={y} stroke="rgba(201,168,76,0.45)" strokeWidth="1.5" />
      ))}
      {/* Top pins */}
      {[175, 200, 225].map((x, i) => (
        <line key={`t-${i}`} x1={x} y1="50" x2={x} y2="68" stroke="rgba(201,168,76,0.45)" strokeWidth="1.5" />
      ))}
      {/* Bottom pins */}
      {[175, 200, 225].map((x, i) => (
        <line key={`b-${i}`} x1={x} y1="132" x2={x} y2="150" stroke="rgba(201,168,76,0.45)" strokeWidth="1.5" />
      ))}
      <text x="200" y="105" textAnchor="middle" fill="rgba(201,168,76,0.85)" fontSize="18" fontFamily="monospace" fontWeight="bold">AI</text>
      <rect width="400" height="200" fill="rgba(4,10,18,0.18)" />
    </svg>
  );
}

function InsightVisual3() {
  // Column widths & heights for a building facade feel
  const cols = [
    { x: 136, h: 105, y: 65 },
    { x: 158, h: 118, y: 52 },
    { x: 180, h: 128, y: 42 },
    { x: 202, h: 135, y: 35 },
    { x: 224, h: 128, y: 42 },
    { x: 246, h: 118, y: 52 },
    { x: 268, h: 105, y: 65 },
  ];
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="ins-bg3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d1e2e" /><stop offset="100%" stopColor="#0a1925" />
        </linearGradient>
        <radialGradient id="ins-glow3" cx="50%" cy="60%" r="45%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill="url(#ins-bg3)" />
      <rect width="400" height="200" fill="url(#ins-glow3)" />
      {/* Architrave top line */}
      <line x1="128" y1="170" x2="286" y2="170" stroke="rgba(201,168,76,0.70)" strokeWidth="2.5" />
      {/* Stylobate base */}
      <line x1="120" y1="178" x2="295" y2="178" stroke="rgba(201,168,76,0.50)" strokeWidth="1.5" />
      {/* Columns */}
      {cols.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width="14" height={c.h}
          fill="rgba(201,168,76,0.07)" stroke="rgba(201,168,76,0.60)" strokeWidth="1.4" />
      ))}
      {/* Capital caps */}
      {cols.map((c, i) => (
        <line key={`cap-${i}`} x1={c.x - 2} y1={c.y} x2={c.x + 16} y2={c.y}
          stroke="rgba(201,168,76,0.55)" strokeWidth="2" />
      ))}
      {/* Top pediment */}
      <path d="M128 42 L202 20 L276 42" fill="none" stroke="rgba(201,168,76,0.40)" strokeWidth="1.5" />
      <rect width="400" height="200" fill="rgba(4,10,18,0.18)" />
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
