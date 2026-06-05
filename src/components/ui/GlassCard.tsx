import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "section";
  variant?: "subtle" | "default" | "prominent";
};

const variantClass: Record<NonNullable<Props["variant"]>, string> = {
  subtle: "glass-subtle",
  default: "glass",
  prominent: "glass-prominent",
};

export default function GlassCard({
  children,
  className,
  hover = false,
  as: Tag = "div",
  variant = "default",
}: Props) {
  return (
    <Tag
      className={cn(
        variantClass[variant],
        "p-6",
        "[transform:translateZ(0)]",
        hover && [
          "transition-all duration-300 cursor-default",
          "hover:-translate-y-1",
          "hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]",
          "hover:border-[rgba(201,168,76,0.30)]",
        ],
        className
      )}
    >
      {children}
    </Tag>
  );
}
