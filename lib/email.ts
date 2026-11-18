import type { QuoteData } from "./schemas";
import { getContent } from "@/content";

/**
 * Envoi d'emails via l'API REST de Resend (pas de SDK : `fetch` suffit et
 * garde le Worker léger). https://resend.com/docs/api-reference/emails/send-email
 */

interface Attachment {
  filename: string;
  /** Contenu encodé en base64. */
  content: string;
}

interface SendEmailParams {
  apiKey: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: Attachment[];
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: params.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      reply_to: params.replyTo,
      attachments: params.attachments,
    }),
  });
  if (!res.ok) {
    // Journalisé côté serveur uniquement (visible dans Workers Observability).
    console.error("[resend] échec", res.status, await res.text().catch(() => ""));
  }
  return res.ok;
}

export async function filesToAttachments(files: File[]): Promise<Attachment[]> {
  return Promise.all(
    files.map(async (file, i) => ({
      filename: sanitizeFilename(file.name, i),
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    })),
  );
}

function sanitizeFilename(name: string, index: number): string {
  const ext = name.match(/\.(jpe?g|png|webp)$/i)?.[0]?.toLowerCase() ?? ".jpg";
  const base = name
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .slice(0, 60);
  return `${String(index + 1).padStart(2, "0")}-${base || "photo"}${ext}`;
}

// ── Gabarits ──────────────────────────────────────────────────────────────

const colors = {
  cream: "#FAF8F5",
  sand: "#F2EEE8",
  ink: "#1F1B16",
  stone: "#6B645B",
  clay: "#B5785A",
  clayDark: "#9A6247",
  line: "#E5DFD6",
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${colors.sand};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.sand};padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${colors.cream};border:1px solid ${colors.line};border-radius:16px;">
        <tr><td style="padding:32px 36px 8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${colors.ink};">
          Stayphora<span style="color:${colors.clay};">.</span>
        </td></tr>
        <tr><td style="padding:8px 36px 36px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${colors.ink};">
          ${body}
        </td></tr>
      </table>
      <p style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${colors.stone};margin:20px 0 0;">Stayphora · stayphora.fr</p>
    </td></tr>
  </table>
</body>
</html>`;
}

function labelOf(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/** Email interne : toutes les informations de la demande. */
export function internalEmail(data: QuoteData, photoCount: number) {
  const { form } = getContent();
  const rows: [string, string][] = [
    [form.fields.name, data.name],
    [form.fields.email, data.email],
    [form.fields.phone, data.phone || "—"],
    [form.fields.profile, labelOf(form.profiles, data.profile)],
    [form.fields.rooms, data.rooms],
    [form.fields.style, data.style ? labelOf(form.styles, data.style) : "—"],
    [form.fields.photos, `${photoCount} en pièce jointe`],
  ];

  const table = rows
    .map(
      ([k, v]) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid ${colors.line};color:${colors.stone};font-size:13px;width:38%;vertical-align:top;">${escapeHtml(k)}</td>
        <td style="padding:10px 0;border-bottom:1px solid ${colors.line};font-weight:600;">${escapeHtml(v)}</td>
      </tr>`,
    )
    .join("");

  const body = `
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${colors.clayDark};">Nouvelle demande de devis</p>
    <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-weight:400;font-size:26px;">${escapeHtml(data.name)}</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">${table}</table>
    <h2 style="margin:28px 0 8px;font-family:Georgia,serif;font-weight:400;font-size:20px;">Message</h2>
    <div style="background:${colors.sand};border-radius:12px;padding:16px 18px;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
    <p style="margin:28px 0 0;">
      <a href="mailto:${encodeURIComponent(data.email)}" style="display:inline-block;background:${colors.clayDark};color:${colors.cream};text-decoration:none;padding:12px 22px;border-radius:999px;">Répondre à ${escapeHtml(data.name.split(" ")[0] ?? data.name)}</a>
    </p>`;

  const text = [
    "Nouvelle demande de devis",
    "",
    ...rows.map(([k, v]) => `${k} : ${v}`),
    "",
    "Message :",
    data.message,
  ].join("\n");

  return {
    subject: `Demande de devis · ${data.name} (${labelOf(form.profiles, data.profile)})`,
    html: layout("Nouvelle demande de devis", body),
    text,
  };
}

/** Email de confirmation envoyé au client. */
export function confirmationEmail(data: QuoteData) {
  const { site } = getContent();
  const firstName = data.name.split(" ")[0] ?? data.name;

  const body = `
    <h1 style="margin:8px 0 16px;font-family:Georgia,serif;font-weight:400;font-size:28px;line-height:1.2;">Merci ${escapeHtml(firstName)}, votre demande est <em style="color:${colors.clay};">bien</em> arrivée.</h1>
    <p style="margin:0 0 14px;">Nous avons bien reçu votre demande de devis et vos photos. Nous revenons vers vous sous 24 h avec une proposition personnalisée.</p>
    <p style="margin:0 0 14px;">En attendant, vous pouvez répondre directement à cet email pour nous transmettre une précision ou des photos supplémentaires.</p>
    <p style="margin:24px 0 0;color:${colors.stone};">À très vite,<br>L'équipe Stayphora</p>`;

  const text = [
    `Merci ${firstName}, votre demande est bien arrivée.`,
    "",
    "Nous avons bien reçu votre demande de devis et vos photos. Nous revenons vers vous sous 24 h avec une proposition personnalisée.",
    "",
    "Vous pouvez répondre directement à cet email pour nous transmettre une précision.",
    "",
    "À très vite,",
    "L'équipe Stayphora",
    site.url,
  ].join("\n");

  return {
    subject: "Votre demande de devis Stayphora",
    html: layout("Votre demande de devis", body),
    text,
  };
}
