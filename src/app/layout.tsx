import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema, webSiteSchema } from "@/lib/schema";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://winchesterconsultancy.co.uk"),
  title: "Winchester Consultancy | School Compliance Intelligence",
  description:
    "Intelligence That Builds Confidence. Expert school compliance, governance, and AI readiness consultancy for schools and multi-academy trusts.",
  keywords: [
    "school compliance",
    "governance",
    "MAT consultancy",
    "safeguarding",
    "AI readiness",
  ],
  openGraph: {
    title: "Winchester Consultancy",
    description:
      "School Compliance Intelligence — strategic assurance for schools and trusts.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1118",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="bg-[#0B1118] text-[#E6E9ED] font-inter antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#C9A84C] focus:text-[#0B1118] focus:font-inter focus:font-semibold focus:text-sm focus:rounded focus:outline-none"
        >
          Skip to main content
        </a>
        <Navbar />
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
