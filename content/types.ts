/**
 * Types du contenu éditorial.
 *
 * Tous les textes du site vivent dans `/content/<langue>/`. Pour ajouter
 * l'anglais : copier `/content/fr` vers `/content/en`, traduire, puis
 * l'enregistrer dans `/content/index.ts`. TypeScript signalera tout oubli.
 *
 * Convention : dans les titres, un mot entouré d'astérisques (`*avant*`)
 * est affiché en italique.
 */

export type Locale = "fr" | "en";

export type IconName =
  | "smartphone"
  | "upload"
  | "box"
  | "share"
  | "clock"
  | "devices"
  | "qr"
  | "shield"
  | "home"
  | "building"
  | "key"
  | "star"
  | "globe"
  | "message"
  | "map"
  | "printer"
  | "sun"
  | "footprints"
  | "door"
  | "eye"
  | "sparkles"
  | "check"
  | "x";

export interface NavItem {
  label: string;
  href: string;
}

export interface Image {
  src: string;
  alt: string;
}

export interface SectionIntro {
  eyebrow: string;
  title: string;
  description?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: IconName;
}

// ── Site ────────────────────────────────────────────────────────────────

export interface SiteContent {
  name: string;
  url: string;
  /**
   * Adresse publique et DÉFINITIVE des visites : <toursUrl>/<slug>.
   * Ces URL sont intégrées chez les clients en iframe : ne jamais les changer.
   */
  toursUrl: string;
  tagline: string;
  description: string;
  email: string;
  nav: NavItem[];
  ctaLabel: string;
  skipLink: string;
  menuOpen: string;
  menuClose: string;
  footerBlurb: string;
  footerNavTitle: string;
  footerContactTitle: string;
  footerLegalTitle: string;
  legalLinks: NavItem[];
  copyright: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  badge: string;
  scrollLabel: string;
  /** Enregistrement d'écran d'une visite 3D, en boucle. */
  video: {
    enabled: boolean;
    webm: string;
    mp4?: string;
    /** Version portrait légère servie aux écrans < 768 px (fortement recommandée). */
    mobile?: { webm: string; mp4?: string };
  };
  poster: Image;
}

// ── Visites 3D ──────────────────────────────────────────────────────────

export type Vec3 = [number, number, number];

export interface TourRoom {
  /** Nom affiché sur le bouton (« Séjour », « Cuisine »…) */
  label: string;
  /** Position de la caméra (mètres, y = hauteur des yeux ≈ 1,6). */
  position: Vec3;
  /** Point regardé. */
  target: Vec3;
}

export interface Tour {
  slug: string;
  title: string;
  /** Ville ou mention (« Scène d'exemple »). */
  location: string;
  /** Type de logement (« Studio », « Maison »…) */
  kind: string;
  /** Surface en m² (facultative). */
  area?: number;
  description: string;
  /**
   * Fichier de scène (.spz recommandé), relatif à NEXT_PUBLIC_ASSETS_URL
   * (ex. « tours/appartement.spz »), ou URL absolue.
   */
  scene: string;
  /** Version allégée servie aux appareils tactiles (facultative). */
  sceneMobile?: string;
  /** Capture de la scène, affichée avant le lancement. */
  cover: Image;
  /** Vidéo de survol : repli sans WebGL et alternative à la visite. */
  video?: { webm: string; mp4?: string };
  /** Zone de déplacement autorisée (pour ne pas sortir du logement). */
  bounds: { min: Vec3; max: Vec3 };
  /** Points de vue ; le premier est le point de départ. */
  rooms: TourRoom[];
  /** Crédit et licence d'une scène tierce. */
  credit?: { text: string; href: string; licenseHref?: string };
}

export interface TourUiContent {
  explore: string;
  hint: string;
  loading: string;
  loadingUnknown: string;
  ready: string;
  dragHint: string;
  rooms: string;
  fullscreen: string;
  exitFullscreen: string;
  guidedTour: string;
  enterVr: string;
  exitVr: string;
  stopGuidedTour: string;
  help: string;
  closeHelp: string;
  helpTitle: string;
  helpDesktop: { keys: string; action: string }[];
  helpMobile: { keys: string; action: string }[];
  keyboardHint: string;
  viewerLabel: string;
  errorTitle: string;
  errorText: string;
  retry: string;
  fallbackTitle: string;
  fallbackText: string;
  fallbackTry: string;
  videoAlternative: string;
  closeVideo: string;
  credit: string;
}

