import type { Content } from "../types";

export const hero: Content["hero"] = {
  eyebrow: "Rendus déco par IA · Locations courte durée",
  title: "Voyez votre location *sublimée* avant d'investir.",
  subtitle:
    "Envoyez vos photos, choisissez un style. En 48 h, découvrez votre logement redécoré, sans travaux ni achat à l'aveugle.",
  primaryCta: "Demander un devis",
  secondaryCta: "Voir les réalisations",
  scrollLabel: "Défiler vers la suite",
  video: {
    // [À remplacer] passer à `true` après avoir ajouté hero.webm et hero.mp4 dans /public/videos
    enabled: false,
    webm: "/videos/hero.webm",
    mp4: "/videos/hero.mp4",
  },
  poster: {
    src: "/images/hero-poster.jpg",
    alt: "Salon lumineux et épuré d'une location saisonnière, baigné de lumière naturelle",
  },
};

export const reassurance: Content["reassurance"] = [
  { label: "Livraison sous 48 h", icon: "clock" },
  { label: "Styles sur mesure", icon: "brush" },
  { label: "Retouches incluses", icon: "refresh" },
  { label: "Paiement après validation", icon: "shield" },
];

export const howItWorks: Content["howItWorks"] = {
  eyebrow: "Comment ça marche",
  title: "Quatre étapes, *zéro* travaux.",
  description:
    "Un processus simple, pensé pour les hôtes occupés comme pour les équipes qui gèrent des dizaines de logements.",
  steps: [
    {
      title: "Envoyez vos photos",
      description: "Quelques photos de chaque pièce, prises au téléphone, suffisent.",
      icon: "camera",
    },
    {
      title: "Choisissez un style",
      description: "Ou laissez-nous vous conseiller selon votre clientèle et votre emplacement.",
      icon: "palette",
    },
    {
      title: "On crée vos rendus",
      description: "Génération par IA, puis retouches à la main pour un résultat fidèle et réaliste.",
      icon: "sparkles",
    },
    {
      title: "Recevez vos visuels HD",
      description: "Avec une liste d'idées déco et de mobilier pour passer à l'action.",
      icon: "download",
    },
  ],
};

export const audiences: Content["audiences"] = {
  eyebrow: "Pour qui ?",
  title: "Pensé pour ceux qui font *vivre* les séjours.",
  items: [
    {
      title: "Hôtes",
      benefit: "Décidez de votre redécoration en toute confiance, avant de dépenser.",
      icon: "home",
    },
    {
      title: "Conciergeries",
      benefit: "Proposez un service à valeur ajoutée à vos propriétaires. Tarifs volume.",
      icon: "key",
    },
    {
      title: "Agents & investisseurs",
      benefit: "Aidez vos clients à se projeter dans le potentiel locatif d'un bien.",
      icon: "building",
    },
  ],
};

export const notFound: Content["notFound"] = {
  eyebrow: "Erreur 404",
  title: "Cette pièce n'existe *pas* encore.",
  description: "La page que vous cherchez a peut-être été déplacée. Revenons à l'entrée.",
  cta: "Retour à l'accueil",
};
