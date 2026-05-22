import type { Metadata } from "next";
import SectionDivider from "@/components/ui/SectionDivider";
import ContactForm from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact | Winchester Consultancy",
  description:
    "Get in touch with Winchester Consultancy. Whether you have a compliance challenge or simply want to learn more, we are here to help.",
};

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@winchesterconsultancy.co.uk",
    href: "mailto:hello@winchesterconsultancy.co.uk",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+44 (0) 1234 567 890",
    href: "tel:+441234567890",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "England & Wales",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <section className="pt-36 pb-20 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">Get in Touch</p>
          <h1 className="heading-display text-4xl lg:text-6xl mb-6">
            Let&apos;s Start a
            <br />
            Conversation.
          </h1>
          <p className="font-inter text-[#A7B1BE] text-lg max-w-2xl leading-relaxed">
            Whether you need assurance, guidance or a trusted partner,
            we&apos;re here to help.
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
              {contactDetails.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: "rgba(11,17,24,0.6)",
                      border: "1px solid rgba(201,168,76,0.3)",
                    }}
                  >
                    <Icon
                      size={16}
                      className="text-[#C9A84C]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <p className="font-cinzel text-white text-xs tracking-wider uppercase font-bold mb-1">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="font-inter text-[#A7B1BE] text-sm hover:text-white transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-inter text-[#A7B1BE] text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-5 rounded-xl border border-[#2A3340]">
              <p className="font-cinzel font-bold text-white text-xs tracking-wider uppercase mb-3">
                Response Time
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                We aim to respond to all enquiries within one business day.
                For urgent matters, please call us directly.
              </p>
            </div>
          </div>

          {/* Server-action-powered contact form */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
