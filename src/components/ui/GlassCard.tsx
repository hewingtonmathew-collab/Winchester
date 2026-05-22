import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "section";
};

export default function GlassCard({
  children,
  className,
  hover = false,
  as: Tag = "div",
}: Props) {
  return (
    <Tag
      className={cn(
        "glass p-6",
        hover && [
          "transition-all duration-300 cursor-default",
          "hover:-translate-y-1",
          "hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
          "hover:border-[rgba(201,168,76,0.35)]",
        ],
        className
      )}
    >
      {children}
    </Tag>
  );
}
