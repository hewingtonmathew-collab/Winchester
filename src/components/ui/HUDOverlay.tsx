"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface HUDOverlayProps {
  className?: string;
  intensity?: "low" | "medium" | "high";
  scanLine?: boolean;
  corners?: boolean;
  dataReadouts?: boolean;
}

const readouts = [
  { label: "SYS", value: "ACTIVE" },
  { label: "ENC", value: "AES-256" },
  { label: "NET", value: "SECURE" },
  { label: "CHK", value: "PASS" },
];

export default function HUDOverlay({
  className,
  intensity = "medium",
  scanLine = true,
  corners = true,
  dataReadouts = true,
}: HUDOverlayProps) {
  const scanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scanLine || !scanRef.current) return;
    const el = scanRef.current;
    el.style.animation = `hud-scan ${intensity === "high" ? "5s" : intensity === "medium" ? "8s" : "12s"} linear infinite`;
  }, [scanLine, intensity]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* ── Corner brackets ── */}
      {corners && (
        <>
          {/* Top-left */}
          <svg className="absolute top-4 left-4 w-8 h-8 opacity-60" viewBox="0 0 32 32" fill="none">
            <path d="M0 16 L0 0 L16 0" stroke="rgba(0,212,255,0.8)" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="2" fill="rgba(0,212,255,0.6)" />
          </svg>
          {/* Top-right */}
          <svg className="absolute top-4 right-4 w-8 h-8 opacity-60" viewBox="0 0 32 32" fill="none">
            <path d="M32 16 L32 0 L16 0" stroke="rgba(0,212,255,0.8)" strokeWidth="1.2" />
            <circle cx="32" cy="0" r="2" fill="rgba(0,212,255,0.6)" />
          </svg>
          {/* Bottom-left */}
          <svg className="absolute bottom-4 left-4 w-8 h-8 opacity-60" viewBox="0 0 32 32" fill="none">
            <path d="M0 16 L0 32 L16 32" stroke="rgba(0,212,255,0.8)" strokeWidth="1.2" />
            <circle cx="0" cy="32" r="2" fill="rgba(0,212,255,0.6)" />
          </svg>
          {/* Bottom-right */}
          <svg className="absolute bottom-4 right-4 w-8 h-8 opacity-60" viewBox="0 0 32 32" fill="none">
            <path d="M32 16 L32 32 L16 32" stroke="rgba(0,212,255,0.8)" strokeWidth="1.2" />
            <circle cx="32" cy="32" r="2" fill="rgba(0,212,255,0.6)" />
          </svg>
        </>
      )}

      {/* ── Scan line ── */}
      {scanLine && (
        <div
          ref={scanRef}
          className="absolute left-0 right-0 h-[2px] opacity-0"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.0) 10%, rgba(168,232,255,0.55) 40%, rgba(0,212,255,0.8) 50%, rgba(168,232,255,0.55) 60%, rgba(0,212,255,0.0) 90%, transparent 100%)",
            boxShadow: "0 0 16px rgba(0,212,255,0.6), 0 0 40px rgba(0,212,255,0.2)",
          }}
        />
      )}

      {/* ── Data readouts — bottom-left ── */}
      {dataReadouts && (
        <div className="absolute bottom-5 left-5 flex flex-col gap-1 opacity-40">
          {readouts.map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className="text-[8px] font-mono font-bold tracking-[0.14em] text-on-surface-variant/60 uppercase w-7">
                {r.label}
              </span>
              <span className="text-[8px] font-mono tracking-[0.1em] text-primary/80">{r.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Timestamp — bottom-right ── */}
      {dataReadouts && (
        <LiveTimestamp />
      )}

      {/* ── Top horizontal rule ── */}
      <div
        className="absolute top-12 left-8 right-8 h-px opacity-20"
        style={{ background: "linear-gradient(90deg, rgba(0,212,255,0.0), rgba(0,212,255,0.7) 20%, rgba(0,212,255,0.7) 80%, rgba(0,212,255,0.0))" }}
      />
    </div>
  );
}

function LiveTimestamp() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const update = () => {
      if (ref.current) {
        const now = new Date();
        ref.current.textContent = now.toISOString().replace("T", " ").slice(0, 19) + " UTC";
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute bottom-5 right-5 opacity-35">
      <span
        ref={ref}
        className="text-[8px] font-mono tracking-[0.08em] text-primary/70"
      />
    </div>
  );
}
