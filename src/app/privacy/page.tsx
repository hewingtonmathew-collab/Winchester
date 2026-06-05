import type { Metadata } from "next";
import SectionDivider from "@/components/ui/SectionDivider";
import GlassCard from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Privacy Policy | Winchester Consultancy",
  description:
    "How Winchester Consultancy collects, uses, and protects your personal data under UK GDPR.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-16 bg-[#0B1118]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">Legal</p>
          <h1 className="heading-display text-4xl lg:text-5xl mb-4">Privacy Policy</h1>
          <p className="font-inter text-[#A7B1BE] text-sm">Last updated: May 2025</p>
        </div>
      </section>

      <SectionDivider />

      {/* Content */}
      <section className="py-16 bg-[#111A23]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">

            {/* Section 1 — Who We Are */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                1. Who We Are
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                Winchester Consultancy Ltd (&quot;Winchester Consultancy&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is the
                data controller responsible for your personal data. We are registered in England
                and Wales.
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                This privacy policy explains how we collect, use, store, and protect personal
                data when you visit our website or contact us. We are committed to handling your
                data responsibly and in full compliance with the UK General Data Protection
                Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                <span className="text-white font-medium">Contact for data enquiries:</span>{" "}
                <a
                  href="mailto:hello@winchesterconsultancy.co.uk"
                  className="text-[#C9A84C] hover:text-white transition-colors"
                >
                  hello@winchesterconsultancy.co.uk
                </a>
              </p>
            </GlassCard>

            {/* Section 2 — Data We Collect */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                2. Data We Collect
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4">
                We collect only the data necessary to provide our services and respond to
                your enquiries. This falls into two categories:
              </p>

              <p className="font-inter text-white text-sm font-medium mb-2">
                Contact enquiry data
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                When you submit our contact form, we collect:
              </p>
              <ul className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-5 flex flex-col gap-1.5 pl-0">
                {[
                  "Full name",
                  "Email address",
                  "Organisation name",
                  "Message content",
                  "Phone number (optional)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#C9A84C" }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="font-inter text-white text-sm font-medium mb-2">
                Technical / server log data
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                Our hosting infrastructure automatically records standard server logs, including:
              </p>
              <ul className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-5 flex flex-col gap-1.5 pl-0">
                {[
                  "IP address",
                  "Browser type and version",
                  "Pages visited and referring URL",
                  "Date and time of access",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#C9A84C" }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div
                className="rounded-lg p-4"
                style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.20)" }}
              >
                <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                  <span className="text-[#C9A84C] font-medium">No tracking cookies.</span>{" "}
                  We do not use advertising cookies, tracking cookies, or third-party analytics
                  (such as Google Analytics). No cookie consent banner is shown because no
                  non-essential cookies are set.
                </p>
              </div>
            </GlassCard>

            {/* Section 3 — How We Use Your Data */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                3. How We Use Your Data
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4">
                We use the data we collect for the following purposes:
              </p>
              <ul className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-5 flex flex-col gap-1.5 pl-0">
                {[
                  "To respond to your enquiry and communicate with you about your request",
                  "To provide the consultancy services you have requested or expressed interest in",
                  "To operate and maintain our website securely (server log data)",
                  "To comply with legal obligations that may apply to us",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#C9A84C" }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                <span className="text-white font-medium">We do not sell, rent, or share your data</span>{" "}
                with third parties for marketing purposes under any circumstances.
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                We may share data with trusted service providers who assist us in operating our
                platform (for example, email delivery services). Any such providers are required
                to act only on our instructions and are bound by appropriate data processing
                agreements in accordance with Article 28 UK GDPR.
              </p>
            </GlassCard>

            {/* Section 4 — Legal Basis */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                4. Legal Basis for Processing (UK GDPR)
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4">
                Under Article 6 of the UK GDPR, we rely on the following lawful bases for
                processing your personal data:
              </p>
              <div className="flex flex-col gap-4">
                <div
                  className="rounded-lg p-4"
                  style={{ background: "rgba(27,36,48,0.6)", border: "1px solid rgba(42,51,64,0.8)" }}
                >
                  <p className="font-cinzel text-white text-xs font-bold tracking-wider uppercase mb-1.5">
                    Article 6(1)(b) — Contract Performance
                  </p>
                  <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                    Processing is necessary for the performance of a contract with you, or to
                    take pre-contractual steps at your request — for example, when you enquire
                    about our services.
                  </p>
                </div>
                <div
                  className="rounded-lg p-4"
                  style={{ background: "rgba(27,36,48,0.6)", border: "1px solid rgba(42,51,64,0.8)" }}
                >
                  <p className="font-cinzel text-white text-xs font-bold tracking-wider uppercase mb-1.5">
                    Article 6(1)(f) — Legitimate Interests
                  </p>
                  <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                    Processing is necessary for our legitimate interests in responding to
                    enquiries, operating our business, and maintaining the security of our
                    website — provided those interests are not overridden by your rights and
                    freedoms.
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Section 5 — Data Retention */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                5. Data Retention
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4">
                We retain personal data only for as long as is necessary for the purposes for
                which it was collected:
              </p>
              <ul className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4 flex flex-col gap-1.5 pl-0">
                {[
                  "Contact enquiry data: retained for up to 3 years from the date of last contact",
                  "Server log data: retained for up to 12 months from the date of recording",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#C9A84C" }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                You may request deletion of your personal data at any time by contacting us at{" "}
                <a
                  href="mailto:hello@winchesterconsultancy.co.uk"
                  className="text-[#C9A84C] hover:text-white transition-colors"
                >
                  hello@winchesterconsultancy.co.uk
                </a>
                . We will act on all such requests in accordance with our obligations under
                UK GDPR.
              </p>
            </GlassCard>

            {/* Section 6 — Your Rights */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                6. Your Rights Under UK GDPR
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4">
                Under the UK GDPR, you have the following rights in relation to your personal
                data. To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:hello@winchesterconsultancy.co.uk"
                  className="text-[#C9A84C] hover:text-white transition-colors"
                >
                  hello@winchesterconsultancy.co.uk
                </a>
                . We will respond within one month.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    right: "Right of access",
                    desc:
                      "You have the right to request a copy of the personal data we hold about you (a Subject Access Request).",
                  },
                  {
                    right: "Right to rectification",
                    desc:
                      "You have the right to request correction of inaccurate or incomplete personal data we hold about you.",
                  },
                  {
                    right: "Right to erasure",
                    desc:
                      "You have the right to request deletion of your personal data where there is no compelling reason for us to continue processing it.",
                  },
                  {
                    right: "Right to restriction of processing",
                    desc:
                      "You have the right to request that we restrict the processing of your data in certain circumstances.",
                  },
                  {
                    right: "Right to data portability",
                    desc:
                      "Where processing is based on consent or contract and carried out by automated means, you have the right to receive your data in a structured, commonly used, machine-readable format.",
                  },
                  {
                    right: "Right to object",
                    desc:
                      "You have the right to object to processing of your personal data where we rely on legitimate interests as our legal basis.",
                  },
                  {
                    right: "Right to withdraw consent",
                    desc:
                      "Where processing is based on your consent, you have the right to withdraw that consent at any time without affecting the lawfulness of processing carried out before withdrawal.",
                  },
                  {
                    right: "Right to lodge a complaint with the ICO",
                    desc:
                      "If you are unhappy with how we have handled your data, you have the right to lodge a complaint with the Information Commissioner’s Office (ICO).",
                  },
                ].map(({ right, desc }) => (
                  <div
                    key={right}
                    className="rounded-lg p-4"
                    style={{
                      background: "rgba(27,36,48,0.6)",
                      border: "1px solid rgba(42,51,64,0.8)",
                    }}
                  >
                    <p className="font-cinzel text-white text-xs font-bold tracking-wider uppercase mb-1.5">
                      {right}
                    </p>
                    <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
              <div
                className="rounded-lg p-4 mt-4"
                style={{
                  background: "rgba(201,168,76,0.07)",
                  border: "1px solid rgba(201,168,76,0.20)",
                }}
              >
                <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                  <span className="text-[#C9A84C] font-medium">Information Commissioner&apos;s Office (ICO):</span>{" "}
                  Website:{" "}
                  <a
                    href="https://ico.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C9A84C] hover:text-white transition-colors"
                  >
                    ico.org.uk
                  </a>{" "}
                  &nbsp;&bull;&nbsp; Helpline: 0303 123 1113
                </p>
              </div>
            </GlassCard>

            {/* Section 7 — Data Security */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                7. Data Security
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                We take the security of your personal data seriously. We implement
                industry-standard technical and organisational measures to protect data against
                unauthorised access, alteration, disclosure, or destruction. These measures
                include:
              </p>
              <ul className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4 flex flex-col gap-1.5 pl-0">
                {[
                  "HTTPS enforced across all pages of this website",
                  "Access controls limiting data access to authorised personnel only",
                  "Secure data storage and transmission practices",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#C9A84C" }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                Please note that no method of transmission over the internet is 100% secure.
                Whilst we strive to protect your personal data, we cannot guarantee the
                absolute security of data transmitted to our website.
              </p>
            </GlassCard>

            {/* Section 8 — Cookies */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                8. Cookies
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                This website uses only technically necessary cookies that are strictly required
                for it to function correctly. We do not use:
              </p>
              <ul className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4 flex flex-col gap-1.5 pl-0">
                {[
                  "Advertising or targeting cookies",
                  "Tracking or analytics cookies",
                  "Third-party cookies from social networks or marketing platforms",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#C9A84C" }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                Because we set no non-essential cookies, no cookie consent banner or pop-up is
                required under the UK Privacy and Electronic Communications Regulations (PECR).
              </p>
            </GlassCard>

            {/* Section 9 — Third-Party Links */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                9. Third-Party Links
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                Our website may contain links to external websites operated by third parties.
                These links are provided for your convenience and information only. We have no
                control over the content or privacy practices of those sites, and this privacy
                policy does not apply to them. We encourage you to review the privacy policy of
                any external website you visit.
              </p>
            </GlassCard>

            {/* Section 10 — Changes */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                10. Changes to This Policy
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                We may update this privacy policy from time to time to reflect changes in our
                practices, technology, or applicable law. The date at the top of this page
                indicates when the policy was last revised.
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                Your continued use of this website following the posting of any changes
                constitutes your acceptance of the updated policy. We encourage you to review
                this page periodically.
              </p>
            </GlassCard>

            {/* Section 11 — Contact */}
            <GlassCard variant="prominent">
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                11. Contact Us
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                If you have any questions about this privacy policy, wish to exercise your data
                rights, or have a concern about how we have handled your personal data, please
                contact us:
              </p>
              <div className="flex flex-col gap-2">
                <p className="font-inter text-[#A7B1BE] text-sm">
                  <span className="text-white font-medium">Email:</span>{" "}
                  <a
                    href="mailto:hello@winchesterconsultancy.co.uk"
                    className="text-[#C9A84C] hover:text-white transition-colors"
                  >
                    hello@winchesterconsultancy.co.uk
                  </a>
                </p>
                <p className="font-inter text-[#A7B1BE] text-sm">
                  <span className="text-white font-medium">Registered in:</span> England and Wales
                </p>
              </div>
            </GlassCard>

          </div>
        </div>
      </section>
    </>
  );
}
