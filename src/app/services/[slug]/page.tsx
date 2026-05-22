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
import { serviceSchema, breadcrumbSchema } from "@/lib/schema";

type Params = { slug: string };

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
