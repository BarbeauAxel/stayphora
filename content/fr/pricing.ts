import type { Content } from "../types";

const included = [
  "Reconstruction 3D photoréaliste",
  "Points de vue par pièce",
  "Visite guidée automatique",
  "Lien de partage et QR code",
  "Code d'intégration pour votre site",
  "Hébergement de la visite pendant 12 mois",
  "Une retouche incluse",
];

export const pricing: Content["pricing"] = {
  eyebrow: "Tarifs",
  title: "Une visite, un prix *clair*.",
  description: "Devis gratuit. Vous ne payez qu'une fois la visite validée.",
  plans: [
    {
      name: "Studio / T2",
      price: "129 €",
      unit: "par logement",
      description: "Jusqu'à 3 pièces. Idéal pour les studios, T1 et T2.",
      features: included,
      cta: "Demander un devis",
    },
    {
      name: "Maison / grand logement",
      price: "249 €",
      unit: "par logement",
      description: "Maisons, villas, gîtes et grands appartements, jusqu'à 10 pièces. Au-delà, sur devis.",
      features: [...included.slice(0, 6), "Extérieurs inclus (terrasse, jardin)", "Une retouche incluse"],
      cta: "Demander un devis",
      highlighted: true,
      badge: "Le plus choisi",
    },
    {
      name: "Conciergeries",
      price: "Dès 79 €",
      unit: "par visite, selon le volume",
      description: "Pour les conciergeries et gestionnaires qui valorisent tout un parc de logements.",
      features: [
        "Tarifs dégressifs au volume",
        "Visites en marque blanche",
        "Page de visite à vos couleurs",
        "Interlocuteur dédié",
        "Facturation mensuelle",
      ],
      cta: "Parler de votre parc",
    },
  ],
  note: "Prix nets, TVA non applicable (art. 293 B du CGI). Renouvellement de l'hébergement : 39 € par an. Options : livraison express sous 24 h (+49 €), mise à jour après travaux (69 €), export des fichiers 3D (49 €).",
};
