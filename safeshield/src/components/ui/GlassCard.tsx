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
        "glass rounded-2xl p-6",
        hover && "glass-hover",
        shimmer && "glass-shimmer",
        glow && "shadow-[0_0_48px_var(--accent-glow)]",
        className
      )}
    >
      {children}
    </div>
  );
}
