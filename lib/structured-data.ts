import { getContent } from "@/content";

/** Données structurées schema.org (JSON-LD) de la page d'accueil. */
export function homeStructuredData() {
  const { site, faq, pricing } = getContent();

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
    name: "Visites virtuelles 3D par IA pour locations courte durée",
    serviceType: "Visite virtuelle 3D (Gaussian Splatting) à partir d'une vidéo smartphone",
    description: site.description,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: { "@type": "Country", name: "France" },
    audience: {
      "@type": "Audience",
      audienceType:
        "Conciergeries, propriétaires de gîtes et chambres d'hôtes, hôtes Airbnb et Booking, agents immobiliers et investisseurs",
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
