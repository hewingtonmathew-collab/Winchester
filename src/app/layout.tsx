import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="bg-[#0B1118] text-[#E6E9ED] font-inter antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
