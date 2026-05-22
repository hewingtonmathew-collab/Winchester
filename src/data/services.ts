export type ServiceIconName = "shield" | "columns" | "cpu" | "bar-chart" | "users";

export type Service = {
  id: string;
  icon: ServiceIconName;
  title: string;
  description: string;
  href: string;
};

export const services: Service[] = [
  {
    id: "safeguarding",
    icon: "shield",
    title: "Digital Safeguarding & Risk Assurance",
    description:
      "Protecting students through robust digital safeguarding and governance frameworks that meet statutory obligations.",
    href: "/services#safeguarding",
  },
  {
    id: "governance",
    icon: "columns",
    title: "Governance & Compliance",
    description:
      "Strengthening governor oversight and ensuring regulatory compliance across all areas of school governance.",
    href: "/services#governance",
  },
  {
    id: "ai-governance",
    icon: "cpu",
    title: "AI Governance & Readiness",
    description:
      "Supporting responsible and secure AI adoption in education with policy frameworks and staff capability building.",
    href: "/services#ai-governance",
  },
  {
    id: "operational",
    icon: "bar-chart",
    title: "Operational Assurance",
    description:
      "Streamlining operations, finance, HR, H&S and estates for resilience and measurable improvement.",
    href: "/services#operational",
  },
  {
    id: "strategic",
    icon: "users",
    title: "Strategic Support for Trusts",
    description:
      "Helping MATs achieve consistency, visibility and strategic alignment across all settings.",
    href: "/services#strategic",
  },
];
