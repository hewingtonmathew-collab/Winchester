import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudienceCardProps {
  role: string;
  description: string;
  benefits: string[];
  icon?: React.ReactNode;
  href?: string;
  colour?: "cyan" | "violet" | "green";
}

const audienceColourMap = {
  cyan: {
    dot: "rgba(0,212,255,0.85)",
    glow: "rgba(0,212,255,",
    iconBg: "rgba(0,212,255,0.07)",
    iconBorder: "rgba(0,212,255,0.28)",
    text: "text-primary",
  },
  violet: {
    dot: "rgba(167,139,250,0.85)",
    glow: "rgba(167,139,250,",
    iconBg: "rgba(167,139,250,0.07)",
    iconBorder: "rgba(167,139,250,0.28)",
    text: "text-[#a78bfa]",
  },
  green: {
    dot: "rgba(74,222,128,0.85)",
    glow: "rgba(74,222,128,",
    iconBg: "rgba(74,222,128,0.07)",
    iconBorder: "rgba(74,222,128,0.28)",
    text: "text-rag-green",
  },
};

function CardContent({
  role,
  description,
  benefits,
  icon,
  isLink,
  colour = "cyan",
}: AudienceCardProps & { isLink: boolean }) {
  const colours = audienceColourMap[colour];

  return (
    <div className="flex flex-col h-full p-6">
      {/* Icon + role header */}
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div
            className={cn("flex items-center justify-center h-12 w-12 rounded-xl shrink-0", colours.text)}
            style={{
              background: colours.iconBg,
              border: `1px solid ${colours.iconBorder}`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), 0 0 16px ${colours.glow}0.15)`,
            }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <h3
          className={cn(
            "text-headline-md font-semibold",
            colours.text,
            isLink && "transition-colors duration-300"
          )}
        >
          {role}
        </h3>
      </div>

      {/* Description */}
      <p className="text-body-sm text-on-surface-variant mb-5 leading-relaxed">
        {description}
      </p>

      {/* Benefits list */}
      <ul className="flex flex-col gap-2.5" aria-label={`Benefits for ${role}`}>
        {benefits.map((benefit) => (
          <li
            key={benefit}
            className="flex items-start gap-2.5 text-body-sm text-on-surface"
          >
            <Check
              size={14}
              className={cn("shrink-0 mt-0.5", colours.text)}
              aria-hidden="true"
            />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AudienceCard({
  role,
  description,
  benefits,
  icon,
  href,
  colour = "cyan" as const,
}: AudienceCardProps) {
  const sharedClasses = "glass-panel rounded-2xl h-full";

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          sharedClasses,
          "group block glass-panel-hover transition-all duration-300 relative overflow-hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        )}
      >
        {/* Colour accent top line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent 10%, ${audienceColourMap[colour].dot} 50%, transparent 90%)` }}
          aria-hidden="true"
        />
        <CardContent
          role={role}
          description={description}
          benefits={benefits}
          icon={icon}
          href={href}
          isLink
          colour={colour}
        />
      </Link>
    );
  }

  return (
    <div className={cn(sharedClasses, "relative overflow-hidden")}>
      {/* Colour accent top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent 10%, ${audienceColourMap[colour].dot} 50%, transparent 90%)` }}
        aria-hidden="true"
      />
      <CardContent
        role={role}
        description={description}
        benefits={benefits}
        icon={icon}
        isLink={false}
        colour={colour}
      />
    </div>
  );
}
