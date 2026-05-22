import ShieldLogo from "@/components/ui/ShieldLogo";
import SectionDivider from "@/components/ui/SectionDivider";
import Link from "next/link";

const footerLinks = {
  Company: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Insights", href: "/insights" },
    { label: "Resources", href: "/resources" },
    { label: "Capability Statement", href: "/capability-statement.pdf" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
};

const values = ["Assurance", "Compliance", "Intelligence", "Partnership"];

export default function Footer() {
  return (
    <footer className="bg-[#0B1118] border-t border-[#2A3340]">
      <SectionDivider />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <ShieldLogo size={36} />
            <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed max-w-xs">
              Expert compliance intelligence for schools and multi-academy trusts.
              Intelligence That Builds Confidence.
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {values.map((v) => (
                <li
                  key={v}
                  className="font-cinzel text-[0.6rem] text-[#C9A84C] tracking-widest uppercase"
                >
                  {v}
                </li>
              ))}
            </ul>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-4">
              <h4 className="font-cinzel font-bold text-white text-xs tracking-widest uppercase">
                {group}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-inter text-[#A7B1BE] text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <SectionDivider />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
          <p className="font-inter text-[#A7B1BE] text-xs">
            &copy; {new Date().getFullYear()} Winchester Consultancy Ltd. All rights reserved.
          </p>
          <p className="font-inter text-[#A7B1BE] text-xs">
            Registered in England &amp; Wales
          </p>
        </div>
      </div>
    </footer>
  );
}
