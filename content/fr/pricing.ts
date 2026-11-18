import type { Content } from "../types";

// [À remplacer] prix réels (« [XX €] ») et durée d'hébergement (« [X mois] »)
const included = [
  "Reconstruction 3D photoréaliste",
  "Points de vue par pièce",
  "Visite guidée automatique",
  "Lien de partage et QR code",
  "Code d'intégration pour votre site",
  "Hébergement de la visite pendant [X mois]",
  "Une retouche incluse",
];

export const pricing: Content["pricing"] = {
  eyebrow: "Tarifs",
  title: "Une visite, un prix *clair*.",
  description: "Devis gratuit. Vous ne payez qu'une fois la visite validée.",
  plans: [
    {
      name: "Studio / T2",
      price: "[XX €]",
      unit: "par logement",
      description: "Jusqu'à 3 pièces. Idéal pour les studios, T1 et T2.",
      features: included,
      cta: "Demander un devis",
    },
    {
      name: "Maison / grand logement",
      price: "[XX €]",
      unit: "par logement",
      description: "Maisons, villas, gîtes et grands appartements, sans limite de pièces.",
      features: [...included.slice(0, 6), "Extérieurs inclus (terrasse, jardin)", "Une retouche incluse"],
      cta: "Demander un devis",
      highlighted: true,
      badge: "Le plus choisi",
    },
    {
      name: "Conciergeries",
      price: "Sur devis",
      unit: "tarifs dégressifs",
      description: "Pour les conciergeries et gestionnaires qui valorisent tout un parc de logements.",
      features: [
        "Tarifs dégressifs au volume",
        "Visites en marque blanche",
        "Page de visite à vos couleurs",
        "Interlocuteur dédié",
        "Délais prioritaires",
        "Facturation mensuelle",
      ],
      cta: "Parler de votre parc",
    },
  ],
  note: "Visites supplémentaires, mises à jour après travaux et hébergement prolongé sur simple demande.",
};
