export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; href: string; children?: NavLink[] };

export const mainNav: NavGroup[] = [
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Digital Safeguarding",
        href: "/services/digital-safeguarding",
        description: "KCSIE-aligned monitoring and evidence for every school context",
      },
      {
        label: "Cyber Security Readiness",
        href: "/services/cyber-security",
        description: "Structured cyber review aligned to NCSC and DfE guidance",
      },
      {
        label: "GDPR & DPIA Evidence",
        href: "/services/gdpr-dpia",
        description: "Data protection evidence and DPIA support for schools",
      },
      {
        label: "AI Governance Readiness",
        href: "/services/ai-governance",
        description: "Practical frameworks for schools adopting AI tools and ed-tech platforms",
      },
      {
        label: "Filtering & Monitoring",
        href: "/services/filtering-monitoring",
        description: "DfE-compliant filtering and monitoring review for schools and trusts",
      },
      {
        label: "Accessibility & SEND",
        href: "/services/accessibility-send",
        description: "Digital inclusion review for pupils with SEND and accessibility obligations",
      },
      {
        label: "Governor Oversight",
        href: "/services/governor-oversight",
        description: "Governance evidence and accountability tools for school boards and trustees",
      },
    ],
  },
  {
    label: "Platform",
    href: "/platform/tools",
    children: [
      {
        label: "Platform Tools",
        href: "/platform/tools",
        description: "The full GuardianOS platform tool suite",
      },
      {
        label: "Policy Checker",
        href: "/platform/policy-checker",
        description: "Cross-reference safeguarding policies against current KCSIE requirements",
      },
      {
        label: "Risk Register",
        href: "/platform/risk-register",
        description: "Live RAG risk tracking across safeguarding, cyber and GDPR domains",
      },
      {
        label: "SAR Planner",
        href: "/platform/sar-planner",
        description: "Structured subject access request workflow with deadline tracking",
      },
      {
        label: "DPIA Wizard",
        href: "/platform/dpia-wizard",
        description: "Step-by-step data protection impact assessment completion",
      },
      {
        label: "Evidence & Audit Trail",
        href: "/platform/evidence-audit",
        description: "Timestamped, searchable audit trail of every compliance action",
      },
    ],
  },
  {
    label: "GuardianOS",
    href: "/guardian-os",
  },
  {
    label: "Who We Help",
    href: "/schools-governors",
    children: [
      {
        label: "Schools & Governors",
        href: "/schools-governors",
        description: "Support for school leadership, governors and DSLs",
      },
      {
        label: "MATs & Local Authorities",
        href: "/mats-las",
        description: "Multi-academy trust and local authority compliance programmes",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
  },
];

export const ctaPrimary = { label: "Book a Readiness Review", href: "/book-review" };
export const ctaSecondary = { label: "Explore GuardianOS", href: "/guardian-os" };
