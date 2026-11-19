import type { QuoteData } from "./schemas";

/**
 * Enregistrement des demandes de devis dans Cloudflare D1 (table `quotes`,
 * voir migrations/0001_quotes.sql). Toutes les fonctions acceptent une base
 * absente (`undefined`) et ne lèvent jamais d'exception : un problème de base
 * ne doit pas empêcher l'envoi des emails.
 */

/** Insère la demande. Renvoie true si elle est bien enregistrée. */
export async function saveQuote(db: D1Database | undefined, id: string, data: QuoteData): Promise<boolean> {
  if (!db) return false;
  try {
    await db
      .prepare(
        `INSERT INTO quotes (id, created_at, name, email, phone, profile, property_type, area, units, city, website, videos_link, message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        new Date().toISOString(),
        data.name,
        data.email,
        data.phone,
        data.profile,
        data.propertyType,
        Number(data.area),
        data.units ? Number(data.units) : null,
        data.city,
        data.website,
        data.videosLink,
        data.message,
      )
      .run();
    return true;
  } catch (error) {
    console.error("[devis] enregistrement D1 impossible", error);
    return false;
  }
}

/** Met à jour les indicateurs d'envoi des emails. */
export async function markQuoteEmails(
  db: D1Database | undefined,
  id: string,
  sent: { internal: boolean; confirmation: boolean },
): Promise<void> {
  if (!db) return;
  try {
    await db
      .prepare("UPDATE quotes SET internal_email_sent = ?, confirmation_email_sent = ? WHERE id = ?")
      .bind(sent.internal ? 1 : 0, sent.confirmation ? 1 : 0, id)
      .run();
  } catch (error) {
    console.error("[devis] mise à jour D1 impossible", error);
  }
}
