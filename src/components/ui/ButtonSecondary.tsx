import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function ButtonSecondary({ href, children, className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
        "border border-[#2A3340] text-[#A7B1BE]",
        "font-inter font-medium text-sm tracking-wide",
        "transition-all duration-200",
        "hover:border-[#A7B1BE] hover:text-white",
        className
      )}
    >
      {children}
    </Link>
  );
}
