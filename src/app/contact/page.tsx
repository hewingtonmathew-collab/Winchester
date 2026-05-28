import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Clock, CalendarDays } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import GlassPanel from "@/components/ui/GlassPanel";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact SafeShield",
  description:
    "Have a question about SafeShield, want to discuss your school's needs, or ready to book a Readiness Review? Get in touch — we'd be glad to hear from you.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        palette="green"
        variant="centered"
        eyebrow="CONTACT"
        title="Get in touch with SafeShield"
        titleHighlight="SafeShield"
        description="Have a question, want to discuss your school's compliance needs, or ready to book a Readiness Review? We'd be glad to hear from you."
        ctaPrimary={{ label: "Book a Review", href: "/book-review" }}
        badge={{ label: "Response within 1 business day", variant: "green" }}
      />

      <section className="py-section" aria-labelledby="contact-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sr-only">
            <h2 id="contact-heading">Contact SafeShield</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Contact form */}
            <GlassPanel className="p-6 sm:p-8">
              <ContactForm />
            </GlassPanel>

            {/* Contact details */}
            <div className="flex flex-col gap-6">
              <GlassPanel className="p-6 flex flex-col gap-5">
                <h2 className="text-body-lg font-semibold text-on-surface">
                  Contact details
                </h2>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg bg-surface-low flex items-center justify-center flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <Mail size={16} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-on-surface mb-0.5">
                      Email
                    </p>
                    <a
                      href="mailto:hello@safeshield.education"
                      className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      hello@safeshield.education
                    </a>
                  </div>
                </div>

                {/* Readiness review bookings */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg bg-surface-low flex items-center justify-center flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <CalendarDays size={16} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-on-surface mb-0.5">
                      Readiness Review bookings
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      To book a Readiness Review, please use our{" "}
                      <Link
                        href="/book-review"
                        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                      >
                        dedicated booking page
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                {/* Response time */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg bg-surface-low flex items-center justify-center flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <Clock size={16} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-on-surface mb-0.5">
                      Response time
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      We aim to respond to all enquiries within 2 working days.
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg bg-surface-low flex items-center justify-center flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <MapPin size={16} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-on-surface mb-0.5">
                      Where we work
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      SafeShield works with schools across England and Wales.
                    </p>
                  </div>
                </div>
              </GlassPanel>

              {/* CTA panel */}
              <GlassPanel className="p-6 flex flex-col gap-4">
                <h3 className="text-body-lg font-semibold text-on-surface">
                  Ready to book?
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  If you&apos;re ready to book a Readiness Review, you can go straight to
                  the booking form and tell us about your school and priorities.
                </p>
                <Link
                  href="/book-review"
                  className="btn-primary self-start"
                >
                  Book a Readiness Review
                </Link>
              </GlassPanel>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
