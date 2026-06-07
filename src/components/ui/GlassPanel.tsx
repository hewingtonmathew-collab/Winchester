import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "active" | "error" | "hover" | "premium";
  hudCorners?: boolean;
  hudCornersAll?: boolean;
  topEdgeGlow?: boolean;
  as?: "div" | "article" | "section" | "li";
}

export default function GlassPanel({
  children,
  className,
  variant = "default",
  hudCorners = false,
  hudCornersAll = false,
  topEdgeGlow = false,
  as: Tag = "div",
}: GlassPanelProps) {
  const needsPositioning = topEdgeGlow || hudCorners;

  return (
    <Tag
      className={cn(
        "glass-panel",
        variant === "active" && "glass-panel-active",
        variant === "error" && "glass-panel-error",
        variant === "hover" && "glass-panel-hover",
        variant === "premium" && "glass-panel-premium",
        hudCorners && "hud-corners",
        hudCornersAll && "hud-corners-all",
        needsPositioning && "relative overflow-hidden",
        className
      )}
    >
      {topEdgeGlow && (
        <div
          aria-hidden="true"
          className="absolute top-0 left-[8%] right-[8%] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.55) 30%, rgba(168,232,255,0.8) 50%, rgba(0,212,255,0.55) 70%, transparent 100%)",
            boxShadow: "0 0 6px rgba(0,212,255,0.3)",
          }}
        />
      )}
      {children}
    </Tag>
  );
}
