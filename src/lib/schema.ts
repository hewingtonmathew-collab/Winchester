import type { Service } from "@/data/services";

type SchemaOrg = {
  "@context": "https://schema.org";
  "@type": string | string[];
  [key: string]: unknown;
};

export function organizationSchema(): SchemaOrg {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Winchester Consultancy",
    url: "https://winchesterconsultancy.co.uk",
    logo: "https://winchesterconsultancy.co.uk/icon",
    description:
      "School compliance intelligence — strategic operational, digital and governance assurance for schools and trusts.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44-1234-567890",
      contactType: "customer support",
      areaServed: "GB",
      availableLanguage: "English",
    },
    sameAs: [],
  };
}

export function webSiteSchema(): SchemaOrg {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Winchester Consultancy",
    url: "https://winchesterconsultancy.co.uk",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://winchesterconsultancy.co.uk/insights?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; href: string }>
): SchemaOrg {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://winchesterconsultancy.co.uk${item.href}`,
    })),
  };
}

export function serviceSchema(service: Service): SchemaOrg {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.detail.intro,
    provider: {
      "@type": "Organization",
      name: "Winchester Consultancy",
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    url: `https://winchesterconsultancy.co.uk${service.href}`,
  };
}

export function faqSchema(
  items: Array<{ question: string; answer: string }>
): SchemaOrg {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function localBusinessSchema(): SchemaOrg {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: "Winchester Consultancy",
    url: "https://winchesterconsultancy.co.uk",
    telephone: "+44-1234-567890",
    email: "hello@winchesterconsultancy.co.uk",
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    serviceType: "School Compliance Consultancy",
  };
}
