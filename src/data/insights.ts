export type Article = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
};

export const articles: Article[] = [
  {
    id: "1",
    category: "Safeguarding",
    title: "Navigating the Updated Keeping Children Safe in Education 2024",
    excerpt:
      "An overview of the key changes to KCSiE 2024 and what school leaders must action before the autumn term.",
    date: "15 October 2024",
    href: "/insights/kcsie-2024",
  },
  {
    id: "2",
    category: "AI Governance",
    title: "Should Your Trust Have an AI Policy? A Practical Framework",
    excerpt:
      "As generative AI enters classrooms and back offices alike, we outline the five pillars of a defensible AI governance framework.",
    date: "3 September 2024",
    href: "/insights/ai-policy-framework",
  },
  {
    id: "3",
    category: "Governance",
    title: "What Ofsted's New Report Cards Mean for MAT Governance",
    excerpt:
      "Unpacking the implications of Ofsted's evolving inspection model for trust boards and local governing bodies.",
    date: "22 August 2024",
    href: "/insights/ofsted-report-cards",
  },
];
