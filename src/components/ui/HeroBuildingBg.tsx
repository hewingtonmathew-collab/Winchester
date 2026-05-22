export default function HeroBuildingBg() {
  // Deterministic lit-window data [x, y, w, h, warm_opacity]
  const litWindows: [number, number, number, number, number][] = [
    // Row 0 (y≈52)
    [730, 52, 58, 40, 0.22], [854, 52, 58, 40, 0.16], [978, 52, 58, 40, 0.28],
    [1040, 52, 58, 40, 0.12], [1164, 52, 58, 40, 0.20], [1288, 52, 58, 40, 0.14],
    // Row 1 (y≈148)
    [668, 148, 58, 40, 0.10], [792, 148, 58, 40, 0.26], [978, 148, 58, 40, 0.18],
    [1102, 148, 58, 40, 0.22], [1226, 148, 58, 40, 0.16], [1350, 148, 58, 40, 0.12],
    // Row 2 (y≈244)
    [730, 244, 58, 40, 0.30], [854, 244, 58, 40, 0.24], [916, 244, 58, 40, 0.08],
    [1040, 244, 58, 40, 0.20], [1164, 244, 58, 40, 0.26], [1288, 244, 58, 40, 0.14],
    // Row 3 (y≈340)
    [668, 340, 58, 40, 0.16], [854, 340, 58, 40, 0.22], [1040, 340, 58, 40, 0.28],
    [1102, 340, 58, 40, 0.10], [1226, 340, 58, 40, 0.18], [1350, 340, 58, 40, 0.20],
    // Row 4 (y≈436)
    [792, 436, 58, 40, 0.24], [916, 436, 58, 40, 0.14], [1040, 436, 58, 40, 0.18],
    [1164, 436, 58, 40, 0.22], [1288, 436, 58, 40, 0.16],
    // Row 5 (y≈532)
    [668, 532, 58, 40, 0.12], [854, 532, 58, 40, 0.20], [978, 532, 58, 40, 0.26],
    [1102, 532, 58, 40, 0.14], [1350, 532, 58, 40, 0.10],
    // Row 6 (y≈628)
    [730, 628, 58, 40, 0.18], [916, 628, 58, 40, 0.22], [1164, 628, 58, 40, 0.16],
    [1288, 628, 58, 40, 0.12],
  ];

  const warmColor = "#c8a840";
  const cols = [480, 542, 604, 666, 728, 790, 852, 914, 976, 1038, 1100, 1162, 1224, 1286, 1348, 1410];
  const rows = [0, 96, 192, 288, 384, 480, 576, 672, 768, 864];

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hbg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#050c14" />
          <stop offset="40%" stopColor="#08111c" />
          <stop offset="100%" stopColor="#0c1928" />
        </linearGradient>

        {/* Window glass fill */}
        <linearGradient id="win-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1e2e" />
          <stop offset="100%" stopColor="#091420" />
        </linearGradient>

        {/* Left text-area vignette */}
        <linearGradient id="lv" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#050c14" stopOpacity="1" />
          <stop offset="28%"  stopColor="#050c14" stopOpacity="0.93" />
          <stop offset="50%"  stopColor="#050c14" stopOpacity="0.60" />
          <stop offset="68%"  stopColor="#050c14" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#050c14" stopOpacity="0" />
        </linearGradient>

        {/* Edge vignette */}
        <radialGradient id="ev" cx="55%" cy="50%" r="65%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="100%" stopColor="#040a11" stopOpacity="0.70" />
        </radialGradient>

        {/* Warm glow blobs */}
        <radialGradient id="glow1" cx="74%" cy="38%" r="32%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={warmColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={warmColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow2" cx="90%" cy="60%" r="25%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={warmColor} stopOpacity="0.12" />
          <stop offset="100%" stopColor={warmColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow3" cx="62%" cy="72%" r="22%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={warmColor} stopOpacity="0.09" />
          <stop offset="100%" stopColor={warmColor} stopOpacity="0" />
        </radialGradient>

        {/* Top + bottom fades */}
        <linearGradient id="top-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#050c14" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#050c14" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bot-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#050c14" stopOpacity="0" />
          <stop offset="100%" stopColor="#050c14" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* ── Base ── */}
      <rect width="1440" height="900" fill="url(#hbg)" />

      {/* ── Window panels (dark glass) ── */}
      {rows.flatMap((ry, ri) =>
        cols.map((cx, ci) => (
          <rect
            key={`w-${ri}-${ci}`}
            x={cx + 1} y={ry + 1}
            width={60} height={94}
            fill="url(#win-fill)"
            opacity={0.75}
          />
        ))
      )}

      {/* ── Structural frame — heavy vertical columns ── */}
      {[480, 666, 852, 1038, 1224, 1410].map((x) => (
        <line key={`vc-${x}`} x1={x} y1={0} x2={x} y2={900}
          stroke="rgba(28,42,58,0.90)" strokeWidth="4" />
      ))}
      {/* Mid verticals */}
      {cols.map((x) => (
        <line key={`vf-${x}`} x1={x} y1={0} x2={x} y2={900}
          stroke="rgba(35,52,68,0.50)" strokeWidth="1" />
      ))}

      {/* ── Structural frame — floor slabs ── */}
      {[0, 96, 192, 288, 384, 480, 576, 672, 768, 864].map((y) => (
        <line key={`hf-${y}`} x1={480} y1={y} x2={1440} y2={y}
          stroke="rgba(28,42,58,0.80)" strokeWidth="3" />
      ))}

      {/* ── Lit windows (warm amber) ── */}
      {litWindows.map(([x, y, w, h, op], i) => (
        <rect key={`lw-${i}`} x={x} y={y} width={w} height={h}
          fill={warmColor} opacity={op} rx="0" />
      ))}

      {/* ── Atmospheric warm glows ── */}
      <rect width="1440" height="900" fill="url(#glow1)" />
      <rect width="1440" height="900" fill="url(#glow2)" />
      <rect width="1440" height="900" fill="url(#glow3)" />

      {/* ── Vignettes ── */}
      <rect width="1440" height="900" fill="url(#lv)" />
      <rect width="1440" height="900" fill="url(#ev)" />
      <rect width="1440" height="120" fill="url(#top-fade)" />
      <rect x="0" y="780" width="1440" height="120" fill="url(#bot-fade)" />
    </svg>
  );
}
