import { Fragment } from "react";

/**
 * Affiche un texte où les segments entre astérisques sont en italique.
 * « Voyez votre location *sublimée* » → « sublimée » en italique.
 */
export function RichText({ text, emClassName = "italic" }: { text: string; emClassName?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <em key={i} className={emClassName}>
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Version texte brut (pour les attributs, metadata…). */
export function plainText(text: string): string {
  return text.replace(/\*/g, "");
}
