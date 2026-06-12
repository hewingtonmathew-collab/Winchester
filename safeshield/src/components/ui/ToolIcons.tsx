/**
 * 3-D liquid-glass icon system — matches the SafeShield reference.
 * Each icon is a self-contained SVG with:
 *   • Rounded-rect glass container (gradient + border + specular)
 *   • CSS-var driven colours → adapts to dark / light mode automatically
 *   • Detailed stroke path that looks 3-D with highlights and fill layers
 */

interface IconProps { size?: number }

/* ─── shared container renderer ────────────────────────────────────────── */
function GlassContainer({ size, accentR, accentG, accentB, children }: {
  size: number;
  accentR: number; accentG: number; accentB: number;
  children: React.ReactNode;
}) {
  const id = `gc-${accentR}-${accentG}-${accentB}`;
  const r = 14 * (size / 64);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}>
      <defs>
        {/* container background gradient */}
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="var(--icon-bg-a)" />
          <stop offset="100%" stopColor="var(--icon-bg-b)" />
        </linearGradient>
        {/* top-left specular */}
        <radialGradient id={`sp-${id}`} cx="25%" cy="18%" r="45%" gradientUnits="userSpaceOnUse"
          gradientTransform={`scale(${size/64})`}>
          <stop offset="0%"   stopColor="var(--icon-top-shine)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* glow filter */}
        <filter id={`glow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* background */}
      <rect x="1" y="1" width="62" height="62" rx={r} fill={`url(#bg-${id})`} />

      {/* accent inner glow at bottom */}
      <rect x="1" y="30" width="62" height="33" rx={r}
        fill={`rgba(${accentR},${accentG},${accentB},0.08)`} />

      {/* border */}
      <rect x="0.5" y="0.5" width="63" height="63" rx={r + 0.5}
        stroke="var(--icon-border-c)" strokeWidth="1" fill="none" />

      {/* inner top border highlight */}
      <rect x="1.5" y="1.5" width="61" height="30" rx={r - 1}
        stroke="var(--icon-top-shine)" strokeWidth="0.7" fill="none" />

      {/* top-left specular blob */}
      <rect x="1" y="1" width="62" height="62" rx={r}
        fill={`url(#sp-${id})`} />

      {/* icon content */}
      {children}

      {/* bottom inner shadow */}
      <rect x="1" y="44" width="62" height="19" rx={r}
        fill="rgba(0,0,0,0.18)" />

      {/* outer glow rim (dark mode has blue, light mode subtle) */}
      <rect x="0" y="0" width="64" height="64" rx={r + 1}
        stroke={`rgba(${accentR},${accentG},${accentB},0.25)`}
        strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/* ─── individual icons ──────────────────────────────────────────────────── */

export function IconSafeguarding({ size = 64 }: IconProps) {
  return (
    <GlassContainer size={size} accentR={52} accentG={211} accentB={153}>
      {/* shield body */}
      <path d="M32 13L16 20v12c0 9.94 7.06 18.46 16 20.94C40.94 50.46 48 41.94 48 32V20L32 13Z"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.6" strokeLinejoin="round" />
      {/* highlight top-left on shield */}
      <path d="M32 13L16 20v6l16-7 16 7v-6L32 13Z"
        fill="var(--icon-top-shine)" opacity="0.3" />
      {/* checkmark */}
      <path d="M24 32l5.5 5.5L42 26"
        stroke="var(--icon-stroke-c)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 32l5.5 5.5L42 26"
        stroke="var(--icon-hi)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </GlassContainer>
  );
}

export function IconGovernance({ size = 64 }: IconProps) {
  return (
    <GlassContainer size={size} accentR={167} accentG={139} accentB={250}>
      {/* document */}
      <rect x="18" y="10" width="28" height="36" rx="3" fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.6" />
      <rect x="18" y="10" width="28" height="8" rx="3"
        fill="var(--icon-top-shine)" opacity="0.25" />
      {/* lines */}
      <path d="M24 22h16M24 28h16M24 34h10" stroke="var(--icon-stroke-c)" strokeWidth="1.5" strokeLinecap="round" />
      {/* seal */}
      <circle cx="42" cy="46" r="8" fill="var(--icon-bg-b)" stroke="var(--icon-stroke-c)" strokeWidth="1.4" />
      <path d="M38.5 46l2.5 2.5 5-5" stroke="var(--icon-stroke-c)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="42" cy="46" r="8" fill="var(--icon-top-shine)" opacity="0.15" />
    </GlassContainer>
  );
}

export function IconAIReadiness({ size = 64 }: IconProps) {
  return (
    <GlassContainer size={size} accentR={251} accentG={146} accentB={60}>
      {/* chip body */}
      <rect x="18" y="18" width="28" height="28" rx="4"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.6" />
      <rect x="18" y="18" width="28" height="10" rx="4"
        fill="var(--icon-top-shine)" opacity="0.2" />
      {/* pins left */}
      <path d="M18 25h-5M18 32h-5M18 39h-5" stroke="var(--icon-stroke-c)" strokeWidth="1.6" strokeLinecap="round" />
      {/* pins right */}
      <path d="M46 25h5M46 32h5M46 39h5" stroke="var(--icon-stroke-c)" strokeWidth="1.6" strokeLinecap="round" />
      {/* pins top */}
      <path d="M25 18v-5M32 18v-5M39 18v-5" stroke="var(--icon-stroke-c)" strokeWidth="1.6" strokeLinecap="round" />
      {/* pins bottom */}
      <path d="M25 46v5M32 46v5M39 46v5" stroke="var(--icon-stroke-c)" strokeWidth="1.6" strokeLinecap="round" />
      {/* inner chip */}
      <rect x="23" y="23" width="18" height="18" rx="2.5"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1" />
      {/* AI text */}
      <text x="32" y="35" textAnchor="middle" fontSize="9" fontWeight="900"
        fill="var(--icon-stroke-c)" fontFamily="system-ui, -apple-system, sans-serif">AI</text>
      <text x="32" y="35" textAnchor="middle" fontSize="9" fontWeight="900"
        fill="var(--icon-hi)" opacity="0.5" fontFamily="system-ui, -apple-system, sans-serif">AI</text>
    </GlassContainer>
  );
}

export function IconAIDetector({ size = 64 }: IconProps) {
  return (
    <GlassContainer size={size} accentR={56} accentG={189} accentB={248}>
      {/* scan frame corners */}
      <path d="M14 22v-8h8M42 14h8v8M50 42v8h-8M22 50h-8v-8"
        stroke="var(--icon-stroke-c)" strokeWidth="2" strokeLinecap="round" />
      {/* eye */}
      <ellipse cx="32" cy="32" rx="10" ry="7"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.6" />
      <circle cx="32" cy="32" r="4"
        fill="var(--icon-stroke-c)" opacity="0.9" />
      <circle cx="32" cy="32" r="4"
        fill="var(--icon-hi)" opacity="0.2" />
      {/* iris highlight */}
      <circle cx="30" cy="30.5" r="1.5" fill="var(--icon-hi)" opacity="0.8" />
      {/* scan lines */}
      <path d="M22 28h20M22 32h20M22 36h20"
        stroke="var(--icon-stroke-c)" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
    </GlassContainer>
  );
}

export function IconDPIA({ size = 64 }: IconProps) {
  return (
    <GlassContainer size={size} accentR={252} accentG={211} accentB={77}>
      {/* document */}
      <rect x="16" y="8" width="32" height="42" rx="3.5"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.6" />
      <rect x="16" y="8" width="32" height="10" rx="3.5"
        fill="var(--icon-top-shine)" opacity="0.25" />
      {/* lines */}
      <path d="M22 18h8M22 23h12" stroke="var(--icon-stroke-c)" strokeWidth="1.4" strokeLinecap="round" />
      {/* lock */}
      <rect x="24" y="31" width="16" height="13" rx="2.5"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.5" />
      <path d="M27 31v-4a5 5 0 0110 0v4" stroke="var(--icon-stroke-c)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="32" cy="37" r="2" fill="var(--icon-stroke-c)" />
      <line x1="32" y1="39" x2="32" y2="41" stroke="var(--icon-stroke-c)" strokeWidth="1.5" strokeLinecap="round" />
    </GlassContainer>
  );
}

export function IconAccessibility({ size = 64 }: IconProps) {
  return (
    <GlassContainer size={size} accentR={244} accentG={114} accentB={182}>
      {/* person head */}
      <circle cx="32" cy="14" r="5"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.6" />
      <circle cx="32" cy="14" r="5" fill="var(--icon-top-shine)" opacity="0.3" />
      {/* arms */}
      <path d="M13 27h38" stroke="var(--icon-stroke-c)" strokeWidth="2" strokeLinecap="round" />
      {/* body + legs */}
      <path d="M32 27v13M32 40l-7 11M32 40l7 11"
        stroke="var(--icon-stroke-c)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* orbit ring */}
      <ellipse cx="32" cy="32" rx="22" ry="22"
        stroke="var(--icon-stroke-c)" strokeWidth="1" strokeDasharray="4 3" opacity="0.35" />
    </GlassContainer>
  );
}

export function IconDigitalStandards({ size = 64 }: IconProps) {
  return (
    <GlassContainer size={size} accentR={129} accentG={140} accentB={248}>
      {/* monitor */}
      <rect x="10" y="14" width="44" height="28" rx="3"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.6" />
      <rect x="10" y="14" width="44" height="10" rx="3"
        fill="var(--icon-top-shine)" opacity="0.2" />
      {/* stand */}
      <path d="M24 42v7h16v-7" stroke="var(--icon-stroke-c)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 49h24" stroke="var(--icon-stroke-c)" strokeWidth="1.8" strokeLinecap="round" />
      {/* checkmark on screen */}
      <path d="M22 28l6 6 14-14" stroke="var(--icon-stroke-c)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 28l6 6 14-14" stroke="var(--icon-hi)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </GlassContainer>
  );
}

export function IconOfsted({ size = 64 }: IconProps) {
  return (
    <GlassContainer size={size} accentR={74} accentG={222} accentB={128}>
      {/* star */}
      <path d="M32 9l5.5 11.5 12.5 1.8-9 8.8 2.1 12.4L32 38l-11.1 5.5 2.1-12.4-9-8.8 12.5-1.8L32 9Z"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M32 9l5.5 11.5 3 0.4L32 10.5 32 9Z"
        fill="var(--icon-top-shine)" opacity="0.4" />
      {/* checkmark in centre */}
      <path d="M25 32l4.5 4.5L40 26"
        stroke="var(--icon-stroke-c)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 32l4.5 4.5L40 26"
        stroke="var(--icon-hi)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </GlassContainer>
  );
}

export function IconHealthSafety({ size = 64 }: IconProps) {
  return (
    <GlassContainer size={size} accentR={249} accentG={115} accentB={22}>
      {/* hard hat dome */}
      <path d="M12 38h40" stroke="var(--icon-stroke-c)" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 38v-2a16 16 0 0132 0v2Z"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.6" strokeLinejoin="round" />
      {/* hat highlight */}
      <path d="M20 32a12 12 0 0124 0"
        stroke="var(--icon-top-shine)" strokeWidth="1.2" opacity="0.5" fill="none" />
      {/* brim */}
      <rect x="10" y="38" width="44" height="6" rx="3"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.5" />
      <rect x="10" y="38" width="44" height="3" rx="2"
        fill="var(--icon-top-shine)" opacity="0.2" />
      {/* cross badge */}
      <rect x="26" y="46" width="12" height="12" rx="2"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.3" />
      <path d="M32 48.5v7M28.5 52h7" stroke="var(--icon-stroke-c)" strokeWidth="1.6" strokeLinecap="round" />
    </GlassContainer>
  );
}

/* ─── Policy Analyzer ───────────────────────────────────────────────────── */
export function IconPolicyAnalyzer({ size = 64 }: IconProps) {
  return (
    <GlassContainer size={size} accentR={167} accentG={139} accentB={250}>
      {/* document body */}
      <rect x="14" y="10" width="36" height="44" rx="4"
        fill="var(--icon-fill-a)" stroke="var(--icon-stroke-a)" strokeWidth="1.5" />
      <rect x="14" y="10" width="36" height="16" rx="4"
        fill="var(--icon-fill-b)" opacity="0.4" />
      {/* lines of text */}
      <line x1="20" y1="32" x2="44" y2="32" stroke="var(--icon-stroke-b)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="20" y1="37" x2="40" y2="37" stroke="var(--icon-stroke-b)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="20" y1="42" x2="36" y2="42" stroke="var(--icon-stroke-b)" strokeWidth="1.4" strokeLinecap="round" />
      {/* magnifier */}
      <circle cx="40" cy="44" r="8"
        fill="var(--icon-fill-c)" stroke="var(--icon-stroke-c)" strokeWidth="1.5" />
      <circle cx="40" cy="44" r="5"
        fill="none" stroke="var(--icon-stroke-a)" strokeWidth="1.3" />
      <line x1="44.5" y1="48.5" x2="48" y2="52"
        stroke="var(--icon-stroke-c)" strokeWidth="2" strokeLinecap="round" />
      {/* shine */}
      <path d="M18 14 Q22 12 28 14" stroke="var(--icon-top-shine)" strokeWidth="1" opacity="0.5" fill="none" />
    </GlassContainer>
  );
}
