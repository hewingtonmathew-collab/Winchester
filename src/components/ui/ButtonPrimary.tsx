import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  download?: boolean;
};

export default function ButtonPrimary({
  href,
  children,
  className,
  external,
  download,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
        "bg-[rgba(27,36,48,0.9)] border border-[#2A3340]",
        "text-white font-inter font-medium text-sm tracking-wide",
        "transition-all duration-200 ease-out",
        "hover:bg-[#2A3340] hover:border-[rgba(201,168,76,0.5)] hover:shadow-[0_0_20px_rgba(201,168,76,0.12)]",
        "group",
        className
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: true } : {})}
    >
      {children}
      <ArrowRight
        size={15}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  );
}
