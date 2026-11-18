import type { Content, Locale } from "./types";
import { fr } from "./fr";

export type * from "./types";

/**
 * Dictionnaires par langue. Pour l'anglais : créer `/content/en/index.ts`
 * (même forme que `fr`), l'importer ici et remplacer `fr` par `en` ci-dessous.
 */
const dictionaries: Record<Locale, Content> = {
  fr,
  en: fr, // TODO: remplacer par la version anglaise
};

export const defaultLocale: Locale = "fr";

export function getContent(locale: Locale = defaultLocale): Content {
  return dictionaries[locale];
}
