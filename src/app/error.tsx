"use client";

import { useEffect } from "react";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import ShieldLogo from "@/components/ui/ShieldLogo";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      role="main"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B1118]"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(201,168,76,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, rgba(6,12,17,0.9) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 px-4 max-w-lg">
        <ShieldLogo size={56} variant="mark-only" />

        <div className="flex flex-col gap-2">
          <p className="eyebrow">Something went wrong</p>
          <h1 className="heading-display text-5xl lg:text-6xl">
            Unexpected Error.
          </h1>
        </div>

        <SectionDivider />

        <p className="font-inter text-[#A7B1BE] text-base leading-relaxed">
          An unexpected error has occurred. Our team has been notified. Please
          try again or return to the homepage.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[rgba(27,36,48,0.9)] border border-[#2A3340] text-white font-inter font-medium text-sm tracking-wide transition-all duration-200 hover:bg-[#2A3340] hover:border-[rgba(201,168,76,0.5)]"
          >
            Try Again
          </button>
          <ButtonSecondary href="/">Back to Home</ButtonSecondary>
        </div>
      </div>
    </main>
  );
}
