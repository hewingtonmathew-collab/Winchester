import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: number;
  variant?: "full" | "mark-only";
};

export default function ShieldLogo({ className, size = 40, variant = "full" }: Props) {
  const h = Math.round(size * 1.18);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        width={size}
        height={h}
        viewBox="0 0 56 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer shield — classic crest shape */}
        <path
          d="M28 3L53 11.5V31C53 45 41.5 58.5 28 63C14.5 58.5 3 45 3 31V11.5L28 3Z"
          fill="rgba(11,17,24,0.92)"
          stroke="rgba(201,168,76,0.85)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Inner shield border */}
        <path
          d="M28 7.5L48.5 15V31C48.5 43 38.5 55 28 59C17.5 55 7.5 43 7.5 31V15L28 7.5Z"
          fill="none"
          stroke="rgba(201,168,76,0.22)"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* Horizontal cap/architrave bar */}
        <line x1="12" y1="19" x2="44" y2="19" stroke="rgba(201,168,76,0.7)" strokeWidth="0.9" strokeLinecap="round" />

        {/* Horizontal base/stylobate */}
        <line x1="12" y1="44" x2="44" y2="44" stroke="rgba(201,168,76,0.7)" strokeWidth="0.9" strokeLinecap="round" />

        {/* 5 vertical columns — graduated heights, centre tallest, outline style */}
        {/* Far left */}
        <rect x="12"   y="30" width="4" height="14" rx="0.4" fill="none" stroke="rgba(201,168,76,0.70)" strokeWidth="0.9" />
        {/* Left */}
        <rect x="18.5" y="25" width="4" height="19" rx="0.4" fill="none" stroke="rgba(201,168,76,0.80)" strokeWidth="0.9" />
        {/* Centre — tallest, full opacity */}
        <rect x="25.5" y="20" width="5" height="24" rx="0.4" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,1)"   strokeWidth="1.2" />
        {/* Right */}
        <rect x="33.5" y="25" width="4" height="19" rx="0.4" fill="none" stroke="rgba(201,168,76,0.80)" strokeWidth="0.9" />
        {/* Far right */}
        <rect x="40"   y="30" width="4" height="14" rx="0.4" fill="none" stroke="rgba(201,168,76,0.70)" strokeWidth="0.9" />

        {/* Column cap decorations — small horizontal dashes at top of each column */}
        <line x1="12"   y1="30" x2="16"   y2="30" stroke="rgba(201,168,76,0.5)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="18.5" y1="25" x2="22.5" y2="25" stroke="rgba(201,168,76,0.6)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="25.5" y1="20" x2="30.5" y2="20" stroke="rgba(201,168,76,0.9)" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="33.5" y1="25" x2="37.5" y2="25" stroke="rgba(201,168,76,0.6)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="40"   y1="30" x2="44"   y2="30" stroke="rgba(201,168,76,0.5)" strokeWidth="1.2" strokeLinecap="round" />

        {/* Gold glow accent on centre column top */}
        <circle cx="28" cy="20" r="1.5" fill="rgba(201,168,76,0.4)" />
      </svg>

      {variant === "full" && (
        <div className="flex flex-col leading-none gap-[3px]">
          <span className="font-cinzel font-bold text-white tracking-[0.14em] text-[0.82rem] uppercase whitespace-nowrap">
            Winchester
          </span>
          <span className="font-cinzel font-bold text-white tracking-[0.14em] text-[0.82rem] uppercase whitespace-nowrap">
            Consultancy
          </span>
          <span
            className="font-inter text-[0.5rem] tracking-[0.2em] uppercase whitespace-nowrap mt-[1px]"
            style={{ color: "#C9A84C" }}
          >
            School Compliance Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
