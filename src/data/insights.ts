export type Article = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
  author: string;
  readTime: string;
};

export const articles: Article[] = [
  {
    id: "1",
    category: "Safeguarding",
    title: "Navigating the Updated Keeping Children Safe in Education 2024",
    excerpt:
      "KCSIE 2024 introduces significant changes to online safety requirements, DSL responsibilities, and the definition of harm that every school leader must understand before the autumn term. This article unpacks the statutory changes in plain English, identifies the compliance gaps most commonly found in schools during the transition, and sets out a prioritised action checklist for headteachers and designated safeguarding leads.",
    date: "15 October 2024",
    href: "/insights/kcsie-2024",
    author: "Winchester Consultancy",
    readTime: "5 min read",
  },
  {
    id: "2",
    category: "AI Governance",
    title: "Should Your Trust Have an AI Policy? A Practical Framework",
    excerpt:
      "As generative AI enters classrooms and back offices alike, the absence of a clear, adopted AI governance framework is rapidly becoming a compliance and safeguarding risk that trust boards can no longer ignore. We outline the five essential pillars of a defensible AI governance policy — covering staff use, student-facing tools, academic integrity, data protection obligations under UK GDPR, and the procurement due-diligence process that every trust should be applying before deploying AI products at scale.",
    date: "3 September 2024",
    href: "/insights/ai-policy-framework",
    author: "Winchester Consultancy",
    readTime: "7 min read",
  },
  {
    id: "3",
    category: "Governance",
    title: "What Ofsted's New Report Cards Mean for MAT Governance",
    excerpt:
      "Ofsted's evolving inspection model shifts significant scrutiny onto the governance and strategic leadership of multi-academy trusts — raising the stakes for trust boards that cannot clearly evidence how they hold executives to account. This article unpacks what the new report card framework means in practice for local governing bodies and trust boards, and identifies the governance documentation, assurance processes, and board behaviours that inspectors will expect to see demonstrated.",
    date: "22 August 2024",
    href: "/insights/ofsted-report-cards",
    author: "Winchester Consultancy",
    readTime: "4 min read",
  },
];
