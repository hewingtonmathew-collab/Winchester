export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  icon: string;
  colour: "cyan" | "secondary" | "error" | "amber" | "green" | "tertiary";
  href: string;
  pillars: string[];
  audiences: string[];
  ragStatus?: "green" | "amber" | "red";
};

export const services: Service[] = [
  {
    slug: "digital-safeguarding",
    title: "Digital Safeguarding Review",
    shortTitle: "Digital Safeguarding",
    tagline: "KCSIE-aligned monitoring and evidence for every school context",
    description:
      "A structured review of your school's digital safeguarding provision, mapped against current KCSIE requirements. We help you evidence alert threshold management, maintain an organised evidence library and prepare your leadership team for inspection discussions.",
    icon: "shield-check",
    colour: "cyan",
    href: "/services/digital-safeguarding",
    pillars: [
      "Online safety oversight",
      "Alert threshold management",
      "Evidence library",
      "Inspection discussion readiness",
    ],
    audiences: ["DSLs", "Headteachers", "Governors", "ICT Managers"],
  },
  {
    slug: "cyber-security",
    title: "Cyber Security Readiness",
    shortTitle: "Cyber Security",
    tagline: "Structured cyber review aligned to NCSC and DfE guidance",
    description:
      "A comprehensive cyber security review aligned to NCSC guidance and DfE expectations. We map your current control posture, identify vulnerabilities, support incident response planning and help you maintain evidence of your cyber resilience for governors and inspectors.",
    icon: "lock",
    colour: "error",
    href: "/services/cyber-security",
    pillars: [
      "Threat landscape review",
      "Vulnerability surface mapping",
      "Incident response planning",
      "NCSC controls alignment",
    ],
    audiences: ["Headteachers", "ICT Managers", "SBMs", "MAT Operations"],
  },
  {
    slug: "gdpr-dpia",
    title: "GDPR & DPIA Evidence",
    shortTitle: "GDPR & Privacy",
    tagline: "Data protection evidence and DPIA support for schools handling complex data",
    description:
      "Practical data protection support for schools and trusts. We help you prepare and document DPIAs, manage subject access requests within statutory timeframes, assess supplier risk and maintain a clear audit trail of how your organisation handles personal data responsibly.",
    icon: "file-lock",
    colour: "secondary",
    href: "/services/gdpr-dpia",
    pillars: [
      "DPIA preparation support",
      "SAR processing",
      "Supplier risk evidence",
      "Data audit trails",
    ],
    audiences: ["DPOs", "Headteachers", "SBMs", "MAT Data Leads"],
  },
  {
    slug: "ai-governance",
    title: "AI Governance Readiness",
    shortTitle: "AI Governance",
    tagline: "Practical frameworks for schools adopting AI tools and ed-tech platforms",
    description:
      "As AI tools enter classrooms and back-office functions, schools need structured frameworks to assess risk, document decisions and maintain accountability. We help you build an approved AI registry, conduct proportionate risk assessments and establish an ed-tech approval process.",
    icon: "cpu",
    colour: "cyan",
    href: "/services/ai-governance",
    pillars: [
      "AI risk assessment",
      "Ed-tech approval process",
      "LLM registry",
      "Algorithmic accountability",
    ],
    audiences: ["Headteachers", "ICT Managers", "Governors", "MAT Digital Leads"],
  },
  {
    slug: "filtering-monitoring",
    title: "Filtering & Monitoring Oversight",
    shortTitle: "Filtering & Monitoring",
    tagline: "DfE-compliant filtering and monitoring review for schools and trusts",
    description:
      "A dedicated review of your filtering and monitoring arrangements against DfE statutory requirements. We assess filter configuration, audit monitoring thresholds, review incident response alignment and produce evidence of governor accountability for your assurance record.",
    icon: "eye",
    colour: "amber",
    href: "/services/filtering-monitoring",
    pillars: [
      "Filter configuration review",
      "Monitoring threshold audit",
      "Incident response alignment",
      "Governor accountability evidence",
    ],
    audiences: ["DSLs", "ICT Managers", "Headteachers", "MATs"],
  },
  {
    slug: "accessibility-send",
    title: "Accessibility & SEND Digital Inclusion",
    shortTitle: "Accessibility & SEND",
    tagline: "Digital inclusion review for pupils with SEND and accessibility obligations",
    description:
      "A structured review of how your school meets digital accessibility obligations and supports pupils with SEND. We audit assistive technology provision, review accessibility policy alignment, assess digital inclusion gaps and evidence staff training for your compliance record.",
    icon: "accessibility",
    colour: "tertiary",
    href: "/services/accessibility-send",
    pillars: [
      "Digital accessibility audit",
      "SEND technology review",
      "Accessibility policy alignment",
      "Staff training evidence",
    ],
    audiences: ["SENCOs", "Headteachers", "Governors", "ICT Managers"],
  },
  {
    slug: "governor-oversight",
    title: "Governor Oversight",
    shortTitle: "Governor Oversight",
    tagline: "Governance evidence and accountability tools for school boards and trustees",
    description:
      "Structured governance support for school boards and academy trustees. We provide RAG risk reporting, statutory assurance tracking and governor training evidence to help boards fulfil their oversight responsibilities with clear, auditable records.",
    icon: "landmark",
    colour: "green",
    href: "/services/governor-oversight",
    pillars: [
      "RAG risk reporting",
      "Statutory assurance tracking",
      "Governor training evidence",
      "Trust board accountability",
    ],
    audiences: ["Governors", "Trustees", "Headteachers", "Clerks"],
  },
];
