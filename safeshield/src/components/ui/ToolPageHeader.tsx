import type { LucideIcon } from "lucide-react";

interface ToolPageHeaderProps {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  color: string;
}

export default function ToolPageHeader({ icon: Icon, badge, title, description, color }: ToolPageHeaderProps) {
  const colorDim   = `${color}18`;
  const colorBorder = `${color}35`;
  const colorGlow  = `${color}40`;

  return (
    <div className="pt-10 pb-10 rise-in">
      {/* Icon + badge row */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 icon-pulse"
          style={{
            background: colorDim,
            border: `1px solid ${colorBorder}`,
            boxShadow: `0 0 24px ${colorGlow}`,
            "--icon-glow": colorGlow,
          } as React.CSSProperties}
        >
          <Icon size={30} style={{ color }} strokeWidth={1.5} />
        </div>
        <span
          className="text-[0.62rem] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border"
          style={{ color, background: colorDim, borderColor: colorBorder }}
        >
          {badge}
        </span>
      </div>

      {/* Title */}
      <h1 className="heading-luxury text-3xl sm:text-4xl mb-3" style={{ color: "var(--text)" }}>
        {title}
      </h1>

      {/* Accent rule */}
      <div
        className="h-0.5 w-16 rounded-full mb-4"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />

      {/* Description */}
      <p className="text-sm leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </div>
  );
}
