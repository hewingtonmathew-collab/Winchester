import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "active" | "error" | "hover";
  hudCorners?: boolean;
  topEdgeGlow?: boolean;
  as?: "div" | "article" | "section" | "li";
}

export default function GlassPanel({
  children,
  className,
  variant = "default",
  hudCorners = false,
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
        hudCorners && "hud-corners",
        needsPositioning && "relative overflow-hidden",
        className
      )}
    >
      {topEdgeGlow && (
        <div
          aria-hidden="true"
          className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary-container/50 to-transparent"
        />
      )}
      {children}
    </Tag>
  );
}
