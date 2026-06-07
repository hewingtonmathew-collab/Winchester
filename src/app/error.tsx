"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid-hud bg-[size:40px_40px] opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-error/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 px-4 max-w-lg">
        <div className="w-16 h-16 rounded-xl bg-error/10 border border-error/30 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-error" aria-hidden="true" />
        </div>

        <div>
          <p className="eyebrow mb-3">Something went wrong</p>
          <h1 className="text-display-md font-bold text-on-surface mb-4">Unexpected error.</h1>
          <p className="text-body-lg text-on-surface-variant">
            An unexpected error has occurred. Please try again or return to the homepage.
          </p>
        </div>

        <div className="divider-cyan w-32" />

        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={reset} className="btn-primary">Try again</button>
          <Link href="/" className="btn-secondary">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
