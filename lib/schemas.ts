import { z } from "zod";
import type { FormContent } from "@/content/types";

// Désactive le mode JIT de zod (basé sur `new Function`) : il serait bloqué
// par la Content Security Policy (pas de 'unsafe-eval') et n'apporte rien ici.
z.config({ jitless: true });

/**
 * Schéma du formulaire de devis, partagé entre le client (react-hook-form)
 * et la route API (validation serveur) : une règle modifiée ici s'applique
 * des deux côtés.
 */

export const PROFILE_VALUES = ["conciergerie", "proprietaire", "hote", "agent", "autre"] as const;
export const PROPERTY_VALUES = ["studio", "appartement", "maison", "gite", "chambres-hotes", "plusieurs", "autre"] as const;

type Messages = FormContent["validation"];

/** Ajoute https:// si l'utilisateur colle « wetransfer.com/… ». */
function normalizeUrl(value: string): string {
  const v = value.trim();
  if (v === "" || /^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

const isIntBetween = (v: string, min: number, max: number) => /^\d{1,5}$/.test(v) && Number(v) >= min && Number(v) <= max;

function optionalUrl(m: Messages) {
  return z
    .string()
    .max(500, m.urlInvalid)
    .transform(normalizeUrl)
    .refine((v) => v === "" || isHttpUrl(v), m.urlInvalid);
}

export function createQuoteSchema(m: Messages) {
  return z
    .object({
      name: z.string().trim().min(2, m.nameRequired).max(100, m.nameRequired),
      email: z.string().trim().max(200, m.emailInvalid).pipe(z.email(m.emailInvalid)),
      phone: z
        .string()
        .trim()
        .max(30, m.phoneInvalid)
        .refine((v) => v === "" || /^[+()\d\s.-]{6,30}$/.test(v), m.phoneInvalid),
      profile: z.enum(PROFILE_VALUES, m.profileRequired),
      propertyType: z.enum(PROPERTY_VALUES, m.propertyTypeRequired),
      area: z
        .string()
        .trim()
        .refine((v) => isIntBetween(v, 5, 5000), m.areaInvalid),
      units: z.string().trim().max(5, m.unitsInvalid),
      city: z.string().trim().min(2, m.cityRequired).max(100, m.cityRequired),
      website: optionalUrl(m),
      videosLink: optionalUrl(m),
      message: z.string().trim().min(10, m.messageTooShort).max(3000, m.messageTooLong),
      consent: z.boolean(m.consentRequired).refine((v) => v, m.consentRequired),
      /** Honeypot : doit rester vide (vérifié séparément côté serveur). */
      company: z.string().max(0).optional(),
    })
    .superRefine((data, ctx) => {
      // Le nombre de logements n'est demandé qu'aux conciergeries.
      const required = data.profile === "conciergerie";
      if ((required || data.units !== "") && !isIntBetween(data.units, 1, 5000)) {
        ctx.addIssue({ code: "custom", path: ["units"], message: m.unitsInvalid });
      }
    });
}

export type QuoteInput = z.input<ReturnType<typeof createQuoteSchema>>;
export type QuoteData = z.output<ReturnType<typeof createQuoteSchema>>;

/** Réponse JSON de /api/devis. */
export type QuoteResponse =
  | { ok: true }
  | { ok: false; error: "validation" | "turnstile" | "rate_limit" | "server"; fields?: string[] };
