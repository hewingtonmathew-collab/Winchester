"use client";
import { useEffect, useRef, useState } from "react";
import { useSeasonalTheme } from "@/context/SeasonalThemeContext";

// Falling particle animation using canvas
function ParticleCanvas({ emoji, count }: { emoji: string; count: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!emoji || count === 0) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      speed: 0.4 + Math.random() * 0.8,
      sway: (Math.random() - 0.5) * 0.5,
      size: 12 + Math.random() * 10,
      opacity: 0.5 + Math.random() * 0.5,
      t: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.font = `${particles[0].size}px serif`;
      for (const p of particles) {
        p.t += 0.02;
        p.x += Math.sin(p.t) * p.sway;
        p.y += p.speed;
        if (p.y > canvas!.height) { p.y = -20; p.x = Math.random() * canvas!.width; }
        ctx!.globalAlpha = p.opacity;
        ctx!.fillText(emoji, p.x, p.y);
      }
      ctx!.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, [emoji, count]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.5 }} />;
}

type Props = {
  schoolName?: string | null;
  schoolLogo?: string | null;
  orgName?: string | null;
  orgLogo?: string | null;
  ethos?: string | null;
  isMat?: boolean;
};

export default function SeasonalBanner({ schoolName, schoolLogo, orgName, orgLogo, ethos, isMat }: Props) {
  const { activeTheme, assignment } = useSeasonalTheme();
  const [visible, setVisible] = useState(true);

  // Don't render if no active seasonal theme
  if (activeTheme.slug === "default") return null;
  if (!visible) return null;

  const { banner } = activeTheme;
  const bannerBg = assignment?.banner_url ? undefined : banner.gradient;
  const displayName = schoolName ?? orgName ?? "Your School";
  const displayLogo = schoolLogo ?? orgLogo ?? null;

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{
        background: bannerBg,
        minHeight: 120,
        borderBottom: `1px solid ${banner.accentColor}30`,
      }}
    >
      {/* Custom uploaded banner image */}
      {assignment?.banner_url && (
        <img
          src={assignment.banner_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.55 }}
        />
      )}

      {/* Particle layer */}
      {banner.particleEmoji && (
        <ParticleCanvas emoji={banner.particleEmoji} count={banner.particleCount} />
      )}

      {/* Gradient overlay for readability */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-4">
        {/* Logo */}
        {displayLogo && (
          <div
            className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center p-1 shrink-0"
            style={{ background: "rgba(255,255,255,0.12)", border: `1px solid ${banner.accentColor}50` }}
          >
            <img src={displayLogo} alt={displayName} className="w-full h-full object-contain" />
          </div>
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
          {isMat && orgName && (
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: banner.accentAlt }}>
              {orgName}
            </p>
          )}
          <h2
            className="text-xl sm:text-2xl font-bold truncate"
            style={{ color: banner.textColor, textShadow: `0 0 20px ${banner.accentColor}60` }}
          >
            {activeTheme.emoji} {displayName}
          </h2>
          {ethos && (
            <p className="text-sm italic mt-0.5 truncate" style={{ color: banner.accentAlt, opacity: 0.9 }}>
              &ldquo;{ethos}&rdquo;
            </p>
          )}
        </div>

        {/* Theme label pill */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <span
            className="text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              background: `${banner.accentColor}20`,
              border: `1px solid ${banner.accentColor}50`,
              color: banner.accentColor,
            }}
          >
            {activeTheme.label}
          </span>
          <button
            onClick={() => setVisible(false)}
            className="text-[0.6rem] text-white/40 hover:text-white/70 transition-colors"
          >
            dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
