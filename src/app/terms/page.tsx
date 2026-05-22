import type { Metadata } from "next";
import SectionDivider from "@/components/ui/SectionDivider";
import GlassCard from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Terms of Use | Winchester Consultancy",
  description: "Terms and conditions for using the Winchester Consultancy website.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-16 bg-[#0B1118]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">Legal</p>
          <h1 className="heading-display text-4xl lg:text-5xl mb-4">Terms of Use</h1>
          <p className="font-inter text-[#A7B1BE] text-sm">Last updated: May 2025</p>
        </div>
      </section>

      <SectionDivider />

      {/* Content */}
      <section className="py-16 bg-[#111A23]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10">

            {/* Section 1 — Acceptance of Terms */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                By accessing or using the Winchester Consultancy website at{" "}
                <span className="text-white font-medium">winchesterconsultancy.co.uk</span>{" "}
                (the &quot;Website&quot;), you agree to be bound by these Terms of Use. Please read
                them carefully before using the Website.
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                If you do not agree to these terms, you must not use the Website. Your
                continued use of the Website following any updates to these terms constitutes
                your acceptance of those changes. These terms apply to all visitors, users, and
                others who access or use the Website.
              </p>
            </GlassCard>

            {/* Section 2 — Use of Website */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                2. Use of Website
              </h2>
              <p className="font-inter text-white text-sm font-medium mb-2">
                Permitted uses
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4">
                You may use the Website for lawful purposes only, including browsing our content,
                learning about our services, and contacting us with legitimate enquiries.
              </p>

              <p className="font-inter text-white text-sm font-medium mb-2">
                Prohibited uses
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                You must not use the Website in any way that:
              </p>
              <ul className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4 flex flex-col gap-1.5 pl-0">
                {[
                  "Involves scraping, crawling, or automated data extraction from the Website without our express written permission",
                  "Is unlawful, fraudulent, harmful, or deceptive in any way",
                  "Misrepresents your identity or affiliation, or impersonates any person or organisation",
                  "Introduces viruses, malware, or other technically harmful material",
                  "Attempts to gain unauthorised access to any part of the Website or its underlying infrastructure",
                  "Reproduces, distributes, or commercially exploits our content without prior written consent",
                  "Violates any applicable local, national, or international law or regulation",
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
                We reserve the right to restrict or terminate access to the Website for any user
                who breaches these terms, without notice and at our sole discretion.
              </p>
            </GlassCard>

            {/* Section 3 — Intellectual Property */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                3. Intellectual Property
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                All content on this Website — including but not limited to text, graphics, logos,
                icons, images, data compilations, page layouts, and software — is the property of
                Winchester Consultancy Ltd and is protected by the copyright laws of England and
                Wales and applicable international intellectual property law.
              </p>
              <div
                className="rounded-lg p-4 mb-4"
                style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.20)" }}
              >
                <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                  <span className="text-[#C9A84C] font-medium">Proprietary framework notice.</span>{" "}
                  The Winchester Digital Assurance Framework, including its methodology,
                  terminology, structure, and associated materials, is proprietary to Winchester
                  Consultancy Ltd. All rights are reserved.
                </p>
              </div>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                You may not reproduce, distribute, modify, create derivative works from, publicly
                display, or otherwise exploit any content from this Website — in whole or in part
                — without our prior express written permission.
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                You may print or download content for your own personal, non-commercial
                reference only, provided that no copyright or other proprietary notices are
                removed. Any other use requires written authorisation from Winchester
                Consultancy Ltd.
              </p>
            </GlassCard>

            {/* Section 4 — Disclaimer */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                4. Disclaimer
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                The content published on this Website is provided for general information
                purposes only. It does not constitute professional advice of any kind —
                including but not limited to legal, compliance, educational, or operational
                advice — and should not be relied upon as such.
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                Whilst we endeavour to keep the information on this Website accurate and
                up to date, we make no representations or warranties of any kind — express or
                implied — about the completeness, accuracy, reliability, or suitability of the
                content for any particular purpose.
              </p>
              <div
                className="rounded-lg p-4"
                style={{ background: "rgba(27,36,48,0.6)", border: "1px solid rgba(42,51,64,0.8)" }}
              >
                <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                  <span className="text-white font-medium">For formal advisory work:</span>{" "}
                  If you require professional compliance or consultancy advice, please engage
                  Winchester Consultancy directly through a formal service agreement. Website
                  content is no substitute for a properly scoped engagement with our team.
                </p>
              </div>
            </GlassCard>

            {/* Section 5 — Limitation of Liability */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                5. Limitation of Liability
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                To the fullest extent permitted by applicable law, Winchester Consultancy Ltd,
                its directors, employees, and agents shall not be liable for any direct,
                indirect, incidental, special, consequential, or punitive loss or damage
                arising from:
              </p>
              <ul className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4 flex flex-col gap-1.5 pl-0">
                {[
                  "Your access to or use of (or inability to access or use) the Website",
                  "Any reliance placed on the content or information published on the Website",
                  "Any errors, inaccuracies, or omissions in the Website content",
                  "Unauthorised access to or alteration of your data or transmissions",
                  "Any interruption or cessation of the Website",
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
                Nothing in these terms shall limit or exclude our liability for death or personal
                injury caused by our negligence, fraud or fraudulent misrepresentation, or any
                other liability that cannot be excluded or limited under applicable English law.
              </p>
            </GlassCard>

            {/* Section 6 — External Links */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                6. External Links
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                This Website may contain links to third-party websites operated by organisations
                outside of Winchester Consultancy Ltd. These links are provided for your
                convenience and information only.
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                We have no control over the content, accuracy, or practices of those external
                sites, and we accept no responsibility or liability for them. The inclusion of a
                link to a third-party website does not imply endorsement of that site or its
                content. You access external links at your own risk and should review the terms
                and privacy policies of any third-party website you visit.
              </p>
            </GlassCard>

            {/* Section 7 — Governing Law */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                7. Governing Law
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                These Terms of Use and any dispute or claim arising out of or in connection with
                them (including non-contractual disputes or claims) shall be governed by and
                construed in accordance with the law of England and Wales.
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                You agree that the courts of England and Wales shall have exclusive jurisdiction
                to settle any dispute or claim arising out of or in connection with these terms
                or their subject matter or formation.
              </p>
            </GlassCard>

            {/* Section 8 — Changes */}
            <GlassCard>
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                8. Changes to These Terms
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-3">
                We reserve the right to update or amend these Terms of Use at any time without
                prior notice. Changes take effect immediately upon posting to the Website. The
                date at the top of this page will be updated whenever changes are made.
              </p>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                Your continued use of the Website after any changes are posted constitutes your
                acceptance of the revised terms. We encourage you to review these terms
                periodically to ensure you are comfortable with any updates.
              </p>
            </GlassCard>

            {/* Section 9 — Contact */}
            <GlassCard variant="prominent">
              <h2 className="font-cinzel font-bold text-white text-lg mb-3">
                9. Contact Us
              </h2>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4">
                If you have any questions about these Terms of Use, please contact us:
              </p>
              <div className="flex flex-col gap-2">
                <p className="font-inter text-[#A7B1BE] text-sm">
                  <span className="text-white font-medium">Email (legal enquiries):</span>{" "}
                  <a
                    href="mailto:legal@winchesterconsultancy.co.uk"
                    className="text-[#C9A84C] hover:text-white transition-colors"
                  >
                    legal@winchesterconsultancy.co.uk
                  </a>
                </p>
                <p className="font-inter text-[#A7B1BE] text-sm">
                  <span className="text-white font-medium">General enquiries:</span>{" "}
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
