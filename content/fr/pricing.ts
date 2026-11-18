import type { Content } from "../types";

// [À remplacer] prix réels : remplacer les « [XX €] » et ajuster les inclusions
export const pricing: Content["pricing"] = {
  eyebrow: "Tarifs",
  title: "Des tarifs *clairs*, sans surprise.",
  description: "Vous ne payez qu'après avoir validé vos rendus.",
  plans: [
    {
      name: "Pièce unique",
      price: "[XX €]",
      unit: "par pièce",
      description: "Pour tester une idée ou repenser l'espace clé de votre logement.",
      features: [
        "1 pièce, 2 styles au choix",
        "2 rendus HD par style",
        "1 série de retouches incluse",
        "Liste d'idées déco et mobilier",
        "Livraison sous 48 h",
      ],
      cta: "Demander un devis",
    },
    {
      name: "Logement complet",
      price: "[XX €]",
      unit: "par logement",
      description: "Une vision cohérente de tout le logement, pièce par pièce.",
      features: [
        "Jusqu'à 5 pièces",
        "1 style harmonisé et 1 variante",
        "Rendus HD de chaque pièce",
        "2 séries de retouches incluses",
        "Liste de mobilier avec liens d'achat",
        "Livraison sous 48 à 72 h",
      ],
      cta: "Demander un devis",
      highlighted: true,
      badge: "Le plus choisi",
    },
    {
      name: "Conciergeries",
      price: "Sur devis",
      unit: "pour les volumes",
      description: "Pour les conciergeries et gestionnaires qui accompagnent de nombreux propriétaires.",
      features: [
        "Tarifs dégressifs au volume",
        "Interlocuteur dédié",
        "Rendus en marque blanche",
        "Délais prioritaires",
        "Facturation mensuelle",
      ],
      cta: "Parler de votre volume",
    },
  ],
  note: "Retouches supplémentaires et pièces additionnelles sur simple demande.",
};
