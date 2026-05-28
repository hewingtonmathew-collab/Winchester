export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      aria-label="Loading"
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        <svg
          viewBox="0 0 40 40"
          width="40"
          height="40"
          aria-hidden="true"
          className="animate-spin-slow motion-reduce:animate-none"
        >
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle
            cx="20" cy="20" r="16" fill="none"
            stroke="#a8e8ff" strokeWidth="3"
            strokeDasharray="30 70" strokeLinecap="round"
          />
        </svg>
        <p className="text-label-caps text-on-surface-variant tracking-widest">
          Loading
        </p>
      </div>
    </div>
  );
}
