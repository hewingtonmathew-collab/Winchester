import Link from "next/link";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* HUD grid */}
      <div className="absolute inset-0 bg-grid-hud bg-[size:40px_40px] opacity-40 pointer-events-none" aria-hidden="true" />
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 px-4 max-w-lg">
        <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-glow-sm">
          <Shield className="w-8 h-8 text-primary" aria-hidden="true" />
        </div>

        <div>
          <p className="eyebrow mb-3">404 — Page not found</p>
          <h1 className="text-display-md font-bold text-on-surface mb-4">
            Nothing here.
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="divider-cyan w-32" />

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-primary">Back to home</Link>
          <Link href="/contact" className="btn-secondary">Get in touch</Link>
        </div>
      </div>
    </div>
  );
}
