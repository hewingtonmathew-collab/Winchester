export default function HeroBuildingBg() {
  // Grid: columns start at x=480, spaced 62px. Rows start at y=0, spaced 96px.
  // Window panel = 58w × 90h, offset 2px from grid line.
  const colStart = 480;
  const colStep = 62;
  const rowStep = 96;
  const numCols = 16;
  const numRows = 10;

  // Lit window positions [colIndex, rowIndex, warm_opacity]
  // opacity 0.40-0.70 = brightly lit; 0.15-0.35 = softly lit; 0 = dark
  const litMap: Record<string, number> = {
    "1-0": 0.55, "3-0": 0.45, "5-0": 0.60, "7-0": 0.35, "9-0": 0.50, "12-0": 0.40, "14-0": 0.30,
    "0-1": 0.25, "2-1": 0.60, "4-1": 0.40, "6-1": 0.55, "8-1": 0.30, "10-1": 0.45, "13-1": 0.50, "15-1": 0.35,
    "1-2": 0.65, "3-2": 0.50, "5-2": 0.35, "7-2": 0.60, "9-2": 0.45, "11-2": 0.30, "14-2": 0.55,
    "0-3": 0.30, "2-3": 0.45, "4-3": 0.60, "6-3": 0.35, "8-3": 0.50, "10-3": 0.65, "12-3": 0.40, "15-3": 0.30,
    "1-4": 0.50, "3-4": 0.35, "5-4": 0.60, "7-4": 0.45, "9-4": 0.30, "11-4": 0.55, "13-4": 0.40,
    "0-5": 0.35, "2-5": 0.55, "4-5": 0.40, "6-5": 0.60, "8-5": 0.25, "10-5": 0.45, "14-5": 0.50,
    "1-6": 0.45, "3-6": 0.60, "5-6": 0.30, "9-6": 0.50, "11-6": 0.35, "15-6": 0.40,
    "2-7": 0.35, "4-7": 0.45, "6-7": 0.30, "8-7": 0.55, "12-7": 0.40,
  };

  const warmColor = "#c8a840";

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hbg2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#040b12" />
          <stop offset="38%"  stopColor="#070f18" />
          <stop offset="100%" stopColor="#0c1926" />
        </linearGradient>

        {/* Window glass — dark but slightly reflective */}
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0f1e2e" />
          <stop offset="100%" stopColor="#091420" />
        </linearGradient>

        {/* Warm lit window fill */}
        <linearGradient id="lit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e8c060" />
          <stop offset="50%"  stopColor="#c8a030" />
          <stop offset="100%" stopColor="#a07820" />
        </linearGradient>

        {/* Atmospheric warm glows */}
        <radialGradient id="atm1" cx="74%" cy="35%" r="30%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={warmColor} stopOpacity="0.28" />
          <stop offset="100%" stopColor={warmColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="atm2" cx="88%" cy="58%" r="25%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={warmColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={warmColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="atm3" cx="62%" cy="70%" r="22%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={warmColor} stopOpacity="0.13" />
          <stop offset="100%" stopColor={warmColor} stopOpacity="0" />
        </radialGradient>

        {/* Left readability vignette */}
        <linearGradient id="lv2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#040b12" stopOpacity="1" />
          <stop offset="25%"  stopColor="#040b12" stopOpacity="0.96" />
          <stop offset="45%"  stopColor="#040b12" stopOpacity="0.72" />
          <stop offset="62%"  stopColor="#040b12" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#040b12" stopOpacity="0" />
        </linearGradient>

        {/* Edge/corner vignette */}
        <radialGradient id="ev2" cx="58%" cy="50%" r="60%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="100%" stopColor="#030910" stopOpacity="0.65" />
        </radialGradient>

        {/* Top + bottom fades */}
        <linearGradient id="tf2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#040b12" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#040b12" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bf2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#040b12" stopOpacity="0" />
          <stop offset="100%" stopColor="#040b12" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* ── Base ── */}
      <rect width="1440" height="900" fill="url(#hbg2)" />

      {/* ── Dark glass window panels ── */}
      {Array.from({ length: numRows }, (_, ri) =>
        Array.from({ length: numCols }, (_, ci) => {
          const x = colStart + ci * colStep + 2;
          const y = ri * rowStep + 2;
          return (
            <rect key={`dp-${ci}-${ri}`} x={x} y={y} width={58} height={90}
              fill="url(#glass)" opacity={0.75} />
          );
        })
      )}

      {/* ── Lit windows (warm amber) ── */}
      {Array.from({ length: numRows }, (_, ri) =>
        Array.from({ length: numCols }, (_, ci) => {
          const op = litMap[`${ci}-${ri}`];
          if (!op) return null;
          const x = colStart + ci * colStep + 2;
          const y = ri * rowStep + 2;
          return (
            <rect key={`lw-${ci}-${ri}`} x={x} y={y} width={58} height={90}
              fill="url(#lit)" opacity={op} />
          );
        })
      )}

      {/* ── Structural steel frame — major verticals every 3 cols ── */}
      {[480, 666, 852, 1038, 1224, 1410].map((x) => (
        <line key={`mvc-${x}`} x1={x} y1={0} x2={x} y2={900}
          stroke="#1a2d40" strokeWidth="4" />
      ))}
      {/* Minor verticals */}
      {Array.from({ length: numCols + 1 }, (_, i) => colStart + i * colStep).map((x) => (
        <line key={`mvc2-${x}`} x1={x} y1={0} x2={x} y2={900}
          stroke="rgba(30,48,65,0.60)" strokeWidth="1" />
      ))}

      {/* ── Structural floor slabs ── */}
      {Array.from({ length: numRows + 1 }, (_, i) => i * rowStep).map((y) => (
        <line key={`hf-${y}`} x1={480} y1={y} x2={1440} y2={y}
          stroke="#182030" strokeWidth="3" />
      ))}

      {/* ── Atmospheric warm glow blobs ── */}
      <rect width="1440" height="900" fill="url(#atm1)" />
      <rect width="1440" height="900" fill="url(#atm2)" />
      <rect width="1440" height="900" fill="url(#atm3)" />

      {/* ── Vignettes ── */}
      <rect width="1440" height="900" fill="url(#lv2)" />
      <rect width="1440" height="900" fill="url(#ev2)" />
      <rect width="1440" height="130" fill="url(#tf2)" />
      <rect x="0" y="770" width="1440" height="130" fill="url(#bf2)" />
    </svg>
  );
}
