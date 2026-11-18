import type { CSSProperties, ReactNode } from "react";

/**
 * Apparition au scroll (fondu + translation de 20 px), en CSS pur.
 * Ces composants sont rendus côté serveur : un seul IntersectionObserver
 * global (RevealObserver) ajoute la classe `is-revealed`. Aucun JavaScript
 * par élément, donc une hydratation bien plus légère. Sans JavaScript, le
 * contenu reste visible (les styles ne s'appliquent que sous `html.js`).
 * Voir les règles `[data-reveal]` dans app/globals.css.
 */

type Tag = "div" | "li" | "ul" | "ol" | "section" | "article";

export function Reveal({
  children,
  className,
  delay = 0,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: Tag;
}) {
  const style = delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined;
  return (
    <Component data-reveal="" className={className} style={style}>
      {children}
    </Component>
  );
}

/** Conteneur dont les `RevealItem` apparaissent en décalé (stagger). */
export function RevealGroup({
  children,
  className,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  return (
    <Component data-reveal-group="" className={className}>
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  return (
    <Component data-reveal-item="" className={className}>
      {children}
    </Component>
  );
}
