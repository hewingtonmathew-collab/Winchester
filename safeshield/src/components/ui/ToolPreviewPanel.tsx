"use client";
import Link from "next/link";

type Props = {
  toolSlug: string;
  color: string;
  toolName: string;
};

const SAMPLE_AREAS = [
  { label: "Policy & Procedures", score: 80 },
  { label: "Staff Training", score: 65 },
  { label: "Digital Systems", score: 78 },
  { label: "Documentation", score: 60 },
];

const SAMPLE_RECS = [
  { priority: "high", text: "Update your acceptable use policy to include AI tools and ensure all staff have signed the revised version." },
  { priority: "medium", text: "Schedule a half-termly review of filtering logs and assign a named DSL deputy to oversee monitoring." },
  { priority: "low", text: "Consider adding a governor link role for digital and online safety to strengthen oversight and accountability." },
];

const PRIORITY_COLORS: Record<string, string> = {
  high: "#F87171",
  medium: "#FCD34D",
  low: "#34D399",
};

// SVG circle gauge helpers
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SCORE = 72;
const DASH = (SCORE / 100) * CIRCUMFERENCE;

export default function ToolPreviewPanel({ toolSlug, color, toolName }: Props) {
  void toolSlug; // used by parent for context

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-8">

      {/* Score gauge */}
      <div className="flex flex-col items-center gap-3">
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ overflow: "visible" }}>
          {/* Track */}
          <circle
            cx="70" cy="70" r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />
          {/* Progress arc */}
          <circle
            cx="70" cy="70" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${DASH} ${CIRCUMFERENCE}`}
            strokeDashoffset={CIRCUMFERENCE * 0.25}
            transform="rotate(-90 70 70)"
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
          {/* Score text */}
          <text
            x="70" y="67"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="28"
            fontWeight="700"
            fill="var(--text)"
            fontFamily="inherit"
          >
            {SCORE}
          </text>
          <text
            x="70" y="90"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fill="var(--text-muted)"
            fontFamily="inherit"
          >
            / 100
          </text>
        </svg>
        <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Example Score</p>
      </div>

      {/* 2x2 area cards */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>Assessment Areas</h2>
        <div className="grid grid-cols-2 gap-3">
          {SAMPLE_AREAS.map((area) => (
            <div
              key={area.label}
              className="rounded-2xl p-4"
              style={{
                background: "var(--glass-fill)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(22px) saturate(160%)",
              }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--text)" }}>{area.label}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${area.score}%`, background: color, boxShadow: `0 0 6px ${color}60` }}
                  />
                </div>
                <span className="text-xs font-bold tabular-nums" style={{ color }}>{area.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample recommendations with blur overlay */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>Sample Recommendations</h2>
        <div className="relative">
          {/* Cards */}
          <div className="flex flex-col gap-3">
            {SAMPLE_RECS.map((rec, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 flex items-start gap-3"
                style={{
                  background: "var(--glass-fill)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(22px) saturate(160%)",
                }}
              >
                <span
                  className="text-[10px] font-bold uppercase px-2 py-1 rounded-full shrink-0 mt-0.5"
                  style={{
                    background: `${PRIORITY_COLORS[rec.priority]}18`,
                    border: `1px solid ${PRIORITY_COLORS[rec.priority]}40`,
                    color: PRIORITY_COLORS[rec.priority],
                  }}
                >
                  {rec.priority}
                </span>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{rec.text}</p>
              </div>
            ))}
          </div>
          {/* Blur overlay — covers lower 2/3 */}
          <div
            className="absolute inset-x-0 bottom-0 rounded-2xl"
            style={{
              top: "28%",
              backdropFilter: "blur(5px)",
              background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)",
              zIndex: 1,
            }}
          />
        </div>
      </div>

      {/* Frosted glass CTA */}
      <div
        className="rounded-3xl p-8 flex flex-col items-center text-center gap-5"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(22px) saturate(160%)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.28)",
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Ready to assess your school?</h3>
          <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--text-muted)" }}>
            Create your free account to run a full {toolName} assessment and get your actual score.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link
            href="/register"
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-center transition-all"
            style={{
              background: `${color}20`,
              border: `1px solid ${color}45`,
              color,
            }}
          >
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-center transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--text-muted)",
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
