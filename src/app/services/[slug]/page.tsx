import { redirect, notFound } from "next/navigation";
import { services } from "@/data/services";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}

// Redirect old slugs to their dedicated pages
const slugRedirects: Record<string, string> = {
  safeguarding: "/services/digital-safeguarding",
  "digital-safeguarding": "/services/digital-safeguarding",
  "cyber-resilience": "/services/cyber-security",
  "cyber-security": "/services/cyber-security",
  "ai-governance": "/services/ai-governance",
  governance: "/services/governor-oversight",
  "governor-oversight": "/services/governor-oversight",
  "gdpr-dpia": "/services/gdpr-dpia",
  "filtering-monitoring": "/services/filtering-monitoring",
  "accessibility-send": "/services/accessibility-send",
};

export default function ServiceSlugPage({ params }: { params: Params }) {
  const target = slugRedirects[params.slug];
  if (target) redirect(target);
  notFound();
}
