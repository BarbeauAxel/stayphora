"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const SCROLL_THRESHOLD = 80;

/**
 * En-tête fixe : transparent (texte blanc) au-dessus du hero de l'accueil,
 * puis fond crème translucide après 80 px de défilement.
 */
export function Header({ site }: { site: SiteContent }) {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mobile : verrouille le défilement, ferme avec Échap, gère le focus.
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
      // Piège à focus simple dans le panneau + bouton de fermeture.
      if (e.key === "Tab" && panelRef.current && toggleRef.current) {
        const focusables = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a")];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const solid = scrolled || !overHero;
  const light = !solid && !menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500 ease-soft",
        solid && !menuOpen ? "border-b border-line bg-cream/80 backdrop-blur-md" : "border-b border-transparent",
        light ? "text-white" : "text-ink",
      )}
    >
      <Container size="wide" className="flex h-18 items-center justify-between gap-6 sm:h-20">
        <div className="relative z-10">
          <Logo variant={light ? "light" : "dark"} />
        </div>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative text-sm transition-colors duration-300",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-soft hover:after:scale-x-100",
                    light ? "text-white/85 hover:text-white" : "text-ink/75 hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          <div className="hidden sm:block">
            <ButtonLink href="/#devis">{site.ctaLabel}</ButtonLink>
          </div>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? site.menuClose : site.menuOpen}
            className="-mr-2 flex size-11 items-center justify-center rounded-full lg:hidden"
          >
            {menuOpen ? <X className="size-6" strokeWidth={1.25} /> : <Menu className="size-6" strokeWidth={1.25} />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            id="menu-mobile"
            ref={panelRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="paper-grain fixed inset-0 h-svh bg-cream pt-24 lg:hidden"
          >
            <Container className="flex h-full flex-col justify-between pb-10">
              <nav aria-label="Navigation mobile">
                <ul className="space-y-1">
                  {site.nav.map((item, i) => (
                    <m.li
                      key={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 * i + 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 font-serif text-[2.6rem] leading-tight text-ink transition-colors hover:text-clay-deep"
                      >
                        {item.label}
                      </Link>
                    </m.li>
                  ))}
                </ul>
              </nav>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <ButtonLink href="/#devis" size="lg" className="w-full" onClick={() => setMenuOpen(false)}>
                  {site.ctaLabel}
                </ButtonLink>
                <a href={`mailto:${site.email}`} className="block text-center text-sm text-stone">
                  {site.email}
                </a>
              </m.div>
            </Container>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
