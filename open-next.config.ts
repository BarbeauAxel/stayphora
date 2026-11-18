import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Le site est 100 % statique (SSG, aucune revalidation) : les pages
 * pré-rendues sont lues directement depuis les Workers Static Assets.
 * Ce cache est en lecture seule, ce qui ne pose pas problème ici, et
 * il ne demande ni R2, ni KV, ni file d'attente.
 *
 * ── Activer l'ISR plus tard (`revalidate`, `revalidatePath`…) ──────────
 * 1. Créer un bucket R2 :  npx wrangler r2 bucket create stayphora-inc-cache
 * 2. Décommenter `r2_buckets` et `services` dans wrangler.jsonc
 * 3. Remplacer la configuration ci-dessous par :
 *
 *    import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
 *    export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });
 *
 *    (Pour la revalidation à la demande, ajouter aussi une file d'attente et un
 *    tag cache : https://opennext.js.org/cloudflare/caching)
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
