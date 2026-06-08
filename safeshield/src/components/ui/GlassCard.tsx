import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  shimmer?: boolean;
}

export default function GlassCard({ children, className, hover, glow, shimmer }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 relative overflow-hidden",
        hover && "glass-hover cursor-default",
        glow && "shadow-[0_0_32px_rgba(56,189,248,0.12)]",
        className
      )}
    >
      {shimmer && <span className="shimmer-run" aria-hidden />}
      {children}
    </div>
  );
}
