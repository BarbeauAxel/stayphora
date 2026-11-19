/**
 * Liens vers les visites 3D, utilisables côté client comme côté serveur.
 *
 * - Production : NEXT_PUBLIC_TOURS_URL = https://visite.stayphora.fr
 *   → liens absolus https://visite.stayphora.fr/<slug>
 * - Local (variable vide) : liens relatifs /demo/<slug>
 *
 * L'adresse canonique (balise canonical, sitemap, code d'intégration) est
 * toujours `site.toursUrl` (content/fr/site.ts), indépendamment de l'environnement.
 */
const TOURS_URL = (process.env.NEXT_PUBLIC_TOURS_URL ?? "").replace(/\/+$/, "");

/** Vrai quand les visites sont servies sur leur propre domaine. */
export const toursOnOwnDomain = TOURS_URL !== "";

export function tourHref(slug: string): string {
  return toursOnOwnDomain ? `${TOURS_URL}/${slug}` : `/demo/${slug}`;
}

/** Lien vers une page du site depuis une visite (absolu si la visite est sur son domaine). */
export function siteHref(path: string, siteUrl: string): string {
  return toursOnOwnDomain ? `${siteUrl.replace(/\/+$/, "")}${path}` : path;
}
