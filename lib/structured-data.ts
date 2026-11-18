import { getContent } from "@/content";

/** Données structurées schema.org (JSON-LD) de la page d'accueil. */
export function homeStructuredData() {
  const { site, faq, pricing, styles } = getContent();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon`,
    description: site.description,
    email: site.email,
    sameAs: [site.socials.instagram, site.socials.linkedin],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}/#service`,
    name: "Rendus de décoration intérieure par IA",
    serviceType: "Home staging virtuel et rendus de décoration intérieure",
    description: site.description,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: { "@type": "Country", name: "France" },
    audience: {
      "@type": "Audience",
      audienceType: "Hôtes Airbnb, conciergeries, agents immobiliers et investisseurs en location meublée",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Offres Stayphora",
      itemListElement: pricing.plans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        description: plan.description,
      })),
    },
    keywords: styles.items.map((s) => s.name).join(", "),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return [organization, service, faqPage];
}
