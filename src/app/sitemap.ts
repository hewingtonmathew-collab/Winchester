import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { platformModules } from "@/data/platform";

const BASE = "https://safeshield.education";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                               lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/guardian-os`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/platform/tools`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/schools-governors`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/mats-las`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`,                    lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/book-review`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/contact`,                  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.7 },
    { url: `${BASE}/privacy`,                  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,                    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const platformRoutes: MetadataRoute.Sitemap = platformModules.map((m) => ({
    url: `${BASE}/platform/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...serviceRoutes, ...platformRoutes];
}
