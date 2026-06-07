"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
}

interface ParticleCanvasProps {
  className?: string;
  count?: number;
  /** RGB triplet string, e.g. "0,212,255" */
  rgb?: string;
  connectDist?: number;
  speed?: number;
}

export default function ParticleCanvas({
  className,
  count = 72,
  rgb = "0,212,255",
  connectDist = 150,
  speed = 0.28,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.scale(dpr, dpr);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const pts: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
      r: Math.random() * 1.4 + 0.6,
      alpha: Math.random() * 0.35 + 0.15,
    }));

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > h) { p.y = h; p.vy *= -1; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${p.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < connectDist) {
            const t = 1 - d / connectDist;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${rgb},${t * 0.14})`;
            ctx.lineWidth = t * 0.8;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    frame();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [count, rgb, connectDist, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full", className)}
      aria-hidden="true"
    />
  );
}
