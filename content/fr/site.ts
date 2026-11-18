import type { SiteContent } from "../types";

export const site: SiteContent = {
  name: "Stayphora",
  url: "https://stayphora.fr",
  tagline: "Rendus de décoration intérieure par IA pour locations courte durée",
  description:
    "Stayphora imagine la redécoration de votre location courte durée grâce à l'IA. Envoyez vos photos, choisissez un style et recevez vos rendus HD en 48 h, sans travaux ni achat à l'aveugle.",
  // [À remplacer] adresse de contact publique
  email: "contact@stayphora.fr",
  // [À remplacer] liens réseaux sociaux
  socials: {
    instagram: "https://www.instagram.com/stayphora",
    linkedin: "https://www.linkedin.com/company/stayphora",
  },
  nav: [
    { label: "Réalisations", href: "/#realisations" },
    { label: "Comment ça marche", href: "/#comment-ca-marche" },
    { label: "Styles", href: "/#styles" },
    { label: "Tarifs", href: "/#tarifs" },
    { label: "FAQ", href: "/#faq" },
  ],
  ctaLabel: "Demander un devis",
  skipLink: "Aller au contenu",
  menuOpen: "Ouvrir le menu",
  menuClose: "Fermer le menu",
  footerBlurb:
    "Stay, le séjour ; -phora, « qui apporte » en grec. Stayphora, c'est ce qui apporte un meilleur séjour : des intérieurs pensés pour vos voyageurs, visualisés avant d'être réalisés.",
  footerNavTitle: "Navigation",
  footerContactTitle: "Contact",
  footerLegalTitle: "Informations",
  legalLinks: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Confidentialité", href: "/confidentialite" },
  ],
  copyright: "Stayphora. Tous droits réservés.",
};
