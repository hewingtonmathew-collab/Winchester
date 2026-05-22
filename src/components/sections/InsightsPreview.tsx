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
          <stop offset="0%" stopColor="#0a1824" /><stop offset="100%" stopColor="#0d2035" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#ins-bg1)" />
      <circle cx="200" cy="100" r="60" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
      <circle cx="200" cy="100" r="40" fill="none" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
      <path d="M200 50 L220 62 L220 88 Q220 105 200 115 Q180 105 180 88 L180 62 Z" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth="1.5" />
      {[0,60,120,180,240,300].map((a, i) => (
        <line key={i} x1={200 + 40*Math.cos(a*Math.PI/180)} y1={100 + 40*Math.sin(a*Math.PI/180)}
          x2={200 + 70*Math.cos(a*Math.PI/180)} y2={100 + 70*Math.sin(a*Math.PI/180)}
          stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
      ))}
      <rect width="400" height="200" fill="rgba(5,12,20,0.3)" />
    </svg>
  );
}

function InsightVisual2() {
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="ins-bg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d1a28" /><stop offset="100%" stopColor="#0a1520" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#ins-bg2)" />
      <rect x="155" y="70" width="90" height="60" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" rx="4" />
      {[80,100,120].map((y,i) => (
        <line key={`l-${i}`} x1="130" y1={y} x2="155" y2={y} stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
      ))}
      {[80,100,120].map((y,i) => (
        <line key={`r-${i}`} x1="245" y1={y} x2="270" y2={y} stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
      ))}
      {[170,200,230].map((x,i) => (
        <line key={`t-${i}`} x1={x} y1="55" x2={x} y2="70" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
      ))}
      {[170,200,230].map((x,i) => (
        <line key={`b-${i}`} x1={x} y1="130" x2={x} y2="145" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
      ))}
      <text x="200" y="106" textAnchor="middle" fill="rgba(201,168,76,0.7)" fontSize="16" fontFamily="monospace" fontWeight="bold">AI</text>
      <rect width="400" height="200" fill="rgba(5,12,20,0.25)" />
    </svg>
  );
}

function InsightVisual3() {
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="ins-bg3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0c1a28" /><stop offset="100%" stopColor="#091625" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#ins-bg3)" />
      {[140,162,184,206,228,250].map((x,i) => (
        <rect key={i} x={x} y={70 + (i===0||i===5?15:i===1||i===4?8:0)} width="14" height={100-(i===0||i===5?15:i===1||i===4?8:0)} fill="none" stroke="rgba(201,168,76,0.55)" strokeWidth="1.2" />
      ))}
      <line x1="130" y1="70" x2="270" y2="70" stroke="rgba(201,168,76,0.6)" strokeWidth="2" />
      <line x1="130" y1="170" x2="270" y2="170" stroke="rgba(201,168,76,0.6)" strokeWidth="2" />
      <rect x="160" y="55" width="80" height="15" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="1" />
      <rect width="400" height="200" fill="rgba(5,12,20,0.3)" />
    </svg>
  );
}

const articleVisualComponents = [InsightVisual1, InsightVisual2, InsightVisual3];

export default function InsightsPreview() {
  return (
    <section className="py-24 bg-[#0B1118]" aria-labelledby="insights-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="relative w-full h-40 overflow-hidden">
                  {(() => { const V = articleVisualComponents[i % articleVisualComponents.length]; return <V />; })()}
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
