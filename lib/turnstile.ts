/**
 * Vérification serveur d'un jeton Cloudflare Turnstile.
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface SiteverifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyTurnstile(token: string, secret: string, ip?: string | null): Promise<boolean> {
  if (!token || !secret) return false;

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  body.append("idempotency_key", crypto.randomUUID());

  try {
    const res = await fetch(SITEVERIFY_URL, { method: "POST", body });
    if (!res.ok) return false;
    const data = (await res.json()) as SiteverifyResponse;
    if (!data.success) console.warn("[turnstile] échec", data["error-codes"]);
    return data.success === true;
  } catch (error) {
    console.error("[turnstile] erreur réseau", error);
    return false;
  }
}
