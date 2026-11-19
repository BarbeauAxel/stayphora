"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { DemoPageContent, Tour, TourUiContent } from "@/content/types";
import { TourPlayer } from "@/components/tour/TourPlayer";
import { Logo } from "@/components/ui/Logo";
import { siteHref } from "@/lib/tour-links";

/** Visite plein écran : sert aussi de modèle pour les visites livrées aux clients. */
export function DemoTour({
  tour,
  ui,
  labels,
  siteUrl,
}: {
  tour: Tour;
  ui: TourUiContent;
  labels: DemoPageContent;
  siteUrl: string;
}) {
  // `?debug` : affiche la position de la caméra pour définir les points de vue.
  const [debug, setDebug] = useState(false);
  useEffect(() => setDebug(new URLSearchParams(window.location.search).has("debug")), []);

  return (
    <>
      <TourPlayer tour={tour} ui={ui} autoStart priority debug={debug} className="h-full w-full" />

      {/* Habillage discret, au-dessus de la visite */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 flex flex-col items-start gap-2 p-3 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/15 bg-ink/55 py-1 pr-4 pl-1 backdrop-blur-md">
          <Link
            href={siteHref("/", siteUrl)}
            aria-label={labels.back}
            className="flex size-9 items-center justify-center rounded-full text-cream hover:bg-white/10"
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </Link>
          <Logo variant="light" asLink={false} className="text-xl" />
        </div>
        <Link
          href={siteHref("/#devis", siteUrl)}
          className="pointer-events-auto rounded-full bg-clay-dark px-4 py-2.5 text-xs font-medium text-cream transition-colors hover:bg-clay-deep sm:text-sm"
        >
          {labels.cta}
        </Link>
      </div>
    </>
  );
}
