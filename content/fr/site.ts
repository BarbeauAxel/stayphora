import type { SiteContent } from "../types";

export const site: SiteContent = {
  name: "Stayphora",
  url: "https://stayphora.fr",
  tagline: "Visites 3D navigables par IA pour locations courte durée",
  description:
    "Stayphora transforme une simple vidéo filmée au smartphone en visite 3D photoréaliste de votre location courte durée. Vos voyageurs se déplacent librement dans le logement, depuis leur navigateur.",
  // [À remplacer] adresse de contact publique
  email: "contact@stayphora.fr",
  nav: [
    { label: "Démo", href: "/#demo" },
    { label: "Comment ça marche", href: "/#comment-ca-marche" },
    { label: "Réalisations", href: "/#realisations" },
    { label: "Tarifs", href: "/#tarifs" },
    { label: "FAQ", href: "/#faq" },
  ],
  ctaLabel: "Demander un devis",
  skipLink: "Aller au contenu",
  menuOpen: "Ouvrir le menu",
  menuClose: "Fermer le menu",
  footerBlurb:
    "Stay, le séjour ; -phora, « qui apporte » en grec. Stayphora apporte le séjour jusqu'au voyageur, avant même son arrivée : des visites 3D fidèles, où l'on se déplace comme si l'on y était.",
  footerNavTitle: "Navigation",
  footerContactTitle: "Contact",
  footerLegalTitle: "Informations",
  legalLinks: [
    { label: "Guide de tournage", href: "/guide-tournage" },
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Confidentialité", href: "/confidentialite" },
  ],
  copyright: "Stayphora. Tous droits réservés.",
};
