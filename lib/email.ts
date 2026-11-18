import type { QuoteData } from "./schemas";
import { getContent } from "@/content";

/**
 * Envoi d'emails via l'API REST de Resend (pas de SDK : `fetch` suffit et
 * garde le Worker léger). https://resend.com/docs/api-reference/emails/send-email
 */

interface SendEmailParams {
  apiKey: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
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
    }),
  });
  if (!res.ok) {
    // Journalisé côté serveur uniquement (visible dans Workers Observability).
    console.error("[resend] échec", res.status, await res.text().catch(() => ""));
  }
  return res.ok;
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

const serif = "Georgia,'Times New Roman',serif";
const sans = "Helvetica,Arial,sans-serif";

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
        <tr><td style="padding:32px 36px 8px;font-family:${serif};font-size:28px;color:${colors.ink};">
          Stayphora<span style="color:${colors.clay};">.</span>
        </td></tr>
        <tr><td style="padding:8px 36px 36px;font-family:${sans};font-size:15px;line-height:1.6;color:${colors.ink};">
          ${body}
        </td></tr>
      </table>
      <p style="font-family:${sans};font-size:12px;color:${colors.stone};margin:20px 0 0;">Stayphora · Visites 3D pour locations courte durée · stayphora.fr</p>
    </td></tr>
  </table>
