import type { Content, Tour } from "../types";

/**
 * Visites 3D de démonstration.
 *
 * ─ Ajouter une visite ─────────────────────────────────────────────────
 * 1. Exporter la scène en .spz (le plus compact), idéalement ≤ 1 million de
 *    splats (~15 Mo), plus une version « mobile » ≤ 500 000 splats (~7 Mo).
 * 2. Envoyer les fichiers dans le bucket R2 :
 *      npx wrangler r2 object put stayphora-assets/tours/<slug>.spz --file <slug>.spz --remote
 *    (en local : déposer le fichier dans /public/demo/tours/)
 * 3. Ajouter une entrée ci-dessous. Coordonnées en mètres, y = hauteur
 *    (sol à 0, yeux à ~1,6). Pour trouver un point de vue : ouvrir
 *    /demo/<slug>?debug, se placer, puis copier la ligne affichée en bas.
 * 4. Ajouter une image de couverture dans /public/images/tours/.
 * ──────────────────────────────────────────────────────────────────────
 */

const eyefulCredit = (scene: string) => ({
  text: `Scène d'exemple « ${scene} » issue du jeu de données Eyeful Tower, © Meta Platforms, Inc. et affiliés, licence MIT. Entraînée avec SplatCast, recadrée et compressée par Stayphora.`,
  href: "https://github.com/facebookresearch/EyefulTower",
  licenseHref: "/licences/eyeful-tower-MIT.txt",
});

// [À remplacer] par vos propres scans dès que possible.
export const tours: Tour[] = [
  {
    slug: "appartement",
    title: "Appartement",
    location: "Scène d'exemple",
    kind: "Appartement",
    description: "Séjour, cuisine ouverte, bureau et chambre : un vrai logement habité, reconstruit à partir de photos.",
    scene: "tours/appartement.spz",
    sceneMobile: "tours/appartement-mobile.spz",
    cover: {
      src: "/images/tours/appartement.jpg",
      alt: "Séjour et cuisine ouverte de l'appartement de démonstration, vus en 3D",
    },
    video: { webm: "/videos/tours/appartement.webm", mp4: "/videos/tours/appartement.mp4" },
    bounds: { min: [-3.8, 1.0, -2.9], max: [2.4, 2.2, 5.4] },
    rooms: [
      { label: "Vue d'ensemble", position: [-0.6, 1.6, 4.6], target: [0.6, 1.2, 0] },
      { label: "Séjour", position: [0.6, 1.6, 0.4], target: [-0.6, 1.3, 4] },
      { label: "Cuisine", position: [0.3, 1.6, 2.6], target: [-0.8, 1.1, 5] },
      { label: "Bureau", position: [0.2, 1.6, -0.6], target: [0.3, 1.2, -3] },
      { label: "Chambre", position: [-2.5, 1.6, 0.2], target: [-3.5, 1.2, -1.2] },
    ],
    credit: eyefulCredit("apartment"),
  },
  {
    slug: "loft",
    title: "Loft",
    location: "Scène d'exemple",
    kind: "Loft · espace de travail",
    description: "Un grand plateau lumineux, sa baie vitrée et son coin salon : idéal pour juger des volumes.",
    scene: "tours/riverview.spz",
    sceneMobile: "tours/riverview-mobile.spz",
    cover: {
      src: "/images/tours/loft.jpg",
      alt: "Coin salon et grande baie vitrée du loft de démonstration, vus en 3D",
    },
    video: { webm: "/videos/tours/loft.webm", mp4: "/videos/tours/loft.mp4" },
    bounds: { min: [-5.6, 1.0, -3.0], max: [3.7, 2.2, 1.3] },
    rooms: [
      { label: "Coin salon", position: [2.5, 1.6, 0.5], target: [-1, 1.3, -2] },
      { label: "Baie vitrée", position: [0, 1.6, 0], target: [1, 1.4, 0] },
      { label: "Fauteuils", position: [-3, 1.6, -1], target: [-5, 1.4, 0.5] },
      { label: "Plateau", position: [0, 1.6, 0], target: [-1, 1.4, 0] },
    ],
    credit: eyefulCredit("riverview"),
  },
];

export const tourUi: Content["tourUi"] = {
  explore: "Explorer le logement",
  hint: "Visite 3D · Glissez pour vous déplacer",
  loading: "Préparation de la visite…",
  loadingUnknown: "Chargement de la scène…",
  ready: "Visite prête",
  dragHint: "Glissez pour explorer",
  rooms: "Pièces",
  fullscreen: "Plein écran",
  exitFullscreen: "Quitter le plein écran",
  guidedTour: "Visite guidée",
  enterVr: "Visiter en réalité virtuelle",
  exitVr: "Quitter la réalité virtuelle",
  stopGuidedTour: "Arrêter la visite guidée",
  help: "Aide à la navigation",
  closeHelp: "Fermer l'aide",
  helpTitle: "Se déplacer",
  helpDesktop: [
    { keys: "Cliquer-glisser", action: "Regarder autour" },
    { keys: "Molette", action: "Avancer ou reculer" },
    { keys: "↑ ↓ · Z S / W S", action: "Avancer, reculer" },
    { keys: "← → · Q D / A D", action: "Tourner, se décaler" },
    { keys: "Double-clic", action: "Aller vers un point" },
  ],
  helpMobile: [
    { keys: "Un doigt", action: "Regarder autour" },
    { keys: "Pincer", action: "Avancer ou reculer" },
    { keys: "Deux doigts", action: "Se déplacer" },
    { keys: "Double-tap", action: "Aller vers un point" },
  ],
  keyboardHint: "Cliquez dans la visite pour utiliser le clavier.",
  viewerLabel: "Visite 3D interactive",
  errorTitle: "La visite n'a pas pu se charger",
  errorText: "Vérifiez votre connexion, puis réessayez.",
  retry: "Réessayer",
  fallbackTitle: "Visite 3D indisponible sur cet appareil",
  fallbackText: "Votre navigateur ne prend pas en charge WebGL 2. Voici une vidéo de la visite.",
  fallbackTry: "Essayer quand même",
  videoAlternative: "Voir la vidéo de la visite",
  closeVideo: "Fermer la vidéo",
  credit: "Crédits de la scène",
};

export const demoPage: Content["demoPage"] = {
  back: "Retour au site",
  cta: "Je veux la même chose pour mon logement",
  sampleNote: "Scène d'exemple",
};
