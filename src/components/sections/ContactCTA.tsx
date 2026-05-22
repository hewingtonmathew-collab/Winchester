import ButtonPrimary from "@/components/ui/ButtonPrimary";
import GlassCard from "@/components/ui/GlassCard";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Mail } from "lucide-react";

export default function ContactCTA() {
  return (
    <>
      <SectionDivider />
      <section className="py-24 bg-[#111A23]" aria-labelledby="contact-cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <p className="eyebrow mb-4 reveal">Get in Touch</p>
            <h2
              id="contact-cta-heading"
              className="heading-display text-3xl lg:text-5xl mb-6 reveal reveal-delay-1"
            >
              Let&apos;s Start a
              <br />
              <span style={{ color: "#C9A84C" }}>Conversation.</span>
            </h2>
            <p className="font-inter text-[#E6E9ED] text-base leading-relaxed mb-10 max-w-xl mx-auto reveal reveal-delay-2">
              Whether you have a specific compliance challenge or want to understand how
              Winchester Consultancy can support your school or trust, we&apos;d love to
              hear from you.
            </p>

            <GlassCard variant="prominent" className="flex items-center justify-center gap-5 mb-8 reveal reveal-delay-3">
              <a
                href="mailto:hello@winchesterconsultancy.co.uk"
                className="inline-flex items-center gap-2 text-[#A7B1BE] hover:text-white transition-colors font-inter text-sm"
              >
                <Mail size={15} strokeWidth={1.5} className="text-[#C9A84C]" aria-hidden="true" />
                hello@winchesterconsultancy.co.uk
              </a>
            </GlassCard>

            <div className="reveal reveal-delay-4">
              <ButtonPrimary href="/contact" className="mx-auto">
                Send a Message
              </ButtonPrimary>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
