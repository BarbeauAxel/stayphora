import type { Content } from "../types";

export const hero: Content["hero"] = {
  eyebrow: "Visites 3D par IA · Locations courte durée",
  title: "Faites visiter votre location *avant* l'arrivée.",
  subtitle:
    "Filmez votre logement au téléphone. Nous le transformons en visite 3D où vos voyageurs se déplacent librement, comme s'ils y étaient.",
  primaryCta: "Essayer la démo",
  secondaryCta: "Demander un devis",
  badge: "Aucun matériel requis · Un smartphone suffit",
  scrollLabel: "Défiler vers la suite",
  video: {
    // [À remplacer] enregistrement d'écran d'une de VOS visites (voir README).
    enabled: true,
    webm: "/videos/hero.webm",
    mp4: "/videos/hero.mp4",
    // Portrait 540 × 960, ~1 Mo : bien plus léger à télécharger et à décoder sur mobile.
    mobile: { webm: "/videos/hero-mobile.webm", mp4: "/videos/hero-mobile.mp4" },
  },
  poster: {
    src: "/images/hero-poster.jpg",
    alt: "Pièce de vie traversante d'un appartement, vue depuis la cuisine dans une visite 3D",
  },
};

export const reassurance: Content["reassurance"] = [
  { label: "Un smartphone suffit", icon: "smartphone" },
  { label: "Visite livrée sous 72 h", icon: "clock" },
  { label: "Mobile, tablette et ordinateur", icon: "devices" },
  { label: "Lien, QR code et intégration web", icon: "qr" },
];

export const demo: Content["demo"] = {
  eyebrow: "Démo",
  title: "Ne nous croyez pas sur parole. *Entrez.*",
  description: "Scène d'exemple reconstruite par Gaussian Splatting. Déplacez-vous librement, pièce par pièce.",
  moreDemos: "Autres visites",
  openFullscreen: "Ouvrir en plein écran",
  compare: {
    // Masqué tant qu'il n'y a pas de scans Stayphora réalisés au smartphone
    // (les scènes d'exemple ont été capturées avec un dispositif photo professionnel).
    enabled: false,
    title: "De la prise de vue à la visite",
    filmed: {
      label: "Ce que vous filmez",
      caption: "Des images prises sur place, pièce par pièce.",
      // [À remplacer] par une image extraite d'une vraie vidéo filmée au smartphone.
      image: {
        src: "/images/demo/capture-brute.jpg",
        alt: "Photo brute du séjour de l'appartement, telle qu'elle a été prise sur place",
      },
    },
    explored: {
      label: "Ce que vos voyageurs explorent",
      caption: "Une visite 3D où l'on se déplace librement.",
      image: {
        src: "/images/demo/visite-3d.jpg",
        alt: "Le même séjour reconstitué en visite 3D navigable",
      },
    },
  },
};

export const howItWorks: Content["howItWorks"] = {
  eyebrow: "Comment ça marche",
  title: "Votre téléphone, notre IA, *leur* visite.",
  description: "Pas de caméra 360°, pas de technicien à faire venir. Vous filmez, nous nous occupons du reste.",
  steps: [
    {
      title: "Filmez votre logement",
      description: "Une vidéo lente de 1 à 3 minutes par pièce, au smartphone. On vous envoie un guide simple.",
      icon: "smartphone",
    },
    {
      title: "Envoyez-nous les fichiers",
      description: "Par un lien de transfert (WeTransfer, Google Drive…), en quelques clics.",
      icon: "upload",
    },
    {
      title: "L'IA reconstruit votre logement en 3D",
      description: "Puis nous vérifions et optimisons la visite à la main : cadrage, points de vue, fluidité.",
      icon: "box",
    },
    {
      title: "Partagez votre visite",
      description: "Lien, QR code et code d'intégration pour votre site, livrés sous 72 h.",
      icon: "share",
    },
  ],
};

export const benefits: Content["benefits"] = {
  eyebrow: "Pourquoi une visite 3D ?",
  title: "La *confiance*, avant même la réservation.",
  description: "Votre logement est montré tel qu'il est vraiment. Pas de retouche, pas de grand-angle trompeur : les vrais volumes.",
  items: [
    {
      title: "Moins de mauvaises surprises",
      description: "Le voyageur voit les volumes réels : moins de déceptions à l'arrivée, moins de mauvais avis.",
      icon: "eye",
    },
    {
      title: "Plus de réservations directes",
      description: "Un argument fort pour votre propre site, sans commission de plateforme.",
      icon: "globe",
    },
    {
      title: "Une annonce qui se démarque",
      description: "Sur vos réseaux, votre fiche Google, vos campagnes : une expérience que peu proposent.",
      icon: "star",
    },
    {
      title: "Moins de questions avant l'arrivée",
      description: "Le voyageur sait déjà où se trouvent l'entrée, la cuisine et les chambres.",
      icon: "message",
    },
  ],
};

export const share: Content["share"] = {
  eyebrow: "Où partager votre visite ?",
  title: "Partout où vos voyageurs *décident*.",
  items: [
    {
      title: "Votre site de réservation directe",
      description: "Une ligne de code suffit pour intégrer la visite à n'importe quelle page.",
      icon: "globe",
    },
    {
      title: "Fiche Google et réseaux sociaux",
      description: "Un lien qui donne envie de cliquer, et de réserver.",
      icon: "map",
    },
    {
      title: "Le site de votre conciergerie",
      description: "Chaque logement de votre parc devient visitable en ligne.",
      icon: "building",
    },
    {
      title: "Vos messages aux voyageurs",
      description: "Après la réservation, pour préparer l'arrivée sereinement.",
      icon: "message",
    },
    {
      title: "Flyers et livrets d'accueil",
      description: "Grâce au QR code, la visite passe du papier à l'écran.",
      icon: "qr",
    },
  ],
  note: "Airbnb n'autorise pas les liens externes dans les annonces : la visite 3D vous aide justement à développer vos réservations en direct.",
};

export const audiences: Content["audiences"] = {
  eyebrow: "Pour qui ?",
  title: "Pensé pour ceux qui font *vivre* les séjours.",
  items: [
    {
      title: "Conciergeries",
      description: "Valorisez votre parc de logements et convainquez de nouveaux propriétaires. Tarifs volume.",
      icon: "key",
    },
    {
      title: "Propriétaires en direct",
      description: "Gîtes, chambres d'hôtes, villas : donnez confiance et réduisez votre dépendance aux plateformes.",
      icon: "home",
    },
    {
      title: "Hôtes Airbnb & Booking",
      description: "Démarquez-vous sur vos réseaux et rassurez vos voyageurs avant leur arrivée.",
      icon: "star",
    },
    {
      title: "Agents immobiliers & investisseurs",
      description: "Faites visiter un bien à distance, à toute heure.",
      icon: "building",
    },
  ],
};

export const projects: Content["projects"] = {
  eyebrow: "Réalisations",
  title: "Des logements à *parcourir*.",
  description: "Cliquez sur un logement pour le visiter en 3D.",
  openLabel: "Visiter",
  closeLabel: "Fermer la visite",
  fullscreenLabel: "Ouvrir en plein écran",
  cta: {
    title: "Votre logement, *bientôt* ici ?",
    text: "Filmez-le au téléphone : nous vous livrons sa visite 3D sous 72 h.",
    button: "Demander un devis",
  },
};

export const notFound: Content["notFound"] = {
  eyebrow: "Erreur 404",
  title: "Cette pièce n'existe *pas* encore.",
  description: "La page que vous cherchez a peut-être été déplacée. Revenons à l'entrée.",
  cta: "Retour à l'accueil",
};
