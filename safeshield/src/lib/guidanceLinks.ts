const GUIDANCE_LINKS: Record<string, { label: string; url: string }[]> = {
  "Online Filtering": [
    { label: "DfE Filtering & Monitoring Standards", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/filtering-and-monitoring-standards-for-schools-and-colleges" },
  ],
  "Online Monitoring": [
    { label: "DfE Filtering & Monitoring Standards", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/filtering-and-monitoring-standards-for-schools-and-colleges" },
  ],
  "Policy": [
    { label: "UK Council for Internet Safety (UKCIS)", url: "https://www.gov.uk/government/organisations/uk-council-for-internet-safety" },
    { label: "DfE Online Safety Guidance", url: "https://www.gov.uk/government/publications/teaching-online-safety-in-schools" },
  ],
  "DSL & Staff": [
    { label: "KCSiE 2024 – Safeguarding Roles", url: "https://www.gov.uk/government/publications/keeping-children-safe-in-education--2" },
  ],
  "Curriculum": [
    { label: "Relationships & Sex Education Guidance", url: "https://www.gov.uk/government/publications/relationships-education-relationships-and-sex-education-rse-and-health-education" },
    { label: "Online Safety Teaching Resources", url: "https://www.gov.uk/government/publications/teaching-online-safety-in-schools" },
  ],
  "Governance": [
    { label: "DfE Governance Handbook", url: "https://www.gov.uk/government/publications/governance-handbook" },
    { label: "Ofsted School Inspection Handbook", url: "https://www.gov.uk/government/publications/school-inspection-handbook-eif" },
  ],
  "Devices": [
    { label: "DfE Device & Technology Standards", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges" },
  ],
  "Data Protection": [
    { label: "ICO Guide to UK GDPR", url: "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/" },
    { label: "DfE Data Protection Toolkit", url: "https://www.gov.uk/government/publications/data-protection-toolkit-for-schools" },
  ],
  "Safeguarding": [
    { label: "KCSiE 2024", url: "https://www.gov.uk/government/publications/keeping-children-safe-in-education--2" },
    { label: "Working Together to Safeguard Children", url: "https://www.gov.uk/government/publications/working-together-to-safeguard-children--2" },
  ],
  "Procurement": [
    { label: "DfE EdTech Procurement Guidance", url: "https://www.gov.uk/guidance/buying-for-schools/digital-devices-and-technology" },
    { label: "ICO Accountability Framework", url: "https://ico.org.uk/for-organisations/accountability-framework/" },
  ],
  "Staff Capability": [
    { label: "DfE Teacher CPD Standard", url: "https://www.gov.uk/government/publications/standard-for-teachers-professional-development" },
  ],
  "Board Structure": [
    { label: "DfE Governance Handbook", url: "https://www.gov.uk/government/publications/governance-handbook" },
  ],
  "Skills & Membership": [
    { label: "Competency Framework for Governance", url: "https://www.gov.uk/government/publications/governance-handbook" },
  ],
  "Statutory Compliance": [
    { label: "DfE Statutory Policies for Schools", url: "https://www.gov.uk/government/publications/statutory-policies-for-schools-and-academy-trusts" },
  ],
  "Accountability": [
    { label: "Ofsted School Inspection Handbook", url: "https://www.gov.uk/government/publications/school-inspection-handbook-eif" },
  ],
  "Financial Oversight": [
    { label: "DfE Schools Financial Value Standard", url: "https://www.gov.uk/guidance/schools-financial-value-standard-sfvs" },
  ],
  "Quality of Education": [
    { label: "Ofsted EIF – Quality of Education", url: "https://www.gov.uk/government/publications/education-inspection-framework" },
    { label: "DfE Curriculum Guidance", url: "https://www.gov.uk/government/collections/national-curriculum" },
  ],
  "Behaviour & Attitudes": [
    { label: "DfE Behaviour in Schools Guidance", url: "https://www.gov.uk/government/publications/behaviour-in-schools--2" },
  ],
  "Personal Development": [
    { label: "Ofsted EIF – Personal Development", url: "https://www.gov.uk/government/publications/education-inspection-framework" },
  ],
  "Leadership & Management": [
    { label: "Ofsted EIF – Leadership & Management", url: "https://www.gov.uk/government/publications/education-inspection-framework" },
  ],
  "SEND & Inclusion": [
    { label: "SEND Code of Practice", url: "https://www.gov.uk/government/publications/send-code-of-practice-0-to-25" },
  ],
  "Perceivable": [
    { label: "WCAG 2.1 – Perceivable Principles", url: "https://www.w3.org/WAI/WCAG21/Understanding/perceivable" },
  ],
  "Operable": [
    { label: "WCAG 2.1 – Operable Principles", url: "https://www.w3.org/WAI/WCAG21/Understanding/operable" },
  ],
  "Understandable": [
    { label: "WCAG 2.1 – Understandable Principles", url: "https://www.w3.org/WAI/WCAG21/Understanding/understandable" },
  ],
  "Robust": [
    { label: "WCAG 2.1 – Robust Principles", url: "https://www.w3.org/WAI/WCAG21/Understanding/robust" },
  ],
  "Legal & Compliance": [
    { label: "Public Sector Bodies Accessibility Regulations", url: "https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps" },
  ],
  "Fire Safety": [
    { label: "Regulatory Reform (Fire Safety) Order 2005", url: "https://www.legislation.gov.uk/uksi/2005/1541/contents/made" },
    { label: "HSE Fire Safety in Educational Premises", url: "https://www.hse.gov.uk/risk/firesafety.htm" },
  ],
  "COSHH": [
    { label: "HSE COSHH Guidance", url: "https://www.hse.gov.uk/coshh/" },
    { label: "COSHH Regulations 2002", url: "https://www.legislation.gov.uk/uksi/2002/2677/contents/made" },
  ],
  "Premises & Facilities": [
    { label: "HSE Legionella Guidance", url: "https://www.hse.gov.uk/legionnaires/" },
    { label: "HSE Asbestos in Schools", url: "https://www.hse.gov.uk/asbestos/schools.htm" },
    { label: "Electricity at Work Regs 1989", url: "https://www.legislation.gov.uk/uksi/1989/635/contents/made" },
  ],
  "Policies & Documentation": [
    { label: "Health & Safety at Work Act 1974", url: "https://www.legislation.gov.uk/ukpga/1974/37/contents" },
    { label: "RIDDOR 2013 – HSE Guidance", url: "https://www.hse.gov.uk/riddor/" },
    { label: "Management of H&S at Work Regs 1999", url: "https://www.legislation.gov.uk/uksi/1999/3242/contents/made" },
  ],
  "Staff & Pupil Welfare": [
    { label: "HSE First Aid at Work", url: "https://www.hse.gov.uk/firstaid/" },
    { label: "Manual Handling Operations Regs 1992", url: "https://www.hse.gov.uk/pubns/indg143.htm" },
    { label: "HSE Work-related Stress Guidance", url: "https://www.hse.gov.uk/stress/" },
  ],
  "Contractors & Visitors": [
    { label: "HSE Managing Contractors", url: "https://www.hse.gov.uk/involvement/contractors.htm" },
    { label: "DfE Keeping Children Safe in Education", url: "https://www.gov.uk/government/publications/keeping-children-safe-in-education--2" },
  ],
  "Digital Safeguarding": [
    { label: "DfE Filtering & Monitoring Standards", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/filtering-and-monitoring-standards-for-schools-and-colleges" },
    { label: "KCSiE 2024 – Online Safety", url: "https://www.gov.uk/government/publications/keeping-children-safe-in-education--2" },
  ],
  "Cyber Security": [
    { label: "DfE Cyber Security Standards for Schools", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/cyber-security-standards-for-schools-and-colleges" },
    { label: "NCSC Cyber Security for Schools", url: "https://www.ncsc.gov.uk/section/education-skills/schools" },
  ],
  "Data & GDPR": [
    { label: "ICO Guide to UK GDPR", url: "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/" },
    { label: "DfE Data Protection Toolkit for Schools", url: "https://www.gov.uk/government/publications/data-protection-toolkit-for-schools" },
  ],
  "Ofsted Readiness": [
    { label: "Ofsted Education Inspection Framework", url: "https://www.gov.uk/government/publications/education-inspection-framework" },
    { label: "DfE Digital Standards for Schools", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges" },
  ],
  "Accessibility": [
    { label: "Public Sector Bodies Accessibility Regulations", url: "https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps" },
    { label: "WCAG 2.1 Guidelines", url: "https://www.w3.org/WAI/WCAG21/quickref/" },
  ],
  "Infrastructure": [
    { label: "DfE Digital & Technology Standards", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges" },
    { label: "ICO Guidance on Cloud Services", url: "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/accountability-and-governance/data-protection-by-design-and-default/" },
  ],
  "AI Signal": [
    { label: "DfE Generative AI in Education", url: "https://www.gov.uk/government/publications/generative-artificial-intelligence-in-education" },
  ],
};

export default GUIDANCE_LINKS;
