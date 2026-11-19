import type { ReactNode } from "react";
import Script from "next/script";
import { getContent } from "@/content";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

/**
 * Jeton Cloudflare Web Analytics (mesure d'audience sans cookie).
 * Le script n'est inclus que si la variable est définie au build.
 */
const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

/** Pages du site vitrine : en-tête, contenu principal et pied de page. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  const { site } = getContent();
  return (
    <>
      <Header site={site} />
      <main id="contenu" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
      {CF_BEACON_TOKEN && (
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
        />
      )}
    </>
  );
}
