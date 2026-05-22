import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: number;
  variant?: "full" | "mark-only";
};

export default function ShieldLogo({ className, size = 40, variant = "full" }: Props) {
  const h = Math.round(size * 1.15);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        width={size}
        height={h}
        viewBox="0 0 40 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Shield outline */}
        <path
          d="M20 2L38 9V24C38 34 29 42 20 44C11 42 2 34 2 24V9L20 2Z"
          fill="rgba(27,36,48,0.85)"
          stroke="#C9A84C"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Vertical pillar bars — graduated heights, tallest centre */}
        <rect x="7.5"  y="20" width="3.5" height="13" rx="0.5" fill="#C9A84C" opacity="0.85" />
        <rect x="13"   y="16" width="3.5" height="17" rx="0.5" fill="#C9A84C" opacity="0.90" />
        <rect x="18.5" y="13" width="3.5" height="20" rx="0.5" fill="#C9A84C" />
        <rect x="24"   y="16" width="3.5" height="17" rx="0.5" fill="#C9A84C" opacity="0.90" />
        <rect x="29"   y="20" width="3.5" height="13" rx="0.5" fill="#C9A84C" opacity="0.85" />
        {/* Top cap line */}
        <line x1="7.5" y1="11" x2="32.5" y2="11" stroke="#C9A84C" strokeWidth="1" opacity="0.60" />
      </svg>

      {variant === "full" && (
        <div className="flex flex-col leading-none gap-0.5">
          <span className="font-cinzel font-bold text-white tracking-[0.12em] text-sm uppercase whitespace-nowrap">
            Winchester Consultancy
          </span>
          <span
            className="font-inter text-[0.58rem] tracking-[0.18em] uppercase whitespace-nowrap"
            style={{ color: "#C9A84C" }}
          >
            School Compliance Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
