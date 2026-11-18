import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,color,border-color,transform] duration-300 ease-soft active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Plein argile, texte crème (contraste AA).
  primary: "bg-clay-dark text-cream hover:bg-clay-deep",
  // Contour encre.
  secondary: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream",
  // Contour blanc (sur la vidéo).
  light: "border border-white/60 text-white hover:border-white hover:bg-white hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-[0.95rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function buttonClasses({ variant = "primary", size = "md", className }: Omit<CommonProps, "children"> = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return <button className={buttonClasses({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  href,
  ...props
}: CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href">) {
  return <Link href={href} className={buttonClasses({ variant, size, className })} {...props} />;
}
