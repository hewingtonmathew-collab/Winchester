export type PlatformModule = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  href: string;
  status: "active" | "beta" | "coming-soon";
  colour: "cyan" | "secondary" | "error" | "amber" | "green";
};

export const platformModules: PlatformModule[] = [
  {
    slug: "policy-checker",
    title: "Policy Review Checker",
    tagline: "KCSIE Compliance Engine",
    description:
      "Cross-reference your safeguarding policies against current KCSIE requirements. Generate Ofsted-conscious governor reports with annotated gap analysis.",
    icon: "file-check",
    href: "/platform/policy-checker",
    status: "active",
    colour: "cyan",
  },
  {
    slug: "risk-register",
    title: "Risk Register",
    tagline: "Live RAG Risk Tracking",
    description:
      "Maintain a live risk register with RAG status across your safeguarding, cyber and GDPR domains. Track actions, assign owners and produce evidence trails.",
    icon: "shield-alert",
    href: "/platform/risk-register",
    status: "active",
    colour: "error",
  },
  {
    slug: "sar-planner",
    title: "SAR Planner",
    tagline: "Subject Access Request Management",
    description:
      "Structured SAR workflow with deadline tracking, data source mapping and statutory response evidence. Keep your school on the right side of UK GDPR obligations.",
    icon: "user-search",
    href: "/platform/sar-planner",
    status: "active",
    colour: "secondary",
  },
  {
    slug: "dpia-wizard",
    title: "DPIA Wizard",
    tagline: "Data Protection Impact Assessment",
    description:
      "Step-by-step DPIA completion with proportionate risk assessment, mitigation planning and DPO sign-off workflow. Designed for school systems, not corporate legal teams.",
    icon: "wand-sparkles",
    href: "/platform/dpia-wizard",
    status: "active",
    colour: "secondary",
  },
  {
    slug: "evidence-audit",
    title: "Evidence & Audit Trail",
    tagline: "Immutable Compliance Record",
    description:
      "A timestamped, searchable audit trail of every compliance action, policy decision and governance event. Your first line of defence in any review or inspection.",
    icon: "archive",
    href: "/platform/evidence-audit",
    status: "active",
    colour: "green",
  },
];
