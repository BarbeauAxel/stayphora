import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Instrument_Serif } from "next/font/google";
import { getContent } from "@/content";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { MotionProvider } from "@/components/ui/MotionProvider";
import "./globals.css";

// Polices auto-hébergées par next/font (aucune requête vers Google côté visiteur).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const { site, locale } = getContent();
const defaultTitle = `${site.name} · Rendus déco par IA pour locations courte durée`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "home staging virtuel",
    "décoration Airbnb",
    "rendu décoration IA",
    "location courte durée",
    "conciergerie Airbnb",
    "gîte",
    "location meublée",
  ],
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: site.name,
    title: defaultTitle,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={locale} className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>
        <a
          href="#contenu"
          className="fixed top-3 left-3 z-100 -translate-y-20 rounded-full bg-ink px-5 py-3 text-sm text-cream transition-transform focus:translate-y-0"
        >
          {site.skipLink}
        </a>
        <MotionProvider>
          <Header site={site} />
          <main id="contenu" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
