import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const isDev = process.env.NODE_ENV !== "production";

/** Origine des fichiers 3D (bucket R2 public), ex. https://assets.stayphora.fr */
const assetsOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_ASSETS_URL ? new URL(process.env.NEXT_PUBLIC_ASSETS_URL).origin : "";
  } catch {
    return "";
  }
})();

/**
 * Content Security Policy.
 * - Turnstile charge un script et une iframe depuis challenges.cloudflare.com.
 * - Les pages étant statiques (SSG), on ne peut pas utiliser de nonce par
 *   requête : 'unsafe-inline' est nécessaire pour les scripts d'hydratation Next.
 * - Viewer 3D (Spark) : WebAssembly ('wasm-unsafe-eval', sans autoriser eval),
 *   workers créés depuis des blob:, fichiers de scène lus sur le domaine des assets.
 * - Cloudflare Web Analytics : script sur static.cloudflareinsights.com, envoi des
 *   mesures vers cloudflareinsights.com.
 * - 'unsafe-eval' uniquement en développement (React Refresh).
 */
const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://challenges.cloudflare.com https://static.cloudflareinsights.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${assetsOrigin}`.trim(),
  `media-src 'self' blob: ${assetsOrigin}`.trim(),
  "font-src 'self'",
  `connect-src 'self' blob: data: https://challenges.cloudflare.com https://cloudflareinsights.com ${assetsOrigin}`.trim(),
  "frame-src https://challenges.cloudflare.com",
  "worker-src 'self' blob: data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
];
/** Site : intégration en iframe interdite ailleurs que sur stayphora.fr. */
const csp = [...cspDirectives, "frame-ancestors 'self'"].join("; ");
/** Pages /demo/* : intégrables chez les clients (code d'intégration iframe). */
const cspEmbeddable = [...cspDirectives, "frame-ancestors *"].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // Plein écran et WebXR autorisés pour le viewer 3D (y compris intégré en iframe chez un client).
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), fullscreen=*, xr-spatial-tracking=*",
  },
  // Ajouter `; preload` seulement si vous voulez inscrire le domaine dans la liste HSTS des navigateurs.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    // Racine explicite : évite que Turbopack remonte à un package-lock.json parent.
    root: import.meta.dirname,
    // three.js et Spark ne servent qu'au navigateur (viewer chargé à la demande,
    // jamais rendu côté serveur). Côté serveur, on les remplace par un module
    // vide pour qu'ils n'entrent pas dans le bundle du Worker (limite de 3 Mo).
    resolveAlias: {
      three: { browser: "three", default: "./lib/stubs/empty.cjs" },
      "@sparkjsdev/spark": { browser: "@sparkjsdev/spark", default: "./lib/stubs/empty.cjs" },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Remplace la CSP (même clé, règle suivante) pour les visites intégrables.
      { source: "/demo/:slug*", headers: [{ key: "Content-Security-Policy", value: cspEmbeddable }] },
    ];
  },
  // Pas de redirect() www → apex ici : les pages pré-rendues sont servies par le
  // cache OpenNext avant le routage Next. La redirection se fait via une
  // Redirect Rule Cloudflare, exécutée avant le Worker (voir README).
};

export default nextConfig;

// Donne accès aux bindings Cloudflare (vars, secrets de .dev.vars, IMAGES…) pendant `next dev`.
initOpenNextCloudflareForDev();
