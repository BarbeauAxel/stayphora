/**
 * Routage par domaine des visites 3D, exécuté dans le Worker personnalisé
 * (cloudflare-worker.ts) AVANT le Worker OpenNext.
 *
 * - visite.stayphora.fr/<slug>      → sert la page /demo/<slug> (réécriture interne)
 * - visite.stayphora.fr/ (et autres) → 301 vers https://stayphora.fr
 * - stayphora.fr/demo/<slug>        → 301 vers https://visite.stayphora.fr/<slug>
 *
 * Les autres hôtes (localhost en dev / preview) ne sont pas modifiés :
 * /demo/<slug> continue de fonctionner en local.
 *
 * Pourquoi pas next.config.ts ou proxy.ts ? Les pages pré-rendues sont servies
 * par le cache OpenNext avant le routage Next : redirections et réécritures
 * Next ne s'y appliqueraient pas. Ici, la logique passe avant tout le reste.
 */

export type RouteDecision =
  | { type: "pass" }
  | { type: "rewrite"; pathname: string }
  | { type: "redirect"; location: string };

export interface RoutingConfig {
  /** Origine publique du site, ex. https://stayphora.fr */
  siteUrl: string;
  /** Origine publique des visites, ex. https://visite.stayphora.fr */
  toursUrl: string;
  /** Slugs des visites existantes. */
  slugs: ReadonlySet<string>;
}

/** Fichiers et routes techniques servis tels quels sur le domaine des visites. */
const TOURS_HOST_PASSTHROUGH = [
  /^\/_next\//, // JS, CSS, polices, optimisation d'images
  /^\/cdn-cgi\//,
  /^\/images\//,
  /^\/videos\//,
  /^\/licences\//,
  /^\/demo\/tours\//, // scènes locales (en production, elles sont servies par R2)
  /^\/(icon|apple-icon)(\/|$|\?)/,
  /^\/(favicon\.ico|manifest\.webmanifest|robots\.txt)$/,
];

const MAIN_HOSTS = (siteUrl: string) => {
  const host = new URL(siteUrl).hostname;
  return new Set([host, `www.${host}`]);
};

export function routeRequest(url: URL, config: RoutingConfig): RouteDecision {
  const toursHost = new URL(config.toursUrl).hostname;
  const host = url.hostname;
  const path = url.pathname;

  // ── Domaine des visites ─────────────────────────────────────────────────
  if (host === toursHost) {
    if (TOURS_HOST_PASSTHROUGH.some((re) => re.test(path))) return { type: "pass" };

    // /demo/<slug> sur le domaine des visites : adresse canonique sans /demo.
    const legacy = /^\/demo\/([a-z0-9-]+)\/?$/.exec(path);
    if (legacy?.[1] && config.slugs.has(legacy[1])) {
      return { type: "redirect", location: `${config.toursUrl}/${legacy[1]}${url.search}` };
    }

    const match = /^\/([a-z0-9-]+)\/?$/.exec(path);
    if (match?.[1] && config.slugs.has(match[1])) {
      return { type: "rewrite", pathname: `/demo/${match[1]}` };
    }

    // Accueil et toute autre page : vers le site principal.
    return { type: "redirect", location: config.siteUrl };
  }

  // ── Site principal : les visites ont déménagé ───────────────────────────
  if (MAIN_HOSTS(config.siteUrl).has(host)) {
    const match = /^\/demo\/([a-z0-9-]+)\/?$/.exec(path);
    if (match?.[1]) return { type: "redirect", location: `${config.toursUrl}/${match[1]}${url.search}` };
  }

  return { type: "pass" };
}
