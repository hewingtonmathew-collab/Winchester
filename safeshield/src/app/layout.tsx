import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { SeasonalThemeProvider } from "@/context/SeasonalThemeContext";

export const metadata: Metadata = {
  title: "SafeShield Tools",
  description: "Professional compliance tools for safeguarding, governance, AI, digital standards, data protection, accessibility, and Ofsted.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0D1117",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to font origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload critical font weights only (300 + 600) */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,600;1,300&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,600;1,300&display=swap"
          rel="stylesheet"
        />
        {/* Apply saved theme before first paint — must be synchronous to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('safeshield_theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();` }} />
      </head>
      <body className="relative z-[1] flex flex-col min-h-screen">
        <AuthProvider>
          <SeasonalThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </SeasonalThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
