export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1118]"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4">
        <svg
          viewBox="0 0 40 40"
          width="40"
          height="40"
          aria-hidden="true"
          className="animate-[spin_1.2s_linear_infinite]"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="rgba(42,51,64,0.6)"
            strokeWidth="3"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="3"
            strokeDasharray="30 70"
            strokeLinecap="round"
          />
        </svg>
        <p className="font-inter text-[#A7B1BE] text-xs tracking-widest uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}
