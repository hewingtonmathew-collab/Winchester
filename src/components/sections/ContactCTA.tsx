import ButtonPrimary from "@/components/ui/ButtonPrimary";
import GlassCard from "@/components/ui/GlassCard";
import SectionDivider from "@/components/ui/SectionDivider";
import { Mail, Phone } from "lucide-react";

export default function ContactCTA() {
  return (
    <>
      <SectionDivider />
      <section className="py-24 bg-[#111A23]" aria-labelledby="contact-cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="eyebrow mb-4">Get in Touch</p>
          <h2
            id="contact-cta-heading"
            className="heading-display text-3xl lg:text-5xl mb-6"
          >
            Let&apos;s Start a
            <br />
            Conversation.
          </h2>
          <p className="font-inter text-[#E6E9ED] text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Whether you have a specific compliance challenge or want to understand how
            Winchester Consultancy can support your school or trust, we&apos;d love to
            hear from you.
          </p>

          <GlassCard className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8">
            <a
              href="mailto:hello@winchesterconsultancy.co.uk"
              className="inline-flex items-center gap-2 text-[#A7B1BE] hover:text-white transition-colors font-inter text-sm"
            >
              <Mail size={15} strokeWidth={1.5} className="text-[#C9A84C]" />
              hello@winchesterconsultancy.co.uk
            </a>
            <div className="hidden sm:block h-4 w-px bg-[#2A3340]" aria-hidden="true" />
            <a
              href="tel:+441234567890"
              className="inline-flex items-center gap-2 text-[#A7B1BE] hover:text-white transition-colors font-inter text-sm"
            >
              <Phone size={15} strokeWidth={1.5} className="text-[#C9A84C]" />
              +44 (0) 1234 567 890
            </a>
          </GlassCard>

          <ButtonPrimary href="/contact" className="mx-auto">
            Send a Message
          </ButtonPrimary>
        </div>
      </section>
    </>
  );
}
