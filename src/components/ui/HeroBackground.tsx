"use client";

import { cn } from "@/lib/utils";

interface HeroBackgroundProps {
  className?: string;
  intensity?: "subtle" | "normal" | "intense";
  showOrbs?: boolean;
  showGrid?: boolean;
  children?: React.ReactNode;
}

interface FloatOrbProps {
  size: number;
  style?: React.CSSProperties;
}

function FloatOrb({ size, style }: FloatOrbProps) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        animation: "aurora-float ease-in-out infinite",
        animationDuration: `${9 + size / 35}s`,
        background:
          "radial-gradient(circle at 32% 32%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.09) 30%, rgba(168,232,255,0.05) 60%, transparent 80%)",
        backdropFilter: "blur(14px)",
        border: "0.75px solid rgba(255,255,255,0.16)",
        borderTop: "0.75px solid rgba(255,255,255,0.32)",
        boxShadow: `inset 0 2px 0 rgba(255,255,255,0.24), inset 0 0 ${size * 0.25}px rgba(168,232,255,0.07), 0 ${size * 0.06}px ${size * 0.2}px rgba(0,0,0,0.3)`,
        ...style,
      }}
    />
  );
}

const intensityScale: Record<NonNullable<HeroBackgroundProps["intensity"]>, number> = {
  subtle: 0.55,
  normal: 1.0,
  intense: 1.4,
};

export default function HeroBackground({
  className,
  intensity = "normal",
  showOrbs = true,
  showGrid = true,
  children,
}: HeroBackgroundProps) {
  const scale = intensityScale[intensity];

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      aria-hidden="true"
    >
      {/* Base layer */}
      <div className="absolute inset-0 bg-[#06080e]" />

      {/* Aurora gradient blobs */}
      {/* Blob 1 — cyan, top-left */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          top: "-10%",
          left: "-8%",
          borderRadius: "50%",
          background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)",
          filter: "blur(120px)",
          opacity: 0.11 * scale,
          animation: "aurora-1 20s ease-in-out infinite",
        }}
      />

      {/* Blob 2 — electric blue, top-right */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          top: "-5%",
          right: "-10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #bac3ff 0%, #023def 60%, transparent 100%)",
          filter: "blur(110px)",
          opacity: 0.09 * scale,
          animation: "aurora-2 24s ease-in-out infinite",
        }}
      />

      {/* Blob 3 — soft cyan/white, bottom-left */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          bottom: "-8%",
          left: "-5%",
          borderRadius: "50%",
          background: "radial-gradient(circle, #a8e8ff 0%, transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.07 * scale,
          animation: "aurora-3 28s ease-in-out infinite",
        }}
      />

      {/* Blob 4 — pure white, top-right area */}
      <div
        style={{
          position: "absolute",
          width: 450,
          height: 450,
          top: "15%",
          right: "20%",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
          filter: "blur(90px)",
          opacity: 0.05 * scale,
          animation: "aurora-4 16s ease-in-out infinite",
        }}
      />

      {/* Fine dot grid */}
      {showGrid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(0,212,255,0.16) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.65,
          }}
        />
      )}

      {/* Floating glass orbs */}
      {showOrbs && (
        <>
          <FloatOrb
            size={200}
            style={{ top: "10%", left: "3%", animationDelay: "0s" }}
          />
          <FloatOrb
            size={130}
            style={{ top: "58%", right: "6%", animationDelay: "-5s" }}
          />
          <FloatOrb
            size={90}
            style={{ top: "30%", left: "40%", animationDelay: "-10s" }}
          />
          <FloatOrb
            size={160}
            style={{ bottom: "8%", right: "22%", animationDelay: "-15s" }}
          />
        </>
      )}

      {children}

      <style>{`
        @keyframes aurora-1 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(-6%, 10%) scale(1.06); }
          66% { transform: translate(7%, -4%) scale(0.96); }
        }
        @keyframes aurora-2 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          40% { transform: translate(5%, -8%) scale(1.09); }
          70% { transform: translate(-7%, 5%) scale(0.93); }
        }
        @keyframes aurora-3 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          50% { transform: translate(9%, -6%) scale(1.04); }
        }
        @keyframes aurora-4 {
          0%, 100% { transform: translate(0%, 0%) scale(1) rotate(0deg); }
          25% { transform: translate(-4%, 6%) scale(1.07) rotate(2deg); }
          75% { transform: translate(5%, -3%) scale(0.96) rotate(-1deg); }
        }
        @keyframes aurora-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.03); }
        }
      `}</style>
    </div>
  );
}
