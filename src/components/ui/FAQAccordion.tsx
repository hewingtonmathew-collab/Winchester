"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What is GuardianOS and how does it work?",
    a: "GuardianOS is the compliance operating system that powers SafeShield. It integrates six compliance domains — digital safeguarding, cyber security, GDPR, AI governance, filtering & monitoring, and governor oversight — into a single structured platform. Each domain is RAG-rated, evidence-linked and built around how school leaders actually work.",
  },
  {
    q: "How quickly can our school get started?",
    a: "Most schools are fully onboarded within 5 working days. The process starts with a structured Readiness Review that maps your current position across all compliance domains. From there, GuardianOS is configured around your school's specific policies, data and governance structure — no lengthy prep work required.",
  },
  {
    q: "Is SafeShield aligned to KCSIE 2024?",
    a: "Yes. SafeShield is fully aligned to Keeping Children Safe in Education 2024, including Part 1 requirements, online safety, filtering and monitoring, and safeguarding governance. Our Policy Checker continuously cross-references your policies against the current KCSIE framework and flags any gaps automatically.",
  },
  {
    q: "Can SafeShield support a Multi-Academy Trust?",
    a: "Absolutely. SafeShield is built to operate at school, MAT and LA level. The platform provides trust-wide oversight with school-by-school RAG comparisons and consolidated board-level reporting. Each school maintains its individual evidence trail while MAT directors and governors see the full picture in one view.",
  },
  {
    q: "How is our data kept secure and who owns it?",
    a: "All data is stored in UK-based, ISO 27001-aligned infrastructure with end-to-end encryption at rest and in transit. SafeShield acts as a Data Processor under UK GDPR — your school remains the Data Controller. We provide a Data Processing Agreement as standard, and our security practices are designed around your DPO's requirements.",
  },
  {
    q: "What if we are currently failing a compliance domain?",
    a: "That is exactly what SafeShield is built for. The Readiness Review identifies gaps without judgement, and GuardianOS structures your remediation pathway with prioritised actions, owner assignment and deadline tracking. Schools typically move from Red to Amber within one school term, with a clear audit trail showing progress.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2" role="list">
      {faqs.map((faq, i) => (
        <div
          key={i}
          role="listitem"
          className="rounded-2xl overflow-hidden transition-all duration-200"
          style={{
            background: open === i ? "rgba(0,212,255,0.03)" : "rgba(10,12,20,0.55)",
            border: open === i
              ? "1px solid rgba(0,212,255,0.18)"
              : "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(24px)",
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            aria-controls={`faq-answer-${i}`}
            id={`faq-question-${i}`}
            className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-2xl"
          >
            <span
              className={cn(
                "font-sans text-base font-semibold transition-colors duration-200",
                open === i
                  ? "text-primary"
                  : "text-on-surface group-hover:text-primary"
              )}
            >
              {faq.q}
            </span>
            <ChevronDown
              size={18}
              aria-hidden="true"
              className={cn(
                "shrink-0 transition-all duration-300 motion-reduce:transition-none",
                open === i
                  ? "rotate-180 text-primary"
                  : "rotate-0 text-on-surface-variant/50 group-hover:text-primary/60"
              )}
            />
          </button>

          <div
            id={`faq-answer-${i}`}
            role="region"
            aria-labelledby={`faq-question-${i}`}
            className={cn(
              "overflow-hidden transition-all duration-300 motion-reduce:transition-none",
              open === i ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="px-7 pb-6 border-t border-white/[0.05]">
              <p className="font-sans text-body-sm text-on-surface-variant leading-relaxed pt-5">
                {faq.a}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
