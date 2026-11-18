import Link from "next/link";
import { cn } from "@/lib/cn";

interface LogoProps {
  /** `light` : texte crème (sur la vidéo ou le footer). `dark` : texte encre. */
  variant?: "light" | "dark";
  className?: string;
  /** Rend un lien vers l'accueil (par défaut). */
  asLink?: boolean;
}

/** Logotype Stayphora : Instrument Serif, point final couleur argile. */
export function Logo({ variant = "dark", className, asLink = true }: LogoProps) {
  const mark = (
    <span
      className={cn(
        "font-serif text-[1.75rem] leading-none tracking-[-0.01em] transition-colors duration-300",
        variant === "light" ? "text-cream" : "text-ink",
        className,
      )}
    >
      Stayphora<span className="text-clay">.</span>
    </span>
  );

  if (!asLink) return mark;
  return (
    <Link href="/" aria-label="Stayphora, retour à l'accueil" className="inline-flex rounded-sm">
      {mark}
    </Link>
  );
}
