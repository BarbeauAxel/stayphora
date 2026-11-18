import type { ReactNode } from "react";
import { getContent } from "@/content";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

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
    </>
  );
}
