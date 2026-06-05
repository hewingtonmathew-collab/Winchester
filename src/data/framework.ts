export type FrameworkPillar = {
  id: string;
  number: string;
  icon: string; // lucide icon name as string
  title: string;
  description: string;
  standards: string[];
  assessmentAreas: string[];
};

export type StandardsReference = {
  framework: string;
  description: string;
  icon: string;
};

export type FrameworkData = {
  title: string;
  subtitle: string;
  description: string;
  pillars: FrameworkPillar[];
  methodology: { number: string; title: string; body: string }[];
  standardsAlignment: StandardsReference[];
};

export const frameworkData: FrameworkData = {
  title: "Winchester Digital Assurance Framework",
  subtitle: "A structured intelligence methodology for modern school compliance",
  description:
    "The Winchester Digital Assurance Framework is a comprehensive, evidence-based methodology designed to give schools and trusts a rigorous, consistent view of their compliance and governance posture across six critical domains. Built on statutory frameworks, sector-specific guidance, and the lived experience of education leaders, it moves beyond one-off audits to create a continuous assurance cycle that adapts to the evolving demands placed on modern educational institutions.",

  pillars: [
    {
      id: "digital-safeguarding",
      number: "01",
      icon: "shield",
      title: "Digital Safeguarding",
      description:
        "Digital safeguarding is no longer a peripheral concern — it is a statutory obligation that sits at the heart of every school's duty of care, demanding rigorous oversight of online environments, staff capability, and the systems that protect children from harm. Our assessment examines the full digital safeguarding ecosystem, from filtering and monitoring provision to DSL readiness and student-facing reporting mechanisms, ensuring schools can evidence compliance with confidence.",
      standards: [
        "KCSIE 2024",
        "Ofsted ILACS Framework",
        "UKCIS Online Safety Standards",
      ],
      assessmentAreas: [
        "Online filtering and monitoring provision",
        "DSL digital capability and oversight",
        "Acceptable use policies and digital literacy",
        "Student-facing reporting mechanisms",
      ],
    },
    {
      id: "governance-leadership",
      number: "02",
      icon: "columns",
      title: "Governance & Leadership",
      description:
        "Effective governance is the structural foundation upon which every well-run school or trust is built — providing the strategic direction, financial oversight, and accountability mechanisms that regulators, parents, and communities rightly expect. Our governance assessment examines the quality of board leadership, the rigour of committee structures, and the school's ability to demonstrate compliance with the DfE Governance Handbook and academy trust regulatory requirements.",
      standards: [
        "DfE Governance Handbook 2023",
        "Companies Act 2006 (Academy Trust)",
        "ESFA Academy Trust Handbook",
      ],
      assessmentAreas: [
        "Board skills, knowledge, and effectiveness",
        "Committee structures and terms of reference",
        "Scheme of delegation design and implementation",
        "Statutory policy ownership and review cycles",
      ],
    },
    {
      id: "ai-governance",
      number: "03",
      icon: "cpu",
      title: "AI Governance",
      description:
        "Generative AI is transforming how schools operate, communicate, and deliver education — yet most institutions lack the governance frameworks needed to manage the associated safeguarding, data protection, and academic integrity risks responsibly. Our AI governance assessment examines current tool use, policy gaps, staff capability, and procurement practices against DfE guidance, ICO requirements, and international ethical standards, equipping schools to lead on AI adoption rather than react to its consequences.",
      standards: [
        "DfE Generative AI in Education Guidance",
        "ICO Guidance on AI and Data Protection",
        "UNESCO Recommendation on AI Ethics",
      ],
      assessmentAreas: [
        "AI tool inventory and shadow IT exposure",
        "Staff and student acceptable use policies",
        "Academic integrity and AI detection approaches",
        "AI procurement due-diligence processes",
      ],
    },
    {
      id: "cyber-resilience",
      number: "04",
      icon: "lock",
      title: "Cyber Resilience",
      description:
        "Schools and trusts are high-value targets for cyber criminals, with ransomware, phishing, and data breaches capable of causing catastrophic operational disruption and reputational damage — yet many educational institutions remain dangerously underprepared. Our cyber resilience assessment evaluates your organisation's security posture against NCSC guidance and Cyber Essentials controls, identifying the technical, procedural, and human vulnerabilities that require urgent attention.",
      standards: [
        "NCSC Cyber Essentials",
        "NCSC Education Specific Guidance",
        "ISO 27001 Controls (adapted)",
      ],
      assessmentAreas: [
        "Secure configuration of devices, networks, and accounts",
        "Phishing and social engineering resilience",
        "Ransomware readiness and backup integrity",
        "Incident response planning and staff awareness",
      ],
    },
    {
      id: "data-protection",
      number: "05",
      icon: "database",
      title: "Data Protection",
      description:
        "Schools process extraordinary volumes of sensitive personal data — including pupil records, SEND information, staff files, and third-party processor data — and the obligations under UK GDPR are substantial, far-reaching, and actively enforced by the ICO. Our data protection assessment benchmarks your compliance posture against the DfE Data Protection Toolkit and ICO accountability framework, examining not just documentation but the real-world data practices, staff understanding, and governance controls that determine genuine compliance.",
      standards: [
        "UK GDPR (Data Protection Act 2018)",
        "DfE Data Protection Toolkit",
        "ICO Accountability Framework",
      ],
      assessmentAreas: [
        "Records of Processing Activities (ROPA) completeness",
        "Data Protection Impact Assessment (DPIA) processes",
        "Third-party processor agreement compliance",
        "Data subject rights procedures and staff capability",
      ],
    },
    {
      id: "operational-assurance",
      number: "06",
      icon: "layers",
      title: "Operational Assurance",
      description:
        "The operational infrastructure of a school — spanning health and safety, HR compliance, financial management, and estates — must be as rigorous and well-evidenced as its educational provision, since failures in these areas carry statutory consequences and directly impact the school's capacity to function. Our operational assurance assessment examines compliance across the full breadth of non-educational statutory obligations, surfacing risk, identifying inefficiency, and building the governance frameworks that allow leaders to manage operations with confidence.",
      standards: [
        "Health & Safety at Work Act 1974",
        "Keeping Children Safe in Education",
        "ESFA Financial Management Code",
      ],
      assessmentAreas: [
        "Health and safety statutory compliance and risk assessment quality",
        "Safer recruitment and HR policy framework compliance",
        "Financial controls, budget management, and ESFA compliance",
        "Premises management and DfE estates standards",
      ],
    },
  ],

  methodology: [
    {
      number: "01",
      title: "Discovery",
      body: "We begin every engagement with a structured discovery process — reviewing existing documentation, conducting stakeholder conversations, and mapping your compliance landscape against the statutory frameworks relevant to your school or trust. This phase establishes a clear baseline and ensures our assessment is calibrated to your specific context, scale, and risk profile rather than applied as a generic template.",
    },
    {
      number: "02",
      title: "Assessment",
      body: "Our expert consultants conduct a rigorous, evidence-based assessment across each relevant framework pillar — examining documentation quality, real-world practices, staff capability, and governance oversight against the standards that matter to Ofsted, the ESFA, the ICO, and the HSE. Every finding is grounded in evidence, cross-referenced against statutory requirements, and assessed for both compliance status and operational impact.",
    },
    {
      number: "03",
      title: "Intelligence",
      body: "Assessment findings are synthesised into a clear intelligence picture — a structured report that translates raw compliance data into strategic insight, RAG-rated by priority and organised around the governance decisions your leaders need to make. Rather than presenting an undifferentiated list of recommendations, we give your SLT and board the intelligence they need to prioritise resources, manage risk, and demonstrate accountability.",
    },
    {
      number: "04",
      title: "Action",
      body: "Every engagement concludes with a prioritised, owned action plan that gives your team a clear pathway from current state to compliance confidence — with realistic timescales, identified resource requirements, and measurable success criteria. We remain available to support implementation, review progress, and provide follow-up assurance as you work through the plan, ensuring that our intelligence translates into genuine, lasting improvement.",
    },
  ],

  standardsAlignment: [
    {
      framework: "KCSIE 2024",
      description:
        "The statutory safeguarding framework that all schools and colleges in England must comply with, setting out responsibilities for online safety, DSL oversight, and the safe recruitment and management of staff.",
      icon: "shield",
    },
    {
      framework: "DfE Governance Handbook 2023",
      description:
        "The definitive guidance for school and academy trust governance, setting out the roles, responsibilities, and standards of conduct expected of governors, trustees, and those in governance support roles.",
      icon: "building-2",
    },
    {
      framework: "UK GDPR / DPA 2018",
      description:
        "The principal data protection legislation governing how schools and trusts collect, store, use, and share personal data — enforced by the ICO and applicable to all processing activities involving staff, pupils, and third parties.",
      icon: "lock",
    },
    {
      framework: "NCSC Cyber Essentials",
      description:
        "The UK government-backed cyber security certification scheme that defines the five foundational technical controls schools should have in place to protect against the most common and damaging cyber threats.",
      icon: "server",
    },
    {
      framework: "DfE Data Protection Toolkit",
      description:
        "A self-assessment framework developed by the DfE to help schools and trusts evaluate their data protection practices against UK GDPR requirements and demonstrate accountability to governors, regulators, and the communities they serve.",
      icon: "database",
    },
    {
      framework: "DfE AI in Education Guidance",
      description:
        "Departmental guidance for educational settings on the responsible use of generative AI tools, covering staff use, student-facing applications, safeguarding considerations, and the governance expectations placed on school and trust leaders.",
      icon: "cpu",
    },
  ],
};
