import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudienceCardProps {
  role: string;
  description: string;
  benefits: string[];
  icon?: React.ReactNode;
  href?: string;
}

function CardContent({
  role,
  description,
  benefits,
  icon,
  isLink,
}: AudienceCardProps & { isLink: boolean }) {
  return (
    <div className="flex flex-col h-full p-6">
      {/* Icon + role header */}
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div
            className="flex items-center justify-center h-11 w-11 rounded-xl border text-primary shrink-0"
            style={{
              background: "rgba(0,212,255,0.07)",
              border: "1px solid rgba(0,212,255,0.25)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 0 12px rgba(0,212,255,0.12)",
            }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <h3
          className={cn(
            "text-headline-md text-primary font-semibold",
            isLink && "group-hover:text-primary-tint transition-colors duration-300"
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
              className="text-primary shrink-0 mt-0.5"
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
}: AudienceCardProps) {
  const sharedClasses = "glass-panel rounded-2xl h-full";

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          sharedClasses,
          "group block glass-panel-hover transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        )}
      >
        <CardContent
          role={role}
          description={description}
          benefits={benefits}
          icon={icon}
          href={href}
          isLink
        />
      </Link>
    );
  }

  return (
    <div className={sharedClasses}>
      <CardContent
        role={role}
        description={description}
        benefits={benefits}
        icon={icon}
        isLink={false}
      />
    </div>
  );
}
