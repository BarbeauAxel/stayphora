import type { GuideContent } from "../types";

/** Guide de tournage : page /guide-tournage ET email de confirmation. */
export const guide: GuideContent = {
  eyebrow: "Guide de tournage",
  title: "Bien filmer son logement, en *dix minutes*.",
  description:
    "Pas besoin d'être vidéaste. Quelques gestes simples font toute la différence entre une visite floue et une visite où l'on a l'impression d'y être.",
  metaDescription:
    "Comment filmer votre location au smartphone pour obtenir une visite 3D réussie : lumière, vitesse, rangement, portes, miroirs.",
  teaser: {
    title: "Le guide de tournage",
    text: "Lumière, vitesse de marche, miroirs : tout ce qu'il faut savoir avant de filmer.",
    cta: "Lire le guide",
  },
  steps: [
    {
      title: "Préparez le logement",
      text: "Rangez, faites les lits, retirez les objets personnels et les documents visibles. Ouvrez toutes les portes intérieures et les rideaux.",
      icon: "sparkles",
    },
    {
      title: "Allumez toutes les lumières",
      text: "Filmez en journée, toutes lampes allumées, pour une lumière homogène. Évitez le plein soleil direct qui crée des contrastes trop forts.",
      icon: "sun",
    },
    {
      title: "Filmez en marchant lentement",
      text: "Téléphone à hauteur de poitrine, à l'horizontale, mode vidéo 4K ou 1080p. Marchez deux fois plus lentement que d'habitude, sans à-coups.",
      icon: "footprints",
    },
    {
      title: "Faites le tour de chaque pièce",
      text: "Longez les murs en regardant vers le centre de la pièce, puis faites un second passage au centre en regardant les murs. Comptez 1 à 3 minutes par pièce.",
      icon: "eye",
    },
    {
      title: "Reliez les pièces entre elles",
      text: "Passez lentement les portes en continuant de filmer : c'est ce qui permet de se déplacer d'une pièce à l'autre dans la visite.",
      icon: "door",
    },
    {
      title: "Envoyez-nous les vidéos",
      text: "Par WeTransfer, Google Drive ou Dropbox, sans les compresser. Une vidéo par pièce, ou une seule vidéo continue : les deux fonctionnent.",
      icon: "upload",
    },
  ],
  dos: {
    title: "Les bons réflexes",
    items: [
      "Garder le téléphone stable, comme sur un plateau",
      "Bloquer la mise au point et l'exposition (appui long sur l'écran)",
      "Filmer aussi le sol et le plafond par moments",
      "Recommencer une pièce plutôt que d'accélérer",
      "Nettoyer l'objectif avant de commencer",
    ],
  },
  donts: {
    title: "Les erreurs à éviter",
    items: [
      "Filmer un miroir de face (il « crée » une fausse pièce)",
      "Les mouvements rapides et les rotations sur place",
      "Le mode grand-angle 0,5× ou le mode portrait",
      "Les personnes ou animaux qui bougent dans le champ",
      "Les écrans allumés et les fenêtres à contre-jour en plein cadre",
    ],
  },
  checklist: {
    title: "Avant d'appuyer sur « enregistrer »",
    items: [
      "Logement rangé, lits faits",
      "Portes intérieures et rideaux ouverts",
      "Toutes les lumières allumées",
      "Téléphone chargé, espace de stockage suffisant",
      "Objectif propre",
    ],
  },
  cta: {
    title: "Vos vidéos sont prêtes ?",
    text: "Demandez votre devis : nous vous envoyons un lien de transfert et vous recevez votre visite sous 72 h.",
    button: "Demander un devis",
  },
};
