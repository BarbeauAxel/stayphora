import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getContent } from "@/content";
import { createQuoteSchema, PHOTO_LIMITS, type QuoteResponse } from "@/lib/schemas";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendEmail, filesToAttachments, internalEmail, confirmationEmail } from "@/lib/email";

/**
 * POST /api/devis : traitement du formulaire de demande de devis.
 * Runtime Node.js (par défaut avec OpenNext). Ne JAMAIS ajouter `runtime = "edge"`.
 *
 * Étapes : limitation de débit → taille → honeypot → Turnstile → zod → emails.
 */

/** Marge pour les champs texte et l'encodage multipart, en plus des photos. */
const MAX_BODY_BYTES = PHOTO_LIMITS.maxTotalBytes + 2 * 1024 * 1024;

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

    // 2. Taille du corps (avant de le lire entièrement).
    const length = Number(request.headers.get("content-length") ?? 0);
    if (length > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);

    const formData = await request.formData();

    // 3. Honeypot : un robot remplit ce champ caché. On répond « succès » sans rien envoyer.
    const honeypot = formData.get("website");
    if (typeof honeypot === "string" && honeypot.length > 0) return json({ ok: true });

    // 4. Turnstile.
    const token = formData.get("cf-turnstile-response");
    const human = await verifyTurnstile(typeof token === "string" ? token : "", env.TURNSTILE_SECRET_KEY, ip);
    if (!human) return json({ ok: false, error: "turnstile" }, 400);

    // 5. Validation avec le même schéma que le client.
    const text = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value : "";
    };
    const parsed = quoteSchema.safeParse({
      name: text("name"),
      email: text("email"),
      phone: text("phone"),
      profile: text("profile"),
      rooms: text("rooms"),
      style: text("style"),
      message: text("message"),
      consent: text("consent") === "true",
      website: "",
      photos: formData.getAll("photos").filter((v): v is File => v instanceof File && v.size > 0),
    });
    if (!parsed.success) {
      const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0] ?? "")))];
      return json({ ok: false, error: "validation", fields }, 400);
    }
    const data = parsed.data;

    // 6. Email interne avec les photos en pièces jointes.
    const internal = internalEmail(data, data.photos.length);
    const sent = await sendEmail({
      apiKey: env.RESEND_API_KEY,
      from: env.CONTACT_EMAIL_FROM,
      to: [env.CONTACT_EMAIL_TO],
      replyTo: data.email,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      attachments: await filesToAttachments(data.photos),
    });
    if (!sent) return json({ ok: false, error: "server" }, 502);

    // 7. Confirmation au client (un échec ici ne bloque pas la demande).
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
