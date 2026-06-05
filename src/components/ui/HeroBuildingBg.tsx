export default function HeroBuildingBg() {
  const colStart = 460;
  const colStep = 60;
  const rowStep = 94;
  const numCols = 17;
  const numRows = 11;

  // Warm amber-lit windows (interior office lights)
  const litMap: Record<string, number> = {
    // Row 0
    "1-0": 0.75, "3-0": 0.55, "5-0": 0.80, "7-0": 0.45, "9-0": 0.65, "11-0": 0.50, "13-0": 0.40, "15-0": 0.60,
    // Row 1
    "0-1": 0.40, "2-1": 0.80, "4-1": 0.55, "6-1": 0.70, "8-1": 0.45, "10-1": 0.60, "12-1": 0.75, "14-1": 0.50, "16-1": 0.35,
    // Row 2
    "1-2": 0.85, "3-2": 0.65, "5-2": 0.45, "7-2": 0.80, "9-2": 0.55, "11-2": 0.40, "13-2": 0.70, "15-2": 0.60,
    // Row 3
    "0-3": 0.45, "2-3": 0.60, "4-3": 0.80, "6-3": 0.50, "8-3": 0.70, "10-3": 0.85, "12-3": 0.55, "14-3": 0.40, "16-3": 0.65,
    // Row 4
    "1-4": 0.70, "3-4": 0.50, "5-4": 0.80, "7-4": 0.60, "9-4": 0.45, "11-4": 0.75, "13-4": 0.55, "15-4": 0.40,
    // Row 5
    "0-5": 0.50, "2-5": 0.75, "4-5": 0.55, "6-5": 0.80, "8-5": 0.40, "10-5": 0.65, "12-5": 0.50, "14-5": 0.70, "16-5": 0.45,
    // Row 6
    "1-6": 0.60, "3-6": 0.80, "5-6": 0.45, "7-6": 0.70, "9-6": 0.75, "11-6": 0.50, "13-6": 0.40, "15-6": 0.65,
    // Row 7
    "2-7": 0.50, "4-7": 0.65, "6-7": 0.45, "8-7": 0.75, "10-7": 0.55, "12-7": 0.60, "14-7": 0.40, "16-7": 0.50,
    // Row 8
    "1-8": 0.45, "3-8": 0.60, "5-8": 0.75, "7-8": 0.40, "9-8": 0.65, "11-8": 0.55, "13-8": 0.70,
    // Row 9
    "0-9": 0.40, "2-9": 0.55, "4-9": 0.45, "6-9": 0.60, "8-9": 0.50, "10-9": 0.40, "14-9": 0.55,
  };

  // Cool blue-white screen-lit windows (fluorescent / monitor glow variety)
  const coolLitMap: Record<string, number> = {
    "2-0": 0.70, "8-0": 0.65, "14-0": 0.60,
    "5-1": 0.75, "11-1": 0.65,
    "4-2": 0.70, "10-2": 0.75, "14-2": 0.60,
    "3-3": 0.65, "9-3": 0.70, "15-3": 0.65,
    "6-4": 0.75, "12-4": 0.60,
    "3-5": 0.65, "9-5": 0.70, "15-5": 0.65,
    "4-6": 0.70, "10-6": 0.75, "14-6": 0.60,
    "5-7": 0.70, "11-7": 0.60,
    "4-8": 0.65, "8-8": 0.70, "12-8": 0.60,
    "5-9": 0.60, "11-9": 0.65,
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
          <stop offset="0%"   stopColor="#030910" />
          <stop offset="32%"  stopColor="#060d16" />
          <stop offset="100%" stopColor="#0c1926" />
        </linearGradient>

        {/* Building wall — dark concrete between windows */}
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0a1522" />
          <stop offset="100%" stopColor="#070f1a" />
        </linearGradient>

        {/* Window glass — dark tinted, low opacity to blend into wall */}
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0e1d2c" />
          <stop offset="100%" stopColor="#081320" />
        </linearGradient>

        {/* Warm lit window — amber gold gradient (interior office lights) */}
        <linearGradient id="lit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f0c864" />
          <stop offset="40%"  stopColor="#d4a030" />
          <stop offset="100%" stopColor="#9a6c10" />
        </linearGradient>

        {/* Cool lit window — blue-white (screens / fluorescent) */}
        <linearGradient id="coolLit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c8dff0" />
          <stop offset="40%"  stopColor="#8ab8d8" />
          <stop offset="100%" stopColor="#4a88b4" />
        </linearGradient>

        {/* Window warm glow bloom filter */}
        <filter id="bloom" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Atmospheric warm glows — cluster on right third */}
        <radialGradient id="atm1" cx="72%" cy="38%" r="35%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={warmColor} stopOpacity="0.40" />
          <stop offset="60%"  stopColor={warmColor} stopOpacity="0.14" />
          <stop offset="100%" stopColor={warmColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="atm2" cx="88%" cy="60%" r="28%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={warmColor} stopOpacity="0.28" />
          <stop offset="100%" stopColor={warmColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="atm3" cx="60%" cy="72%" r="25%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={warmColor} stopOpacity="0.20" />
          <stop offset="100%" stopColor={warmColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="atm4" cx="80%" cy="20%" r="20%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={warmColor} stopOpacity="0.22" />
          <stop offset="100%" stopColor={warmColor} stopOpacity="0" />
        </radialGradient>

        {/* Left readability vignette — text side */}
        <linearGradient id="lv2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#030910" stopOpacity="1" />
          <stop offset="22%"  stopColor="#030910" stopOpacity="0.97" />
          <stop offset="38%"  stopColor="#030910" stopOpacity="0.82" />
          <stop offset="55%"  stopColor="#030910" stopOpacity="0.40" />
          <stop offset="72%"  stopColor="#030910" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#030910" stopOpacity="0" />
        </linearGradient>

        {/* Edge/corner vignette */}
        <radialGradient id="ev2" cx="58%" cy="50%" r="62%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="100%" stopColor="#020810" stopOpacity="0.70" />
        </radialGradient>

        {/* Top fade */}
        <linearGradient id="tf2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#030910" stopOpacity="0.90" />
          <stop offset="100%" stopColor="#030910" stopOpacity="0" />
        </linearGradient>
        {/* Bottom fade */}
        <linearGradient id="bf2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#030910" stopOpacity="0" />
          <stop offset="100%" stopColor="#030910" stopOpacity="0.90" />
        </linearGradient>
      </defs>

      {/* ── Base dark sky ── */}
      <rect width="1440" height="900" fill="url(#hbg2)" />

      {/* ── Building wall fill — concrete panel between windows ── */}
      <rect x={colStart} y={0} width={1440 - colStart} height={900} fill="url(#wall)" opacity={0.85} />

      {/* ── Dark glass window panels (lower opacity — let wall show) ── */}
      {Array.from({ length: numRows }, (_, ri) =>
        Array.from({ length: numCols }, (_, ci) => {
          const x = colStart + ci * colStep + 2;
          const y = ri * rowStep + 2;
          return (
            <rect key={`dp-${ci}-${ri}`} x={x} y={y} width={56} height={88}
              fill="url(#glass)" opacity={0.40} />
          );
        })
      )}

      {/* ── Lit window glow halos — warm amber (behind for bloom) ── */}
      {Array.from({ length: numRows }, (_, ri) =>
        Array.from({ length: numCols }, (_, ci) => {
          const op = litMap[`${ci}-${ri}`];
          if (!op || op < 0.60) return null;
          const x = colStart + ci * colStep + 2;
          const y = ri * rowStep + 2;
          return (
            <rect key={`gh-${ci}-${ri}`} x={x - 4} y={y - 4} width={64} height={96}
              fill={warmColor} opacity={op * 0.35} rx={2} filter="url(#bloom)" />
          );
        })
      )}

      {/* ── Warm amber lit windows ── */}
      {Array.from({ length: numRows }, (_, ri) =>
        Array.from({ length: numCols }, (_, ci) => {
          const op = litMap[`${ci}-${ri}`];
          if (!op) return null;
          const x = colStart + ci * colStep + 2;
          const y = ri * rowStep + 2;
          return (
            <rect key={`lw-${ci}-${ri}`} x={x} y={y} width={56} height={88}
              fill="url(#lit)" opacity={op} />
          );
        })
      )}

      {/* ── Cool blue screen-lit windows (variety) ── */}
      {Array.from({ length: numRows }, (_, ri) =>
        Array.from({ length: numCols }, (_, ci) => {
          const op = coolLitMap[`${ci}-${ri}`];
          if (!op) return null;
          // Skip if also warm-lit
          if (litMap[`${ci}-${ri}`]) return null;
          const x = colStart + ci * colStep + 2;
          const y = ri * rowStep + 2;
          return (
            <rect key={`cw-${ci}-${ri}`} x={x} y={y} width={56} height={88}
              fill="url(#coolLit)" opacity={op} />
          );
        })
      )}

      {/* ── Structural steel frame — major verticals every 3 cols ── */}
      {[460, 640, 820, 1000, 1180, 1360, 1440].map((x) => (
        <line key={`mvc-${x}`} x1={x} y1={0} x2={x} y2={900}
          stroke="#1e3348" strokeWidth="5" strokeOpacity="0.95" />
      ))}
      {/* Minor verticals */}
      {Array.from({ length: numCols + 1 }, (_, i) => colStart + i * colStep).map((x) => (
        <line key={`mvc2-${x}`} x1={x} y1={0} x2={x} y2={900}
          stroke="rgba(30,48,64,0.80)" strokeWidth="2" />
      ))}

      {/* ── Structural floor slabs ── */}
      {Array.from({ length: numRows + 1 }, (_, i) => i * rowStep).map((y) => (
        <line key={`hf-${y}`} x1={460} y1={y} x2={1440} y2={y}
          stroke="#1a2c3c" strokeWidth="4" />
      ))}

      {/* ── Atmospheric warm glow blobs ── */}
      <rect width="1440" height="900" fill="url(#atm1)" />
      <rect width="1440" height="900" fill="url(#atm2)" />
      <rect width="1440" height="900" fill="url(#atm3)" />
      <rect width="1440" height="900" fill="url(#atm4)" />

      {/* ── Vignettes ── */}
      <rect width="1440" height="900" fill="url(#lv2)" />
      <rect width="1440" height="900" fill="url(#ev2)" />
      <rect width="1440" height="130" fill="url(#tf2)" />
      <rect x="0" y="770" width="1440" height="130" fill="url(#bf2)" />
    </svg>
  );
}
