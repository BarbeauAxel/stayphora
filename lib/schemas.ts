import { z } from "zod";
import type { FormContent } from "@/content/types";

// Désactive le mode JIT de zod (basé sur `new Function`) : il serait bloqué
// par la Content Security Policy (pas de 'unsafe-eval') et n'apporte rien ici.
z.config({ jitless: true });

/**
 * Schémas du formulaire de devis, partagés entre le client (react-hook-form)
 * et la route API (validation serveur). Toute règle modifiée ici s'applique
 * donc des deux côtés.
 */

export const PHOTO_LIMITS = {
  maxFiles: 10,
  /** Taille totale maximale après compression : reste sous la limite de Resend (40 Mo encodé en base64). */
  maxTotalBytes: 20 * 1024 * 1024,
  /** Garde-fou par fichier (une photo compressée pèse en général < 1 Mo). */
  maxFileBytes: 10 * 1024 * 1024,
  acceptedTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  /** Redimensionnement côté navigateur. */
  maxDimension: 2000,
  jpegQuality: 0.82,
} as const;

const PROFILE_VALUES = ["hote", "conciergerie", "agent", "autre"] as const;
const STYLE_VALUES = [
  "scandinave",
  "japandi",
  "boheme",
  "mediterraneen",
  "industriel",
  "boutique-hotel",
  "conseil",
] as const;

type Messages = FormContent["validation"];

/** Champs texte du formulaire. */
export function createQuoteFieldsSchema(m: Messages) {
  return z.object({
    name: z.string().trim().min(2, m.nameRequired).max(100, m.nameRequired),
    email: z.string().trim().max(200, m.emailInvalid).pipe(z.email(m.emailInvalid)),
    phone: z
      .string()
      .trim()
      .max(30, m.phoneInvalid)
      .refine((v) => v === "" || /^[+()\d\s.-]{6,30}$/.test(v), m.phoneInvalid),
    profile: z.enum(PROFILE_VALUES, m.profileRequired),
    rooms: z
      .string()
      .trim()
      .refine((v) => /^\d{1,2}$/.test(v) && Number(v) >= 1 && Number(v) <= 50, m.roomsInvalid),
    style: z.union([z.enum(STYLE_VALUES), z.literal("")]),
    message: z.string().trim().min(10, m.messageTooShort).max(3000, m.messageTooLong),
    consent: z.boolean(m.consentRequired).refine((v) => v, m.consentRequired),
    /** Honeypot : doit rester vide (vérifié séparément côté serveur). */
    website: z.string().max(0).optional(),
  });
}

/** Liste de photos (objets File), validée côté client ET côté serveur. */
export function createPhotosSchema(m: Messages) {
  return z
    .array(
      z
        .instanceof(File)
        .refine((f) => (PHOTO_LIMITS.acceptedTypes as readonly string[]).includes(f.type), m.photosType)
        .refine((f) => f.size > 0 && f.size <= PHOTO_LIMITS.maxFileBytes, m.photosTooLarge),
    )
    .max(PHOTO_LIMITS.maxFiles, m.photosTooMany)
    .refine((files) => files.reduce((sum, f) => sum + f.size, 0) <= PHOTO_LIMITS.maxTotalBytes, m.photosTooLarge);
}

export function createQuoteSchema(m: Messages) {
  return createQuoteFieldsSchema(m).extend({ photos: createPhotosSchema(m) });
}

export type QuoteFieldsInput = z.input<ReturnType<typeof createQuoteFieldsSchema>>;
export type QuoteFields = z.output<ReturnType<typeof createQuoteFieldsSchema>>;
export type QuoteData = z.output<ReturnType<typeof createQuoteSchema>>;

/** Réponse JSON de /api/devis. */
export type QuoteResponse =
  | { ok: true }
  | { ok: false; error: "validation" | "turnstile" | "rate_limit" | "too_large" | "server"; fields?: string[] };
