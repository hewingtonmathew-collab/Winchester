export type ServiceIconName =
  | "shield"
  | "columns"
  | "cpu"
  | "bar-chart"
  | "users"
  | "lock"
  | "database"
  | "briefcase"
  | "heart-pulse"
  | "bar-chart-2";

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
  {
    id: "cyber-resilience",
    icon: "lock",
    title: "Cyber Resilience Review",
    description:
      "Structured assessment of your cyber security posture against NCSC guidance — identifying vulnerabilities before they become incidents.",
    href: "/services/cyber-resilience",
    detail: {
      tagline: "Assess. Harden. Protect.",
      intro:
        "Schools and trusts are increasingly targeted by sophisticated cyber threats — from ransomware attacks that shut down entire networks to phishing campaigns that compromise sensitive staff and pupil data. Winchester Consultancy delivers a structured Cyber Resilience Review aligned to NCSC guidance and Cyber Essentials, providing school leaders with a clear picture of their current security posture and a prioritised roadmap to reduce risk. Our assessments go beyond technical checklists, examining the human, procedural, and governance dimensions of cyber security that are so often the weakest link. With education-sector context throughout, we help you build the defences that matter most.",
      deliverables: [
        "Cyber security posture assessment against NCSC Cyber Essentials and education-specific guidance",
        "Phishing and social engineering vulnerability review with staff awareness recommendations",
        "Ransomware readiness assessment: backup integrity, recovery procedures, and incident response planning",
        "Secure configuration audit covering devices, networks, user accounts, and software",
        "Penetration testing readiness report and vendor briefing pack",
        "Staff cyber awareness training needs analysis and programme design",
      ],
      outcomes: [
        "A clear, evidence-based picture of your cyber security strengths and vulnerabilities",
        "A prioritised action plan aligned to NCSC Cyber Essentials certification readiness",
        "Reduced exposure to ransomware, phishing, and data breach incidents",
        "Governors and senior leaders equipped to provide meaningful cyber security oversight",
      ],
    },
  },
  {
    id: "data-protection",
    icon: "database",
    title: "Data Protection Intelligence",
    description:
      "Expert review of your data protection compliance against UK GDPR, the DfE Data Protection Toolkit, and ICO guidance for educational settings.",
    href: "/services/data-protection",
    detail: {
      tagline: "Compliant. Secure. Accountable.",
      intro:
        "Schools handle vast quantities of sensitive personal data — from pupil records and SEND information to staff files and third-party processor agreements — and the regulatory obligations under UK GDPR are substantial and unforgiving. Winchester Consultancy provides a comprehensive Data Protection Intelligence review that assesses your compliance posture against the DfE Data Protection Toolkit, ICO accountability framework, and best practice for educational settings. We examine not just the documentation but the real-world practices, data flows, and staff understanding that determine whether your school is genuinely compliant. Our approach equips your DPO and SLT with the evidence and tools to demonstrate accountability to regulators, governors, and the communities you serve.",
      deliverables: [
        "UK GDPR compliance audit against the DfE Data Protection Toolkit and ICO accountability framework",
        "Records of Processing Activities (ROPA) review and development support",
        "Data Protection Impact Assessment (DPIA) process review and template development",
        "Third-party data processor agreement audit and due-diligence framework",
        "Data subject rights procedure review (access requests, erasure, rectification)",
        "Staff training needs analysis and DPO support programme design",
      ],
      outcomes: [
        "A fully evidenced compliance baseline against UK GDPR and DfE Data Protection Toolkit requirements",
        "Robust ROPA, DPIA, and processor agreement documentation ready for ICO scrutiny",
        "Clear, actionable procedures for handling data subject rights requests efficiently and lawfully",
        "A staff training programme that builds genuine data protection culture rather than compliance theatre",
      ],
    },
  },
  {
    id: "hr-finance",
    icon: "briefcase",
    title: "HR, Finance & Procurement",
    description:
      "Operational intelligence across human resources, financial management, and procurement — ensuring compliance, efficiency, and best value.",
    href: "/services/hr-finance",
    detail: {
      tagline: "Efficient. Compliant. Best Value.",
      intro:
        "Strong financial management, rigorous HR compliance, and effective procurement are the operational pillars that allow schools and trusts to deploy resources where they matter most — in the classroom. Winchester Consultancy provides specialist operational intelligence across all three disciplines, drawing on deep expertise in education sector frameworks including ESFA requirements, Crown Commercial Service agreements, and DfE guidance on financial management in schools. Our reviews identify compliance gaps, inefficiencies, and risk exposures across HR, finance, and procurement functions — and translate findings into practical, prioritised improvement plans that senior leaders and governors can act on immediately.",
      deliverables: [
        "Safer recruitment compliance audit against KCSIE and Keeping Children Safe in Education statutory guidance",
        "HR policy framework review: contracts, disciplinary procedures, grievance, absence, and performance management",
        "Financial health review: budget management, internal controls, financial reporting, and ESFA compliance",
        "Procurement compliance audit against Public Contracts Regulations, ESPO, and Crown Commercial Service frameworks",
        "Value for money assessment across key spend categories with benchmarking against sector data",
        "Trust-level finance framework design: scheme of financial delegation, financial regulations, and audit committee support",
      ],
      outcomes: [
        "Evidenced compliance across safer recruitment, HR policy, and financial management obligations",
        "Stronger internal controls and financial governance that withstand ESFA and external audit scrutiny",
        "Procurement processes that deliver genuine best value and meet public sector transparency requirements",
        "Senior leaders and governors confident in the integrity and efficiency of operational functions",
      ],
    },
  },
  {
    id: "health-safety",
    icon: "heart-pulse",
    title: "Health & Safety Assurance",
    description:
      "Comprehensive health and safety review ensuring your school meets its statutory obligations and provides a safe environment for pupils and staff.",
    href: "/services/health-safety",
    detail: {
      tagline: "Safe Environments. Statutory Confidence.",
      intro:
        "Every school carries a fundamental statutory duty to maintain safe premises and working environments for pupils, staff, and visitors — and the consequences of getting this wrong can be severe. Winchester Consultancy delivers a comprehensive Health & Safety Assurance review that examines your compliance posture against HSE statutory requirements, DfE premises standards, and sector-specific guidance across fire safety, lone working, COSHH, and educational visits. We work with headteachers, SBMs, and governing bodies to build a safety management culture that goes beyond paperwork — one where risk is actively managed, staff are properly trained, and governors have the oversight they need to discharge their legal responsibilities with confidence.",
      deliverables: [
        "Statutory health and safety compliance audit against HSE requirements and DfE premises standards",
        "Risk assessment framework review: quality, coverage, review cycles, and staff competency",
        "Fire safety management review including evacuation procedures, fire risk assessment status, and record-keeping",
        "Educational visits and school trips compliance review against the DfE's standards for learning outside the classroom",
        "COSHH, manual handling, lone working, and display screen equipment (DSE) compliance assessment",
        "Governor health and safety oversight review with training recommendations and reporting framework",
      ],
      outcomes: [
        "A comprehensive compliance baseline demonstrating statutory obligations are understood and met",
        "A prioritised remediation plan that addresses the highest-risk gaps first with clear ownership and timescales",
        "Governors equipped with the knowledge and reporting tools to fulfil their health and safety oversight responsibilities",
        "A safety management culture embedded in day-to-day operations rather than confined to annual audits",
      ],
    },
  },
  {
    id: "compliance-intelligence",
    icon: "bar-chart-2",
    title: "Compliance Intelligence Systems",
    description:
      "Building the systems, dashboards and frameworks that give your school or trust real-time visibility of compliance status across all operational areas.",
    href: "/services/compliance-intelligence",
    detail: {
      tagline: "Visibility. Control. Confidence.",
      intro:
        "For too many schools and trusts, compliance is managed through disconnected spreadsheets, manual reminders, and institutional memory — leaving leaders exposed to gaps they cannot see and risks they cannot quantify. Winchester Consultancy builds bespoke Compliance Intelligence Systems that consolidate your compliance obligations into coherent, trackable frameworks — giving headteachers, SBMs, trust executives, and governors a real-time view of where you stand and what needs attention. Our approach combines statutory policy review cycles, risk register design, and KPI frameworks into integrated systems that drive continuous assurance rather than one-off audits. The result is a school or trust that governs itself proactively, with the audit trails and evidence portfolios that Ofsted and regulators expect to see.",
      deliverables: [
        "Compliance framework design: statutory policy register with review cycles, ownership, and RAG status tracking",
        "Governance dashboard design for trust boards and local governing bodies — translating compliance data into strategic oversight",
        "Risk register development with likelihood and impact scoring, mitigation plans, and governor reporting integration",
        "Self-evaluation framework (SEF) aligned to compliance domains: safeguarding, governance, operations, finance, and digital",
        "KPI design for trust board reporting: compliance health metrics, trend analysis, and exception reporting",
        "Audit trail and evidence portfolio framework for Ofsted and regulatory inspection readiness",
      ],
      outcomes: [
        "A single, coherent view of compliance status across all statutory and regulatory obligations",
        "Trust boards and governing bodies with the data and dashboards to provide meaningful strategic oversight",
        "A risk register that is genuinely used — embedded in committee cycles and informing decision-making",
        "Inspection readiness embedded into daily operations, not scrambled for in the weeks before Ofsted arrives",
      ],
    },
  },
];
