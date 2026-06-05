import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { services } from "@/data/services";
import ServiceIcon from "@/components/ui/ServiceIcon";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import SectionDivider from "@/components/ui/SectionDivider";
import ContactCTA from "@/components/sections/ContactCTA";
import { CheckCircle, ArrowRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { serviceSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";

type Params = { slug: string };

const serviceFaqs: Record<string, { question: string; answer: string }[]> = {
  safeguarding: [
    {
      question: "What does a digital safeguarding review include?",
      answer:
        "Our digital safeguarding review covers online filtering and monitoring provision, DSL capability assessment, acceptable use policy audit against KCSIE 2024, risk register development, and a governor briefing pack. You receive a prioritised action plan immediately implementable by your team.",
    },
    {
      question:
        "How does Winchester Consultancy align its safeguarding reviews to Ofsted?",
      answer:
        "We map every aspect of our review to Ofsted's inspection framework, ensuring the evidence we generate directly supports inspection readiness. Schools receive documentation in formats inspectors expect to see.",
    },
    {
      question: "How long does a digital safeguarding review take?",
      answer:
        "A standard digital safeguarding review typically takes one to two days on-site or remotely, followed by a written report delivered within five working days.",
    },
  ],
  governance: [
    {
      question:
        "What statutory governance requirements does Winchester Consultancy assess against?",
      answer:
        "We assess against the DfE's Governance Handbook, the Academy Trust Handbook, and Ofsted's leadership and management framework. Our review examines board composition, skills audits, committee structures, clerking effectiveness, and the quality of strategic oversight over compliance.",
    },
    {
      question:
        "How can governance reviews help a multi-academy trust improve oversight?",
      answer:
        "For MATs, our governance reviews examine trust-wide governance architecture — including scheme of delegation clarity, local governance body effectiveness, and the information flows between school-level and trust-board level. We identify gaps that create compliance blind spots and deliver a prioritised improvement roadmap.",
    },
    {
      question:
        "What does Winchester Consultancy deliver at the end of a governance review?",
      answer:
        "You receive a written assurance report, a governance effectiveness scorecard, a prioritised action plan referenced to statutory requirements, and a governor-ready briefing document suitable for presenting at a full board meeting.",
    },
  ],
  "ai-governance": [
    {
      question: "Why do schools need an AI governance policy?",
      answer:
        "AI tools are now widely used by staff and students in schools, yet most schools lack a formal governance structure to manage associated risks — including data privacy, algorithmic bias, academic integrity, and safeguarding. Without a policy, schools face regulatory exposure under UK GDPR, KCSIE, and emerging DfE guidance on technology in education.",
    },
    {
      question:
        "What does Winchester Consultancy's AI governance review cover?",
      answer:
        "Our review assesses current AI tool usage across the school, maps data flows to identify UK GDPR risks, evaluates existing policies for AI-specific gaps, reviews student and staff acceptable use frameworks, and produces a recommended AI governance policy aligned to DfE guidance and ICO expectations.",
    },
    {
      question:
        "How does AI governance connect to a school's safeguarding responsibilities?",
      answer:
        "AI-generated content, AI-powered communication tools, and generative AI platforms all introduce new safeguarding vectors — including inappropriate content generation and contact risks. Our AI governance work explicitly maps these risks to KCSIE duties and recommends mitigation controls that DSLs and senior leaders can implement immediately.",
    },
  ],
  "cyber-resilience": [
    {
      question:
        "What cyber threats are schools most exposed to and how does Winchester Consultancy address them?",
      answer:
        "Schools face elevated risk from ransomware, phishing, and supply-chain compromise. Our cyber resilience review assesses your technical controls, staff awareness culture, incident response capability, and backup and recovery posture — benchmarked against the NCSC's Cyber Essentials framework and DfE cyber standards for schools.",
    },
    {
      question:
        "Does a cyber resilience review help with cyber insurance requirements?",
      answer:
        "Yes. Insurers increasingly require schools to demonstrate baseline controls before issuing or renewing cyber insurance. Our review provides evidence of your control posture and our recommendations directly support policy compliance, helping schools meet insurer requirements and reduce premium risk.",
    },
    {
      question:
        "What is delivered at the end of a cyber resilience assessment?",
      answer:
        "You receive a technical risk register, a control gap analysis referenced to NCSC guidance and DfE standards, a prioritised remediation roadmap, and a governor-level summary suitable for reporting to your board's finance or audit committee.",
    },
  ],
  "data-protection": [
    {
      question:
        "What UK GDPR obligations are schools most commonly found to breach?",
      answer:
        "The most common gaps we identify are incomplete or outdated Records of Processing Activities (RoPA), absent or inadequate data retention schedules, insufficient Data Protection Impact Assessment (DPIA) processes for new technologies, and weak third-party processor due diligence. Our review systematically assesses all of these areas.",
    },
    {
      question:
        "Do schools legally require a Data Protection Officer and can Winchester Consultancy provide this?",
      answer:
        "Under UK GDPR, most schools are required to appoint a Data Protection Officer given their processing of special category data relating to children. Winchester Consultancy provides DPO-as-a-service and interim DPO support, giving schools access to expert oversight without the cost of a full-time appointment.",
    },
    {
      question:
        "How does a Winchester data protection review prepare us for an ICO investigation?",
      answer:
        "Our review generates documented evidence of your compliance posture — including a current RoPA, DPIA register, privacy notice audit, and staff training records. This evidence base is exactly what the ICO expects to see in the event of a complaint or data breach investigation, and significantly reduces regulatory risk.",
    },
  ],
  operational: [
    {
      question:
        "What does Winchester Consultancy's operational assurance review cover?",
      answer:
        "Our operational assurance review examines the compliance infrastructure underpinning day-to-day school management — including statutory policy compliance, single central record accuracy, premises and health and safety obligations, contractor management, and the adequacy of internal monitoring and reporting processes.",
    },
    {
      question:
        "How does operational assurance connect to Ofsted readiness?",
      answer:
        "Operational compliance failures are one of the fastest routes to an inadequate Ofsted judgement. Our review maps your operational posture directly to Ofsted's inspection criteria, identifying evidence gaps and generating inspector-ready documentation across all key compliance domains.",
    },
    {
      question:
        "Can operational assurance reviews be carried out for multi-academy trusts centrally?",
      answer:
        "Yes. We offer trust-wide operational assurance programmes that assess compliance posture across all schools within a MAT, producing both school-level reports and a consolidated trust-level dashboard. This gives trust boards a single view of operational risk across their portfolio.",
    },
  ],
  "hr-finance": [
    {
      question:
        "What HR compliance risks are schools most exposed to?",
      answer:
        "Schools frequently carry risk in areas including single central record maintenance, safer recruitment compliance, contractor and agency staff vetting, disciplinary and grievance procedure alignment with statutory codes, and staff data handling under UK GDPR. Our HR compliance review examines all of these domains and benchmarks findings against statutory requirements.",
    },
    {
      question:
        "How does Winchester Consultancy support financial governance in schools?",
      answer:
        "We review financial governance structures against the Academy Trust Handbook and maintained school financial management guidance — examining scheme of delegation, internal scrutiny arrangements, conflicts of interest registers, and the adequacy of financial reporting to governors. Our output helps boards demonstrate proper stewardship of public funds.",
    },
    {
      question:
        "What HR and finance documentation should schools prioritise reviewing?",
      answer:
        "Priority documents include the single central record, safer recruitment policy, disciplinary and capability procedures, staff handbook, financial regulations, conflicts of interest policy, and governor expense and hospitality registers. Our review assesses currency, statutory alignment, and evidence of implementation for all of these.",
    },
  ],
  "health-safety": [
    {
      question:
        "What are the key health and safety statutory duties schools must comply with?",
      answer:
        "Schools must comply with the Health and Safety at Work Act 1974, the Management of Health and Safety at Work Regulations 1999, and a range of sector-specific requirements covering fire safety, asbestos management, legionella control, contractor management, and educational visits. Our review assesses compliance across all of these statutory domains.",
    },
    {
      question:
        "How does Winchester Consultancy's health and safety review differ from a standard audit?",
      answer:
        "Unlike a checklist-based audit, our review evaluates the quality of your safety management system — examining whether risk assessments are suitable and sufficient, whether roles and responsibilities are clearly assigned and documented, and whether monitoring and review processes are genuinely embedded rather than paper-based. We produce findings that hold up to HSE scrutiny.",
    },
    {
      question:
        "What evidence of health and safety compliance do governors need to see?",
      answer:
        "Governors are legally responsible for health and safety oversight. They should receive regular reports on risk assessment currency, incident and near-miss data, fire drill records, statutory inspection completion, and any significant compliance gaps. Our governor briefing document provides exactly this evidence in a format suitable for board-level review.",
    },
  ],
  strategic: [
    {
      question:
        "What does strategic compliance support from Winchester Consultancy involve?",
      answer:
        "Strategic compliance support provides senior leaders and trustees with expert intelligence to navigate the evolving regulatory landscape. This includes horizon-scanning for upcoming statutory changes, strategic risk register development, board-level compliance reporting, and direct support to headteachers and CEOs in building sustainable compliance infrastructure.",
    },
    {
      question:
        "How can a school or trust build a long-term compliance strategy?",
      answer:
        "Sustainable compliance requires moving beyond reactive firefighting to a planned, intelligence-led approach. Winchester Consultancy works with leadership teams to build multi-year compliance roadmaps, establish internal monitoring cycles, develop governor oversight frameworks, and create a culture where compliance is embedded in strategic planning rather than bolted on.",
    },
    {
      question:
        "What is the value of ongoing strategic compliance partnership versus one-off reviews?",
      answer:
        "One-off reviews provide a point-in-time snapshot. Our strategic partnership model provides continuous assurance — with regular horizon-scanning updates, quarterly compliance health checks, and direct access to expert advice when new regulatory challenges emerge. Schools and trusts that engage on a partnership basis consistently demonstrate stronger compliance posture at inspection.",
    },
  ],
  "compliance-intelligence": [
    {
      question:
        "What is compliance intelligence and how does it differ from a standard audit?",
      answer:
        "Compliance intelligence goes beyond identifying what is non-compliant to understanding why gaps exist, what risk they represent, and how to close them in a way that is sustainable. Our intelligence-led approach combines regulatory analysis, operational insight, and sector benchmarking to produce findings that drive genuine improvement rather than just producing a report.",
    },
    {
      question:
        "How does Winchester Consultancy's compliance intelligence service support inspection preparation?",
      answer:
        "We build a structured evidence base aligned to Ofsted and regulatory inspection frameworks — ensuring that when an inspector arrives, your school or trust has documented proof of compliance across all key domains. Our intelligence reports are designed to be inspector-ready, reducing the time and stress associated with gathering evidence under inspection pressure.",
    },
    {
      question:
        "What reporting does Winchester Consultancy provide as part of its compliance intelligence service?",
      answer:
        "Schools and trusts receive a compliance intelligence dashboard, domain-by-domain risk assessments, a prioritised action plan referenced to statutory requirements, trend analysis across reporting periods, and an executive summary suitable for presentation to the board. Reports are available in digital and printable formats.",
    },
  ],
};

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.id }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const service = services.find((s) => s.id === params.slug);
  if (!service) return {};
  return {
    title: `${service.title} | Winchester Consultancy`,
    description: service.detail.intro.slice(0, 160),
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | Winchester Consultancy`,
      description: service.detail.intro.slice(0, 160),
    },
  };
}

export default function ServiceDetailPage({ params }: { params: Params }) {
  const service = services.find((s) => s.id === params.slug);
  if (!service) notFound();

  const related = services.filter((s) => s.id !== service.id).slice(0, 3);
  const faqs = serviceFaqs[service.id] ?? [];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(service),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Services", href: "/services" },
            { name: service.title, href: service.href },
          ]),
          ...(faqs.length > 0 ? [faqSchema(faqs)] : []),
        ]}
      />
      {/* Hero */}
      <section className="pt-36 pb-20 bg-[#0B1118] relative overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(201,168,76,0.10) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(11,17,24,0.9) 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-inter text-xs text-[#A7B1BE] mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-[#C9A84C]">{service.title}</span>
          </nav>

          <div className="flex items-start gap-5 mb-6">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
              style={{
                background: "rgba(27,36,48,0.7)",
                border: "1px solid rgba(201,168,76,0.35)",
              }}
            >
              <ServiceIcon name={service.icon} size={26} />
            </div>
            <div>
              <p className="eyebrow mb-2">{service.detail.tagline}</p>
              <h1 className="heading-display text-4xl lg:text-5xl text-balance">
                {service.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Intro + deliverables */}
      <section className="py-24 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-6">
            <h2 className="font-cinzel font-bold text-white text-2xl lg:text-3xl leading-snug">
              What We Deliver
            </h2>
            <p className="font-inter text-[#E6E9ED] leading-relaxed text-base">
              {service.detail.intro}
            </p>
            <div className="pt-2">
              <ButtonPrimary href="/contact">Discuss This Service</ButtonPrimary>
            </div>
          </div>

          <GlassCard className="flex flex-col gap-4">
            <h3 className="font-cinzel font-bold text-white text-sm tracking-wider uppercase mb-2">
              Service Deliverables
            </h3>
            <ul className="flex flex-col gap-3">
              {service.detail.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle
                    size={15}
                    className="text-[#C9A84C] flex-shrink-0 mt-0.5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </section>

      <SectionDivider />

      {/* Outcomes */}
      <section className="py-20 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-cinzel font-bold text-white text-2xl lg:text-3xl mb-12 text-center">
            Outcomes You Can Expect
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.detail.outcomes.map((outcome, i) => (
              <GlassCard key={i} className="flex flex-col gap-3">
                <span
                  className="font-cinzel font-bold text-[#C9A84C] text-2xl"
                  aria-hidden="true"
                >
                  0{i + 1}
                </span>
                <p className="font-inter text-[#E6E9ED] text-sm leading-relaxed">
                  {outcome}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Related services */}
      <section className="py-20 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-cinzel font-bold text-white text-xl mb-8">
            Related Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((s) => (
              <GlassCard key={s.id} hover className="flex flex-col gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(11,17,24,0.6)",
                    border: "1px solid rgba(201,168,76,0.25)",
                  }}
                >
                  <ServiceIcon name={s.icon} size={16} />
                </div>
                <h3 className="font-cinzel font-bold text-white text-xs leading-snug">
                  {s.title}
                </h3>
                <p className="font-inter text-[#A7B1BE] text-xs leading-relaxed flex-1">
                  {s.description}
                </p>
                <Link
                  href={s.href}
                  aria-label={`Learn more about ${s.title}`}
                  className="inline-flex items-center gap-1.5 text-[#C9A84C] text-xs font-inter font-medium group transition-all duration-200"
                >
                  Learn More
                  <ArrowRight
                    size={12}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
