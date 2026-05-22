import type { Metadata } from "next";
import ContactCTA from "@/components/sections/ContactCTA";
import SectionDivider from "@/components/ui/SectionDivider";

export const metadata: Metadata = {
  title: "About | Winchester Consultancy",
  description:
    "Learn about Winchester Consultancy — our team, experience, and approach to school compliance intelligence.",
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-36 pb-20 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">Our Story</p>
          <h1 className="heading-display text-4xl lg:text-6xl mb-6 text-balance">
            About Winchester
            <br />
            Consultancy
          </h1>
          <p className="font-inter text-[#A7B1BE] text-lg max-w-2xl leading-relaxed">
            Founded by education practitioners. Built for school leaders. We bring deep
            sector experience to every engagement.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="py-24 bg-[#111A23]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <p className="font-inter text-[#E6E9ED] text-base leading-relaxed">
            Winchester Consultancy was established by practitioners who have worked within
            schools and multi-academy trusts at a senior level. With combined experience
            spanning school business management and ICT leadership, we understand the
            operational realities facing today&apos;s school leaders — the regulatory pressures,
            the resource constraints, and the need to make confident, well-informed decisions.
          </p>
          <p className="font-inter text-[#A7B1BE] text-base leading-relaxed">
            Our approach is built on three principles: clarity, confidence, and measurable
            outcomes. We don&apos;t deliver generic frameworks — we engage deeply with your
            organisation, understand your specific context, and deliver intelligence that is
            immediately actionable.
          </p>
          <p className="font-inter text-[#A7B1BE] text-base leading-relaxed">
            Whether you are a single school navigating complex compliance obligations, or a
            growing trust seeking strategic assurance across your estate, Winchester
            Consultancy is your trusted partner.
          </p>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
