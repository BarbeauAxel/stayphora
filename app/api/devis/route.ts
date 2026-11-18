import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getContent } from "@/content";
import { createQuoteSchema, type QuoteResponse } from "@/lib/schemas";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendEmail, internalEmail, confirmationEmail } from "@/lib/email";

/**
 * POST /api/devis : traitement du formulaire de demande de devis (JSON).
 * Runtime Node.js (par défaut avec OpenNext). Ne JAMAIS ajouter `runtime = "edge"`.
 *
 * Étapes : limitation de débit → taille → honeypot → Turnstile → zod → emails.
 */

const MAX_BODY_BYTES = 32 * 1024;
const quoteSchema = createQuoteSchema(getContent().form.validation);

function json(body: QuoteResponse, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const { env } = getCloudflareContext();
  const ip = request.headers.get("cf-connecting-ip");

  try {
    // 1. Limitation de débit (5 requêtes / minute / IP), si le binding est présent.
    if (env.DEVIS_RATE_LIMITER) {
      const { success } = await env.DEVIS_RATE_LIMITER.limit({ key: ip ?? "anonymous" });
      if (!success) return json({ ok: false, error: "rate_limit" }, 429);
    }

    // 2. Taille et format du corps.
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "validation" }, 413);
    let body: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error();
      body = parsed as Record<string, unknown>;
    } catch {
      return json({ ok: false, error: "validation" }, 400);
    }

    // 3. Honeypot : un robot remplit ce champ caché. On répond « succès » sans rien envoyer.
    if (typeof body.company === "string" && body.company.length > 0) return json({ ok: true });

    // 4. Turnstile.
    const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    const human = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip);
    if (!human) return json({ ok: false, error: "turnstile" }, 400);

    // 5. Validation avec le même schéma que le client.
    const parsed = quoteSchema.safeParse({ ...body, company: "" });
    if (!parsed.success) {
      const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0] ?? "")))];
      return json({ ok: false, error: "validation", fields }, 400);
    }
    const data = parsed.data;

    // 6. Email interne.
    const internal = internalEmail(data);
    const sent = await sendEmail({
      apiKey: env.RESEND_API_KEY,
      from: env.CONTACT_EMAIL_FROM,
      to: [env.CONTACT_EMAIL_TO],
      replyTo: data.email,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
    });
    if (!sent) return json({ ok: false, error: "server" }, 502);

    // 7. Confirmation au client, avec le guide de tournage (un échec ici ne bloque pas la demande).
    const confirmation = confirmationEmail(data);
    await sendEmail({
      apiKey: env.RESEND_API_KEY,
      from: env.CONTACT_EMAIL_FROM,
      to: [data.email],
      replyTo: env.CONTACT_EMAIL_TO,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    });

    return json({ ok: true });
  } catch (error) {
    console.error("[devis] erreur inattendue", error);
    return json({ ok: false, error: "server" }, 500);
  }
}
