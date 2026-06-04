import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function GlassCard({ children, className, hover, glow }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6",
        hover && "glass-hover cursor-default",
        glow && "shadow-[0_0_32px_rgba(56,189,248,0.12)]",
        className
      )}
    >
      {children}
    </div>
  );
}
