import type { Metadata } from "next";
import { Mail, Phone, Clock, CheckCircle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import GlassPanel from "@/components/ui/GlassPanel";
import BookingForm from "@/components/forms/BookingForm";

export const metadata: Metadata = {
  title: "Book a Readiness Review | SafeShield",
  description:
    "Book a SafeShield Readiness Review and get a clear picture of your school's compliance position across digital safeguarding, cyber, GDPR, AI governance and governor accountability.",
};

const whatToExpect = [
  {
    step: "01",
    title: "Initial diagnostic",
    description:
      "We review your current policies, systems and evidence against KCSIE, NCSC and UK GDPR requirements — identifying where your school stands and where the gaps are.",
  },
  {
    step: "02",
    title: "Structured report",
    description:
      "You receive a clear RAG-rated report across every compliance domain, with prioritised actions written in plain language for headteachers and governors.",
  },
  {
    step: "03",
    title: "Debrief and support",
    description:
      "A structured discussion of findings with a SafeShield specialist — covering the report, answering your questions and agreeing next steps.",
  },
];

const whatHappensNext = [
  "We confirm receipt of your request within one working day",
  "A SafeShield specialist reviews your submission and contacts you to arrange a short scoping call",
  "We confirm the review scope and agree a date for the review to take place",
  "Your school receives its Readiness Review report and debrief within the agreed timeline",
];

export default function BookReviewPage() {
  return (
    <>
      <PageHero
        eyebrow="BOOK A READINESS REVIEW"
        title="Start with a structured review"
        titleHighlight="a structured review"
        description="A SafeShield Readiness Review gives you a clear picture of your school's current compliance position across digital safeguarding, cyber, GDPR, AI governance and governor accountability — with prioritised, actionable next steps."
        badge={{ label: "Schools & MATs", variant: "cyan" }}
      />

      {/* What to expect */}
      <section className="py-section" aria-labelledby="expect-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">THE PROCESS</p>
            <h2
              id="expect-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              What to{" "}
              <span className="text-primary text-glow">expect</span>
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              A Readiness Review is a structured, three-stage process designed to give
              you clarity, not more complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whatToExpect.map(({ step, title, description }) => (
              <GlassPanel key={step} as="article" className="p-6 flex flex-col gap-4">
                <span className="metric-number text-primary" aria-hidden="true">{step}</span>
                <h3 className="text-body-lg font-semibold text-on-surface">{title}</h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {description}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-cyan" aria-hidden="true" />

      {/* Booking form + sidebar */}
      <section className="py-section" aria-labelledby="form-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="eyebrow mb-3">REQUEST YOUR REVIEW</p>
            <h2
              id="form-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              Book your{" "}
              <span className="text-primary text-glow">Readiness Review</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Form */}
            <GlassPanel className="p-6 sm:p-8">
              <BookingForm variant="full" />
            </GlassPanel>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              {/* What happens next */}
              <GlassPanel className="p-6 flex flex-col gap-5">
                <h3 className="text-body-lg font-semibold text-on-surface">
                  What happens next
                </h3>
                <ul className="flex flex-col gap-3" role="list">
                  {whatHappensNext.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle
                        size={16}
                        className="text-primary flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <p className="text-body-sm text-on-surface-variant leading-relaxed">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </GlassPanel>

              {/* Timeline */}
              <GlassPanel className="p-6 flex flex-col gap-4">
                <h3 className="text-body-lg font-semibold text-on-surface">
                  Expected timeline
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <Clock
                      size={16}
                      className="text-primary flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-body-sm font-medium text-on-surface">
                        Initial response
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        Within 2 working days of your request
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock
                      size={16}
                      className="text-primary flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-body-sm font-medium text-on-surface">
                        Review completion
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        Typically within 2 weeks of the agreed start date
                      </p>
                    </div>
                  </div>
                </div>
              </GlassPanel>

              {/* Contact */}
              <GlassPanel className="p-6 flex flex-col gap-4">
                <h3 className="text-body-lg font-semibold text-on-surface">
                  Contact us directly
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Mail
                      size={16}
                      className="text-primary flex-shrink-0"
                      aria-hidden="true"
                    />
                    <a
                      href="mailto:hello@safeshield.education"
                      className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      hello@safeshield.education
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone
                      size={16}
                      className="text-primary flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <p className="text-body-sm text-on-surface-variant">
                      Calls are available by arrangement — please email us to schedule.
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
