export type ServiceIconName = "shield" | "columns" | "cpu" | "bar-chart" | "users";

export type Service = {
  id: string;
  icon: ServiceIconName;
  title: string;
  description: string;
  href: string;
  detail: {
    tagline: string;
    intro: string;
    deliverables: string[];
    outcomes: string[];
  };
};

export const services: Service[] = [
  {
    id: "safeguarding",
    icon: "shield",
    title: "Digital Safeguarding & Risk Assurance",
    description:
      "Protecting students through robust digital safeguarding and governance frameworks that meet statutory obligations.",
    href: "/services/safeguarding",
    detail: {
      tagline: "Robust protection. Statutory confidence.",
      intro:
        "Digital safeguarding sits at the heart of every school's duty of care. From online filtering and monitoring to acceptable-use policies and KCSIE compliance, Winchester Consultancy delivers structured assurance reviews that give leaders genuine confidence in their safeguarding posture — not just a tick-box exercise.",
      deliverables: [
        "Full review of online filtering and monitoring provision against statutory expectations",
        "Digital safeguarding policy audit and gap analysis (aligned to KCSIE and UKCIS frameworks)",
        "Risk register development for digital and online threats",
        "DSL and staff capability assessment with tailored training recommendations",
        "Safeguarding self-evaluation framework (SEF) for digital contexts",
        "Governor briefing and reporting pack",
      ],
      outcomes: [
        "Clear, evidenced compliance against KCSIE and Ofsted expectations",
        "A prioritised action plan leaders can implement immediately",
        "Increased confidence for DSLs, governors, and senior leaders",
        "Reduced risk exposure across digital and online environments",
      ],
    },
  },
  {
    id: "governance",
    icon: "columns",
    title: "Governance & Compliance",
    description:
      "Strengthening governor oversight and ensuring regulatory compliance across all areas of school governance.",
    href: "/services/governance",
    detail: {
      tagline: "Stronger boards. Clearer compliance.",
      intro:
        "Effective governance is the foundation of a well-run school or trust. Winchester Consultancy works alongside governors, trustees, and senior leaders to build governance structures that are rigorous, well-evidenced, and aligned to the DfE's governance handbook — ensuring boards can ask the right questions and hold leaders to account with confidence.",
      deliverables: [
        "Governance effectiveness review against the DfE Governance Handbook",
        "Committee structure and terms of reference review",
        "Skills and knowledge audit for governing boards and trust boards",
        "Compliance mapping across statutory policies and regulatory requirements",
        "Governor induction and development programme design",
        "Annual governance health-check with action planning support",
      ],
      outcomes: [
        "A governance structure fit for purpose and future growth",
        "Governors and trustees who understand their roles and can discharge them effectively",
        "A comprehensive compliance map with clear ownership and review cycles",
        "Improved Ofsted readiness across governance and leadership",
      ],
    },
  },
  {
    id: "ai-governance",
    icon: "cpu",
    title: "AI Governance & Readiness",
    description:
      "Supporting responsible and secure AI adoption in education with policy frameworks and staff capability building.",
    href: "/services/ai-governance",
    detail: {
      tagline: "Responsible AI. Future-ready schools.",
      intro:
        "Generative AI is already reshaping how schools operate — from lesson planning and marking to administrative processes and data management. Winchester Consultancy helps schools and trusts navigate this landscape responsibly, building the policies, risk frameworks, and staff capability needed to adopt AI with confidence and without compromising safeguarding, data protection, or academic integrity.",
      deliverables: [
        "AI readiness assessment covering current tool use, policy gaps, and risk exposure",
        "AI governance policy development (staff use, student use, academic integrity)",
        "Data protection impact assessment (DPIA) guidance for AI tools",
        "Procurement due-diligence framework for evaluating AI products",
        "Staff development programme: responsible AI use in education",
        "Board briefing: AI risks, opportunities, and governance responsibilities",
      ],
      outcomes: [
        "A clear, defensible AI governance framework adopted across the organisation",
        "Reduced risk of safeguarding, data protection, and academic integrity breaches",
        "Staff who understand how to use AI responsibly and effectively",
        "Confidence to engage with AI vendors from an informed position",
      ],
    },
  },
  {
    id: "operational",
    icon: "bar-chart",
    title: "Operational Assurance",
    description:
      "Streamlining operations, finance, HR, H&S and estates for resilience and measurable improvement.",
    href: "/services/operational",
    detail: {
      tagline: "Resilient operations. Measurable improvement.",
      intro:
        "Behind every high-performing school is a robust operational infrastructure. Winchester Consultancy provides structured operational reviews across finance, human resources, health & safety, and estates management — surfacing inefficiencies, managing risk, and building the organisational resilience that allows teaching and learning to thrive.",
      deliverables: [
        "Financial health review: budget management, internal controls, and compliance",
        "HR compliance audit: safer recruitment, contracts, policies, and staff records",
        "Health & safety management review against statutory requirements",
        "Estates and facilities management assessment",
        "Business continuity and risk management framework review",
        "Operational improvement plan with prioritised recommendations",
      ],
      outcomes: [
        "Reduced operational risk across finance, HR, H&S, and estates",
        "Improved efficiency and resource allocation",
        "Clear accountability frameworks and documented processes",
        "Increased confidence for SLT and governors in operational oversight",
      ],
    },
  },
  {
    id: "strategic",
    icon: "users",
    title: "Strategic Support for Trusts",
    description:
      "Helping MATs achieve consistency, visibility and strategic alignment across all settings.",
    href: "/services/strategic",
    detail: {
      tagline: "Aligned trusts. Consistent excellence.",
      intro:
        "Multi-academy trusts face unique challenges: maintaining consistency of standards across multiple settings, managing growth, building a strong central function, and developing a unified culture without losing school identity. Winchester Consultancy works at board and executive level to support strategic planning, organisational development, and trust-wide assurance — helping MATs move from good to great.",
      deliverables: [
        "Trust-wide strategic review and development planning support",
        "Central function capability assessment (HR, finance, IT, estates)",
        "School improvement and performance monitoring framework design",
        "Scheme of delegation review and governance restructure support",
        "CEO and executive team advisory support",
        "Trust growth and expansion due-diligence support",
      ],
      outcomes: [
        "A clear strategic plan that the whole trust can rally behind",
        "Consistent standards and processes across all settings",
        "A central function that genuinely supports its schools",
        "Governance and accountability structures built for scale",
      ],
    },
  },
];
