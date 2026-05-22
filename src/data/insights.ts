export type Article = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
  author: string;
  readTime: string;
  content: string;
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
    content: `The September 2024 update to Keeping Children Safe in Education is not a wholesale rewrite, but the changes it introduces are substantive enough to warrant a structured review by every designated safeguarding lead and headteacher before the start of the autumn term. Schools that treat KCSIE updates as an annual box-ticking exercise — updating a policy template and filing it — are the same schools that tend to present the most significant compliance gaps when we conduct assurance reviews.

The most consequential change in the 2024 edition concerns online safety. Part 2 and Annex C have been significantly strengthened to reflect the Online Safety Act 2023 and the growing body of evidence on the harms children experience in digital environments. Annex C now carries greater weight as a reference document for DSLs: it articulates the range of online harms — from cyberbullying and sexual exploitation to radicalisation and the consumption of self-harm content — and expects schools to have a coherent, documented approach to each. Critically, the 2024 revision expects schools to go beyond filtering and monitoring. Leaders must be able to demonstrate that staff understand online risks, that the curriculum meaningfully addresses online safety at each key stage, and that the school's online safety policy is a live document rather than a static annual upload.

Terminology has also shifted. The 2024 guidance introduces more explicit language around the concept of "harmful sexual behaviour" and the intersections between child-on-child abuse, peer-on-peer harm, and contextual safeguarding. Part 5 has been revised to ensure that schools understand their obligations when concerns arise that implicate adults outside the school setting, including in online spaces. DSLs need to ensure that their referral pathways and record-keeping practices reflect this broader understanding of harm.

DSL expectations have been materially raised. The 2024 guidance is clearer than its predecessor that the designated safeguarding lead must be a member of the senior leadership team, must have sufficient time, resource, and authority to discharge their responsibilities effectively, and — importantly — must ensure that the deputy DSL structure provides genuine operational resilience, not just a named fallback. We regularly find in schools that the deputy DSL has received initial training but has not maintained it, and is not sufficiently embedded in the safeguarding referral process to act confidently in the lead's absence. KCSIE 2024 effectively closes the door on that model.

Governor oversight is another area where the 2024 guidance tightens expectations. The named governor for safeguarding must be able to demonstrate active scrutiny of the school's safeguarding arrangements — not just attendance at the annual designated safeguarding lead briefing. Boards should be routinely reviewing anonymised safeguarding data, challenging the quality of the single central record, and satisfying themselves that staff training is current and fit for purpose. Where Winchester conducts governance health checks, we consistently find that governing bodies are strong on intent but weak on evidencing the scrutiny cycle. The 2024 guidance makes this gap harder to defend.

For school leaders preparing for the autumn term, the priority actions are: first, ensure your safeguarding policy has been formally reviewed against the 2024 statutory guidance and adopted by the governing body; second, audit your DSL's and deputy DSL's training currency; third, review your online safety provision against the updated expectations in Annex C; and fourth, update your staff induction and annual training programme to reflect the revised harm definitions. If you are uncertain whether your current arrangements are fully compliant, Winchester's safeguarding assurance service provides a structured, evidence-based review that produces a clear action plan — not a generic report. Contact us to discuss how we can support your school's safeguarding compliance ahead of any inspection.`,
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
    content: `The question is no longer whether schools and trusts are using AI — they are, at pace, and often without governance structures that match the risk. Staff are using generative AI tools to draft lesson plans, write reports, and synthesise pupil data. Students are using them for homework, research, and increasingly for assessed work. The absence of a clear, board-adopted AI governance framework is not a sign that AI adoption is moving too fast for policy; it is a compliance exposure that sits squarely at the intersection of safeguarding, data protection, and organisational accountability.

The DfE published its guidance on generative AI in education in 2023, and while it is deliberately non-prescriptive, it is unambiguous on several points: schools must consider safeguarding implications before deploying AI tools that interact with children; data protection obligations under UK GDPR apply in full to any AI system that processes personal data; and there is an explicit expectation that staff are trained to use AI tools safely, critically, and transparently. The guidance does not mandate a specific policy format, but it does create the conditions under which the absence of any policy becomes indefensible.

A defensible AI governance framework for a multi-academy trust rests on five pillars. The first is a staff acceptable use policy for AI tools: a clear, adopted document that specifies which AI tools staff may use for which purposes, how they should handle pupil data within those tools, what disclosure obligations exist when AI-assisted content is shared with parents or published, and what the consequences of misuse are. The second pillar is a student-facing tool governance process: before any AI tool is made available to students — whether through a curriculum programme, a learning platform, or a teacher-initiated activity — it should pass a documented approval process that considers safeguarding risk, data flows, and age-appropriateness. The third pillar is an academic integrity framework that addresses AI specifically: existing policies written before 2022 almost certainly do not do this adequately, and trusts should treat this as a priority update given the pace at which AI-assisted academic dishonesty is developing.

The fourth pillar is UK GDPR and Data Protection Impact Assessment compliance. Any AI tool that processes personal data — which includes, in most cases, AI writing assistants used by staff who reference pupil information, AI marking tools, and AI-powered management information integrations — requires a DPIA before deployment. This is not optional. We find, consistently, that trusts have deployed AI tools at scale without completing a DPIA, without reviewing the tool's data processor agreement against their own data protection framework, and without considering whether the tool involves any international data transfer that requires additional safeguards. The fifth pillar is procurement due diligence: before a trust purchases or adopts any AI-powered product, it should apply a structured assessment covering data residency, third-party sharing, model training practices, and the provider's approach to child safety.

The most common mistakes we see trusts make are not exotic failures — they are straightforward omissions. Tools are adopted because a motivated teacher finds them useful, without any central awareness or review. Staff use consumer-grade AI tools to process information that includes pupil names, SEND data, or behaviour records, because no one has told them not to. Students are exposed to AI-generated content without any framework for critical evaluation or disclosure. And when an issue arises — a data breach notification, a parent complaint, or an Ofsted question about digital safeguarding — the trust discovers it has no documented governance trail to fall back on.

Getting this right does not require a 40-page policy document. It requires a clear, proportionate framework that is actually adopted, communicated, and reviewed annually. Winchester's AI governance service helps trusts build that framework efficiently, drawing on the DfE guidance, the ICO's guidance on AI and data protection, and the practical experience of what robust governance looks like in the school context. If your trust is deploying AI without a formal governance framework, the time to act is before an issue materialises — not after. Get in touch to find out how we can help.`,
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
    content: `Ofsted's move toward a report card model represents the most significant shift in the inspection framework for multi-academy trusts since the introduction of section 5 inspections. For trust boards that have been content with a broadly functional governance structure, the new model introduces a materially higher bar — one that requires evidence of systematic, documented oversight rather than the informal accountability that characterises many board-executive relationships in the sector.

The core change is this: where the previous framework assessed individual schools primarily through an educational quality lens, the report card model explicitly surfaces governance and strategic leadership as discrete judgement areas. Trust boards will no longer be able to rely on strong school-level outcomes to offset weak governance documentation. Inspectors will be looking for evidence that the board holds the executive team to account through structured mechanisms — not just through constructive relationships. The DfE Governance Handbook, which trusts are required to have regard to, is clear that effective governance involves challenge, not just support. The new inspection model operationalises that expectation.

What does this mean in practice? Trust boards must be able to demonstrate, with documentary evidence, that they have a clear and current scheme of delegation that accurately reflects how authority is distributed between the trust board, any local governing bodies, and the executive leadership team. We find, in a significant proportion of the governance reviews we conduct, that trusts are operating against schemes of delegation that are either out of date, inconsistently applied, or not well understood by the people they govern. An inspector who asks a trust board member to explain how major decisions are escalated, or how the board receives assurance on financial controls, should receive a consistent and well-evidenced answer — not a vague reference to "regular updates from the CEO."

Financial accountability is a particular focus. The ESFA Academy Trust Handbook sets out the financial management obligations of trust boards in detail, and the new inspection model brings these into sharper relief. Boards should be able to evidence that they receive regular, structured financial reporting; that the audit and risk committee is functioning effectively; and that the board is actively monitoring financial health against the trust's own risk appetite framework. In trusts where the finance function has been heavily centralised at executive level, it is not uncommon for board members to be receiving high-level summaries rather than the substantive financial data they need to exercise genuine oversight.

The role of local governing bodies in the new inspection model is nuanced and, for many trusts, unresolved. The report card framework does not prescribe a uniform structure for local governance, but it does expect trusts to be able to explain their local governance model and evidence that it is working as intended. Where a trust has retained local governing bodies with delegated responsibilities, those bodies should be able to demonstrate that they are discharging those responsibilities effectively. Where a trust has moved to a more centralised model with advisory boards or school improvement panels, the board should be able to articulate the rationale for that structure and how it provides assurance on school-level performance.

Common governance documentation gaps that leave trusts exposed in inspection include: a scheme of delegation that has not been reviewed since the trust's formation; board minutes that record decisions without evidencing the scrutiny that preceded them; an absence of a formal quality assurance framework that connects school improvement data to board-level reporting; and a risk register that is maintained by the executive team without active board engagement. None of these gaps are difficult to address, but they require a deliberate programme of governance improvement rather than incremental updates to existing documents.

Winchester's governance service works with trust boards to conduct structured governance health checks, produce prioritised improvement plans, and support the development of documentation and assurance frameworks that will withstand inspection scrutiny. Whether your trust is preparing for an imminent inspection or undertaking a longer-term governance development programme, we would welcome the opportunity to discuss how we can help. Contact us to arrange an initial conversation.`,
  },
];
