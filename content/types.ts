/**
 * Types du contenu éditorial.
 *
 * Tous les textes du site vivent dans `/content/<langue>/`. Pour ajouter
 * l'anglais : copier `/content/fr` vers `/content/en`, traduire, puis
 * l'enregistrer dans `/content/index.ts`. TypeScript signalera tout oubli.
 *
 * Convention : dans les titres, un mot entouré d'astérisques (`*sublimée*`)
 * est affiché en italique.
 */

export type Locale = "fr" | "en";

export type IconName =
  | "camera"
  | "palette"
  | "sparkles"
  | "download"
  | "home"
  | "building"
  | "key"
  | "clock"
  | "brush"
  | "refresh"
  | "shield";

export interface NavItem {
  label: string;
  href: string;
}

export interface SectionIntro {
  eyebrow: string;
  title: string;
  description?: string;
}

export interface SiteContent {
  name: string;
  url: string;
  tagline: string;
  description: string;
  email: string;
  socials: { instagram: string; linkedin: string };
  nav: NavItem[];
  ctaLabel: string;
  skipLink: string;
  menuOpen: string;
  menuClose: string;
  /** Phrase courte du footer (inclut le sens du nom). */
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
  scrollLabel: string;
  /**
   * Vidéo d'arrière-plan. Passer `enabled` à `true` une fois les fichiers
   * `/public/videos/hero.webm` et `/public/videos/hero.mp4` ajoutés.
   */
  video: { enabled: boolean; webm: string; mp4: string };
  poster: { src: string; alt: string };
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  location: string;
  style: string;
  before: ProjectImage;
  after: ProjectImage;
}

export interface ProjectsContent extends SectionIntro {
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
  openLabel: string;
  closeLabel: string;
  featured: Project;
  items: Project[];
}

export interface Step {
  title: string;
  description: string;
  icon: IconName;
}

export interface StyleItem {
  name: string;
  description: string;
  image: ProjectImage;
}

export interface Audience {
  title: string;
  benefit: string;
  icon: IconName;
}

export interface PricingPlan {
  name: string;
  price: string;
  /** Petite mention sous le prix (« par pièce », « par logement »…) */
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
    rooms: string;
    style: string;
    stylePlaceholder: string;
    message: string;
    messagePlaceholder: string;
    photos: string;
    photosHint: string;
    photosDrop: string;
    photosBrowse: string;
    photosRemove: string;
    photosTotal: string;
    photosProcessing: string;
    consent: string;
    consentLink: string;
  };
  profiles: SelectOption[];
  styles: SelectOption[];
  /** Messages de validation (partagés client / serveur). */
  validation: {
    nameRequired: string;
    emailInvalid: string;
    phoneInvalid: string;
    profileRequired: string;
    roomsInvalid: string;
    messageTooShort: string;
    messageTooLong: string;
    consentRequired: string;
    photosTooMany: string;
    photosType: string;
    photosTooLarge: string;
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

export interface Content {
  locale: Locale;
  site: SiteContent;
  hero: HeroContent;
  reassurance: { label: string; icon: IconName }[];
  projects: ProjectsContent;
  howItWorks: SectionIntro & { steps: Step[] };
  styles: SectionIntro & { items: StyleItem[] };
  audiences: SectionIntro & { items: Audience[] };
  pricing: SectionIntro & { plans: PricingPlan[]; note?: string };
  testimonials: SectionIntro & {
    /** Masque la section tant qu'il n'y a pas de vrais avis clients. */
    enabled: boolean;
    items: Testimonial[];
  };
  faq: SectionIntro & { items: FaqItem[] };
  form: FormContent;
  legal: { mentions: LegalPage; privacy: LegalPage };
  notFound: NotFoundContent;
}
