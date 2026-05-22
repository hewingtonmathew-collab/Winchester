import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import ShieldLogo from "@/components/ui/ShieldLogo";
import SectionDivider from "@/components/ui/SectionDivider";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B1118]">
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(201,168,76,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      {/* Vignette */}
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
          <p className="eyebrow">404 — Page Not Found</p>
          <h1 className="heading-display text-5xl lg:text-6xl">
            Nothing Here.
          </h1>
        </div>

        <SectionDivider />

        <p className="font-inter text-[#A7B1BE] text-base leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get
          you back on track.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <ButtonPrimary href="/">Back to Home</ButtonPrimary>
          <ButtonSecondary href="/contact">Get in Touch</ButtonSecondary>
        </div>
      </div>
    </div>
  );
}
