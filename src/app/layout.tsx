import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://safeshield.education"),
  title: {
    default: "SafeShield | Digital Safeguarding Intelligence for Schools",
    template: "%s | SafeShield",
  },
  description:
    "Digital safeguarding intelligence for schools that need more than basic compliance. GuardianOS-powered oversight for UK schools, MATs and local authorities.",
  keywords: [
    "school digital safeguarding",
    "KCSIE compliance",
    "MAT compliance platform",
    "school cyber security",
    "GDPR schools",
    "DPIA schools",
    "AI governance education",
    "GuardianOS",
  ],
  openGraph: {
    title: "SafeShield — Digital Safeguarding Intelligence for Schools",
    description:
      "GuardianOS-powered compliance oversight for UK schools and trusts.",
    type: "website",
    locale: "en_GB",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={jakarta.variable}>
      <body className="bg-background text-on-surface font-sans antialiased overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:font-sans focus:font-semibold focus:text-sm focus:rounded focus:outline-none"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