</body>
</html>`;
}

function labelOf(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function linkOrDash(url: string): string {
  return url ? `<a href="${escapeHtml(url)}" style="color:${colors.clayDark};">${escapeHtml(url)}</a>` : "—";
}

/** Email interne : toutes les informations de la demande. */
export function internalEmail(data: QuoteData) {
  const { form } = getContent();
  const f = form.fields;
  const rows: [string, string, string][] = [
    // [libellé, valeur texte, valeur HTML]
    [f.name, data.name, escapeHtml(data.name)],
    [f.email, data.email, `<a href="mailto:${escapeHtml(data.email)}" style="color:${colors.clayDark};">${escapeHtml(data.email)}</a>`],
    [f.phone, data.phone || "—", escapeHtml(data.phone || "—")],
    [f.profile, labelOf(form.profiles, data.profile), escapeHtml(labelOf(form.profiles, data.profile))],
    [f.propertyType, labelOf(form.propertyTypes, data.propertyType), escapeHtml(labelOf(form.propertyTypes, data.propertyType))],
    [f.area, `${data.area} m²`, `${escapeHtml(data.area)} m²`],
    ...(data.units ? [[f.units, data.units, escapeHtml(data.units)] as [string, string, string]] : []),
    [f.city, data.city, escapeHtml(data.city)],
    [f.website, data.website || "—", linkOrDash(data.website)],
    [f.videosLink, data.videosLink || "—", linkOrDash(data.videosLink)],
  ];

  const table = rows
    .map(
      ([k, , html]) => `<tr>
        <td style="padding:10px 12px 10px 0;border-bottom:1px solid ${colors.line};color:${colors.stone};font-size:13px;width:40%;vertical-align:top;">${escapeHtml(k)}</td>
        <td style="padding:10px 0;border-bottom:1px solid ${colors.line};font-weight:600;word-break:break-word;">${html}</td>
      </tr>`,
    )
    .join("");

  const body = `
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${colors.clayDark};">Nouvelle demande de devis</p>
    <h1 style="margin:0 0 24px;font-family:${serif};font-weight:400;font-size:26px;">${escapeHtml(data.name)} · ${escapeHtml(data.city)}</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">${table}</table>
    <h2 style="margin:28px 0 8px;font-family:${serif};font-weight:400;font-size:20px;">Message</h2>
    <div style="background:${colors.sand};border-radius:12px;padding:16px 18px;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
    <p style="margin:28px 0 0;">
      <a href="mailto:${encodeURIComponent(data.email)}" style="display:inline-block;background:${colors.clayDark};color:${colors.cream};text-decoration:none;padding:12px 22px;border-radius:999px;">Répondre à ${escapeHtml(data.name.split(" ")[0] ?? data.name)}</a>
    </p>`;

  const text = ["Nouvelle demande de devis", "", ...rows.map(([k, v]) => `${k} : ${v}`), "", "Message :", data.message].join(
    "\n",
  );

  return {
    subject: `Devis visite 3D · ${data.name} · ${labelOf(form.propertyTypes, data.propertyType)} · ${data.city}`,
    html: layout("Nouvelle demande de devis", body),
    text,
  };
}

/** Email de confirmation envoyé au client, avec le guide de tournage. */
export function confirmationEmail(data: QuoteData) {
  const { site, guide } = getContent();
  const firstName = data.name.split(" ")[0] ?? data.name;
  const plain = (s: string) => s.replace(/\*/g, "");

  const steps = guide.steps
    .map(
      (step, i) => `<tr>
        <td style="width:36px;vertical-align:top;padding:10px 0;font-family:${serif};font-size:22px;color:${colors.clay};">${i + 1}</td>
        <td style="padding:10px 0;border-bottom:1px solid ${colors.line};">
          <strong style="display:block;font-size:15px;">${escapeHtml(step.title)}</strong>
          <span style="color:${colors.stone};font-size:14px;">${escapeHtml(step.text)}</span>
        </td>
      </tr>`,
    )
    .join("");
  const list = (items: string[], mark: string) =>
    items.map((i) => `<li style="margin:0 0 6px;">${mark} ${escapeHtml(i)}</li>`).join("");

  const body = `
    <h1 style="margin:8px 0 16px;font-family:${serif};font-weight:400;font-size:28px;line-height:1.2;">Merci ${escapeHtml(firstName)}, votre demande est <em style="color:${colors.clay};">bien</em> arrivée.</h1>
    <p style="margin:0 0 14px;">Nous revenons vers vous sous 24 h avec un devis personnalisé pour votre logement à ${escapeHtml(data.city)}.</p>
    <p style="margin:0 0 28px;">En attendant, voici notre guide pour filmer votre logement. Dix minutes de préparation font toute la différence.</p>

    <div style="background:${colors.sand};border-radius:16px;padding:24px 24px 12px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${colors.clayDark};">${escapeHtml(guide.eyebrow)}</p>
      <h2 style="margin:0 0 12px;font-family:${serif};font-weight:400;font-size:22px;">${escapeHtml(plain(guide.title))}</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}</table>
      <h3 style="margin:22px 0 8px;font-family:${serif};font-weight:400;font-size:18px;">${escapeHtml(guide.dos.title)}</h3>
      <ul style="margin:0;padding:0 0 0 2px;list-style:none;font-size:14px;">${list(guide.dos.items, "✓")}</ul>
      <h3 style="margin:18px 0 8px;font-family:${serif};font-weight:400;font-size:18px;">${escapeHtml(guide.donts.title)}</h3>
      <ul style="margin:0 0 12px;padding:0 0 0 2px;list-style:none;font-size:14px;">${list(guide.donts.items, "✗")}</ul>
    </div>

    <p style="margin:24px 0 0;">Le guide complet est aussi en ligne : <a href="${site.url}/guide-tournage" style="color:${colors.clayDark};">${site.url.replace("https://", "")}/guide-tournage</a></p>
    <p style="margin:14px 0 0;">Une question ? Répondez simplement à cet email.</p>
    <p style="margin:24px 0 0;color:${colors.stone};">À très vite,<br>L'équipe Stayphora</p>`;

  const text = [
    `Merci ${firstName}, votre demande est bien arrivée.`,
    "",
    `Nous revenons vers vous sous 24 h avec un devis personnalisé pour votre logement à ${data.city}.`,
    "",
    `${guide.eyebrow.toUpperCase()} : ${plain(guide.title)}`,
    "",
    ...guide.steps.map((s, i) => `${i + 1}. ${s.title} : ${s.text}`),
    "",
    `${guide.dos.title} :`,
    ...guide.dos.items.map((i) => `  ✓ ${i}`),
    "",
    `${guide.donts.title} :`,
    ...guide.donts.items.map((i) => `  ✗ ${i}`),
    "",
    `Guide complet : ${site.url}/guide-tournage`,
    "",
    "À très vite,",
    "L'équipe Stayphora",
  ].join("\n");

  return {
    subject: "Votre demande de visite 3D · Stayphora (+ guide de tournage)",
    html: layout("Votre demande de devis", body),
    text,
  };
}
