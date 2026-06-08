import ToolIconWrapper from "./ToolIconWrapper";

interface ToolPageHeaderProps {
  slug: string;
  icon: React.ComponentType<{ size?: number }>;
  badge: string;
  title: string;
  description: string;
  color: string;
}

export default function ToolPageHeader({ slug, icon, badge, title, description, color }: ToolPageHeaderProps) {
  return (
    <div className="pt-10 pb-10 rise-in">
      <div className="flex items-center gap-4 mb-5">
        <ToolIconWrapper slug={slug} Icon={icon} size={72} />
        <span
          className="text-[0.62rem] font-black uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border"
          style={{ color, background: `${color}14`, borderColor: `${color}35` }}
        >
          {badge}
        </span>
      </div>

      <h1 className="heading-luxury text-3xl sm:text-4xl mb-3" style={{ color: "var(--text)" }}>
        {title}
      </h1>

      <div className="h-0.5 w-16 rounded-full mb-4"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <p className="text-sm leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </div>
  );
}
