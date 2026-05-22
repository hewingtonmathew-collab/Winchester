import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import SectionDivider from "@/components/ui/SectionDivider";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | Winchester Consultancy",
  description:
    "Get in touch with Winchester Consultancy. Whether you have a compliance challenge or simply want to learn more, we are here to help.",
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-36 pb-20 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">Get in Touch</p>
          <h1 className="heading-display text-4xl lg:text-6xl mb-6">
            Let&apos;s Start a
            <br />
            Conversation.
          </h1>
          <p className="font-inter text-[#A7B1BE] text-lg max-w-2xl leading-relaxed">
            Whether you need assurance, guidance or a trusted partner, we&apos;re here to help.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="py-24 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact details */}
          <div className="flex flex-col gap-8">
            <h2 className="font-cinzel font-bold text-white text-2xl">
              Contact Details
            </h2>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: "rgba(11,17,24,0.6)",
                    border: "1px solid rgba(201,168,76,0.3)",
                  }}
                >
                  <Mail size={16} className="text-[#C9A84C]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-cinzel text-white text-xs tracking-wider uppercase font-bold mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:hello@winchesterconsultancy.co.uk"
                    className="font-inter text-[#A7B1BE] text-sm hover:text-white transition-colors"
                  >
                    hello@winchesterconsultancy.co.uk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: "rgba(11,17,24,0.6)",
                    border: "1px solid rgba(201,168,76,0.3)",
                  }}
                >
                  <Phone size={16} className="text-[#C9A84C]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-cinzel text-white text-xs tracking-wider uppercase font-bold mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:+441234567890"
                    className="font-inter text-[#A7B1BE] text-sm hover:text-white transition-colors"
                  >
                    +44 (0) 1234 567 890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: "rgba(11,17,24,0.6)",
                    border: "1px solid rgba(201,168,76,0.3)",
                  }}
                >
                  <MapPin size={16} className="text-[#C9A84C]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-cinzel text-white text-xs tracking-wider uppercase font-bold mb-1">
                    Location
                  </p>
                  <p className="font-inter text-[#A7B1BE] text-sm">
                    England &amp; Wales
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <GlassCard className="flex flex-col gap-5">
            <h2 className="font-cinzel font-bold text-white text-2xl mb-2">
              Send a Message
            </h2>

            <form className="flex flex-col gap-4" action="#" method="POST">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="font-inter text-[#A7B1BE] text-xs tracking-wider uppercase"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="bg-[rgba(11,17,24,0.6)] border border-[#2A3340] rounded-lg px-4 py-3 font-inter text-white text-sm placeholder-[#2A3340] focus:outline-none focus:border-[rgba(201,168,76,0.5)] transition-colors"
                    placeholder="Jane Smith"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="font-inter text-[#A7B1BE] text-xs tracking-wider uppercase"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-[rgba(11,17,24,0.6)] border border-[#2A3340] rounded-lg px-4 py-3 font-inter text-white text-sm placeholder-[#2A3340] focus:outline-none focus:border-[rgba(201,168,76,0.5)] transition-colors"
                    placeholder="jane@school.ac.uk"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="organisation"
                  className="font-inter text-[#A7B1BE] text-xs tracking-wider uppercase"
                >
                  Organisation
                </label>
                <input
                  id="organisation"
                  name="organisation"
                  type="text"
                  className="bg-[rgba(11,17,24,0.6)] border border-[#2A3340] rounded-lg px-4 py-3 font-inter text-white text-sm placeholder-[#2A3340] focus:outline-none focus:border-[rgba(201,168,76,0.5)] transition-colors"
                  placeholder="Oakwood Academy Trust"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className="font-inter text-[#A7B1BE] text-xs tracking-wider uppercase"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="bg-[rgba(11,17,24,0.6)] border border-[#2A3340] rounded-lg px-4 py-3 font-inter text-white text-sm placeholder-[#2A3340] focus:outline-none focus:border-[rgba(201,168,76,0.5)] transition-colors resize-none"
                  placeholder="Tell us about your compliance challenge or how we can help..."
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                  bg-[rgba(27,36,48,0.9)] border border-[#2A3340] text-white font-inter font-medium text-sm tracking-wide
                  hover:bg-[#2A3340] hover:border-[rgba(201,168,76,0.5)] transition-all duration-200 mt-2"
              >
                Send Message
              </button>
            </form>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