// ── Sections ────────────────────────────────────────────────────────────

export interface DemoContent extends SectionIntro {
  moreDemos: string;
  openFullscreen: string;
  compare: {
    /** Affiche le bloc « Ce que vous filmez / Ce que vos voyageurs explorent ». */
    enabled: boolean;
    title: string;
    filmed: { label: string; caption: string; image: Image };
    explored: { label: string; caption: string; image: Image };
  };
}

export interface ShareContent extends SectionIntro {
  items: Feature[];
  note: string;
}

export interface ProjectsContent extends SectionIntro {
  openLabel: string;
  closeLabel: string;
  fullscreenLabel: string;
  /** Carte d'appel à l'action qui complète la grille. */
  cta: { title: string; text: string; button: string };
}

export interface PricingPlan {
  name: string;
  price: string;
  unit?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  city: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  /** Lien facultatif affiché sous la réponse. */
  link?: NavItem;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormContent {
  title: string;
  reassurance: string[];
  fields: {
    name: string;
    email: string;
    phone: string;
    optional: string;
    profile: string;
    profilePlaceholder: string;
    propertyType: string;
    propertyTypePlaceholder: string;
    area: string;
    areaUnit: string;
    units: string;
    unitsHint: string;
    city: string;
    website: string;
    websitePlaceholder: string;
    videosLink: string;
    videosLinkPlaceholder: string;
    videosLinkHint: string;
    message: string;
    messagePlaceholder: string;
    consent: string;
    consentLink: string;
  };
  profiles: SelectOption[];
  propertyTypes: SelectOption[];
  validation: {
    nameRequired: string;
    emailInvalid: string;
    phoneInvalid: string;
    profileRequired: string;
    propertyTypeRequired: string;
    areaInvalid: string;
    unitsInvalid: string;
    cityRequired: string;
    urlInvalid: string;
    messageTooShort: string;
    messageTooLong: string;
    consentRequired: string;
  };
  submit: string;
  submitting: string;
  successTitle: string;
  successMessage: string;
  successReset: string;
  errorGeneric: string;
  errorTurnstile: string;
  errorRateLimit: string;
}

export interface GuideStep {
  title: string;
  text: string;
  icon: IconName;
}

export interface GuideContent {
  eyebrow: string;
  title: string;
  description: string;
  metaDescription: string;
  /** Lien vers le guide depuis la page d'accueil. */
  teaser: { title: string; text: string; cta: string };
  steps: GuideStep[];
  dos: { title: string; items: string[] };
  donts: { title: string; items: string[] };
  checklist: { title: string; items: string[] };
  cta: { title: string; text: string; button: string };
}

export interface LegalSection {
  title: string;
  paragraphs: string[];
  list?: string[];
}

export interface LegalPage {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}

export interface NotFoundContent {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
}

export interface DemoPageContent {
  back: string;
  cta: string;
  sampleNote: string;
}

export interface Content {
  locale: Locale;
  site: SiteContent;
  hero: HeroContent;
  reassurance: { label: string; icon: IconName }[];
  demo: DemoContent;
  tours: Tour[];
  tourUi: TourUiContent;
  demoPage: DemoPageContent;
  howItWorks: SectionIntro & { steps: Feature[] };
  benefits: SectionIntro & { items: Feature[] };
  share: ShareContent;
  audiences: SectionIntro & { items: Feature[] };
  projects: ProjectsContent;
  pricing: SectionIntro & { plans: PricingPlan[]; note?: string };
  testimonials: SectionIntro & {
    /** Masque la section tant qu'il n'y a pas de vrais avis clients. */
    enabled: boolean;
    items: Testimonial[];
  };
  faq: SectionIntro & { items: FaqItem[] };
  form: FormContent;
  guide: GuideContent;
  legal: { mentions: LegalPage; privacy: LegalPage };
  notFound: NotFoundContent;
}
