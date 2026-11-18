import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy.
 * - Turnstile charge un script et une iframe depuis challenges.cloudflare.com.
 * - Les pages étant statiques (SSG), on ne peut pas utiliser de nonce par
 *   requête : 'unsafe-inline' est nécessaire pour les scripts d'hydratation Next.
 * - 'unsafe-eval' uniquement en développement (React Refresh).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Ajouter `; preload` seulement si vous voulez inscrire le domaine dans la liste HSTS des navigateurs.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Racine explicite : évite que Turbopack remonte à un package-lock.json parent.
  turbopack: { root: import.meta.dirname },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Pas de redirect() www → apex ici : les pages pré-rendues sont servies par le
  // cache OpenNext avant le routage Next. La redirection se fait via une
  // Redirect Rule Cloudflare, exécutée avant le Worker (voir README).
};

export default nextConfig;

// Donne accès aux bindings Cloudflare (vars, secrets de .dev.vars, IMAGES…) pendant `next dev`.
initOpenNextCloudflareForDev();
