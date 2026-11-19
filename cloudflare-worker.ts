/**
 * Point d'entrée du Worker Cloudflare (voir `main` dans wrangler.jsonc).
 *
 * Il enveloppe le Worker généré par OpenNext pour router les visites 3D par
 * domaine (visite.stayphora.fr) avant toute autre logique : voir
 * lib/tour-routing.ts. Méthode documentée par OpenNext :
 * https://opennext.js.org/cloudflare/howtos/custom-worker
 */
// @ts-expect-error : généré par `opennextjs-cloudflare build`
import { default as openNextWorker } from "./.open-next/worker.js";
import { site } from "./content/fr/site";
import { tours } from "./content/fr/tours";
import { routeRequest } from "./lib/tour-routing";

const routing = {
  siteUrl: site.url,
  toursUrl: site.toursUrl,
  slugs: new Set(tours.map((tour) => tour.slug)),
};

/**
 * Hôte utilisé pour le routage.
 * - Production : le vrai nom d'hôte (Custom Domains).
 * - `npm run preview` (NEXTJS_ENV=development, défini dans .dev.vars) : Miniflare
 *   remplace l'hôte par celui de la première route ; on utilise donc « localhost »,
 *   ou l'en-tête `x-stayphora-host` pour simuler un domaine pendant les tests.
 */
function routingHost(request: Request, env: CloudflareEnv): string {
  if (env.NEXTJS_ENV === "development") return request.headers.get("x-stayphora-host") ?? "localhost";
  return new URL(request.url).hostname;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const routingUrl = new URL(url);
    routingUrl.hostname = routingHost(request, env);
    const decision = routeRequest(routingUrl, routing);

    if (decision.type === "redirect") {
      return new Response(null, { status: 301, headers: { Location: decision.location } });
    }
    if (decision.type === "rewrite") {
      url.pathname = decision.pathname;
      return openNextWorker.fetch(new Request(url, request), env, ctx);
    }
    return openNextWorker.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<CloudflareEnv>;
