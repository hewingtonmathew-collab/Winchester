export type FrameworkPillar = {
  id: string;
  title: string;
  description: string;
  icon: string;
  metrics: string[];
  colour: "cyan" | "secondary" | "error" | "amber" | "green" | "tertiary";
};

export const frameworkPillars: FrameworkPillar[] = [
  {
    id: "safeguarding",
    title: "Digital Safeguarding",
    description:
      "KCSIE-aligned oversight, monitoring evidence and online safety accountability across every device and platform in your school environment.",
    icon: "shield",
    metrics: [
      "Alert thresholds active",
      "Evidence library",
      "Policy review",
      "Training logged",
    ],
    colour: "cyan",
  },
  {
    id: "cyber",
    title: "Cyber Resilience",
    description:
      "Structured cyber review mapped to NCSC guidance. Identify control gaps, track remediation and maintain inspection-ready evidence of your cyber posture.",
    icon: "lock",
    metrics: [
      "Controls reviewed",
      "Vulnerabilities tracked",
      "Incidents documented",
      "NCSC alignment",
    ],
    colour: "error",
  },
  {
    id: "privacy",
    title: "GDPR & Privacy",
    description:
      "Data protection evidence, DPIA support and SAR management. Maintain a clear audit trail of how your school handles personal data responsibly.",
    icon: "file-lock",
    metrics: [
      "DPIAs completed",
      "SARs processed",
      "Supplier risk reviews",
      "Audit entries",
    ],
    colour: "secondary",
  },
  {
    id: "ai",
    title: "AI Governance",
    description:
      "Evaluate and document AI tool deployments across your school. Build an approved AI registry and manage algorithmic risk before it becomes a governance issue.",
    icon: "cpu",
    metrics: [
      "Tools assessed",
      "DPIAs raised",
      "LLM registry",
      "Risk decisions",
    ],
    colour: "cyan",
  },
  {
    id: "filtering",
    title: "Filtering & Monitoring",
    description:
      "DfE-compliant filtering and monitoring review. Evidence that your school's internet controls meet statutory expectations and are reviewed regularly.",
    icon: "eye",
    metrics: [
      "Filter audit",
      "Monitoring review",
      "Incident log",
      "Governor sign-off",
    ],
    colour: "amber",
  },
  {
    id: "governance",
    title: "Governor Accountability",
    description:
      "RAG risk reporting and statutory assurance tracking for school boards. Give governors the structured evidence they need to fulfil their oversight responsibilities.",
    icon: "landmark",
    metrics: [
      "RAG panels live",
      "Actions tracked",
      "Reports generated",
      "Board sign-offs",
    ],
    colour: "green",
  },
];

export const frameworkStats = [
  { value: "7", label: "Compliance domains" },
  { value: "KCSIE", label: "Safeguarding aligned" },
  { value: "NCSC", label: "Cyber framework" },
  { value: "UK GDPR", label: "Privacy standard" },
];
