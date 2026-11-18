/**
 * Résout l'URL d'un fichier 3D.
 * - Production : NEXT_PUBLIC_ASSETS_URL (bucket R2 public, ex. https://assets.stayphora.fr)
 * - Développement (variable absente) : fichiers locaux de /public/demo
 */
const ASSETS_BASE = (process.env.NEXT_PUBLIC_ASSETS_URL || "/demo").replace(/\/+$/, "");

export function assetUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${ASSETS_BASE}/${path.replace(/^\/+/, "")}`;
}
