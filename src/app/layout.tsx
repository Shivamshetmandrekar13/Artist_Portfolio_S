import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import HoneyEmberBackground from "@/components/ui/honey-ember-background";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Aryan Mehta — Fine Art Portfolio",
    template: "%s | Aryan Mehta",
  },
  description:
    "Explore the fine art portfolio of Aryan Mehta — original paintings, limited editions, and commissions. Oil, acrylic, and mixed-media works.",
  keywords: ["fine art", "paintings", "artist", "gallery", "oil paintings", "contemporary art"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Aryan Mehta Fine Art",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior: Next turns off the CSS smooth scroll during route
    // changes, so new pages open at the top instead of animating up to it.
    <html lang="en" className={cormorant.variable} data-scroll-behavior="smooth">
      <body>
        {/* Site-wide decorative background, fixed behind all content */}
        <HoneyEmberBackground aria-hidden="true" className="fixed inset-0 -z-10" />
        <Navbar />
        <main style={{ paddingTop: "var(--nav-h)" }}>{children}</main>
        <Suspense fallback={<footer style={{ minHeight: "120px" }} />}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
