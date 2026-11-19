"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Box, Expand } from "lucide-react";
import type { ProjectsContent, Tour, TourUiContent } from "@/content/types";
import { TourPlayer } from "@/components/tour/TourPlayer";
import { Modal } from "@/components/ui/Modal";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { tourHref } from "@/lib/tour-links";

function meta(t: Tour) {
  return [t.kind, t.location, t.area ? `${t.area} m²` : null].filter(Boolean).join(" · ");
}

/** Cartes de visites ; un clic ouvre la visite 3D dans une modale. */
export function TourGallery({ tours, ui, labels }: { tours: Tour[]; ui: TourUiContent; labels: ProjectsContent }) {
  const [active, setActive] = useState<Tour | null>(null);

  return (
    <>
      <RevealGroup as="ul" className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
        {tours.map((tour) => (
          <RevealItem as="li" key={tour.slug}>
            <button
              type="button"
              onClick={() => setActive(tour)}
              className="group block w-full rounded-2xl text-left"
              aria-haspopup="dialog"
            >
              <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
                <Image
                  src={tour.cover.src}
                  alt={tour.cover.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1.5 text-xs font-medium text-cream backdrop-blur-sm">
                  <Box className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                  3D
                </span>
                <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-cream/90 px-4 py-2 text-xs font-medium text-ink backdrop-blur-sm transition-opacity duration-500 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
                  {labels.openLabel}
                  <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                </span>
              </span>
              <span className="mt-5 block font-serif text-2xl leading-tight">{tour.title}</span>
              <span className="mt-1.5 block text-sm text-stone">{meta(tour)}</span>
            </button>
          </RevealItem>
        ))}
        <RevealItem as="li">
          <div className="flex aspect-[4/3] flex-col items-start justify-end rounded-2xl border border-dashed border-stone/35 bg-sand/50 p-8">
            <p className="font-serif text-3xl leading-tight text-balance">
              <RichText text={labels.cta.title} />
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone">{labels.cta.text}</p>
            <ButtonLink href="#devis" className="mt-6">
              {labels.cta.button}
            </ButtonLink>
          </div>
        </RevealItem>
      </RevealGroup>

      <Modal open={active !== null} onClose={() => setActive(null)} labelledBy="visite-modal-title" closeLabel={labels.closeLabel}>
        {active && (
          <>
            <TourPlayer
              key={active.slug}
              tour={active}
              ui={ui}
              autoStart
              sizes="(min-width: 1200px) 1100px, 100vw"
              className="aspect-[4/5] w-full rounded-xl sm:aspect-video"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-1 pt-5 pb-1">
              <div>
                <h3 id="visite-modal-title" className="font-serif text-2xl sm:text-3xl">
                  {active.title}
                </h3>
                <p className="mt-1 text-sm text-stone">{meta(active)}</p>
              </div>
              <Link
                href={tourHref(active.slug)}
                className="inline-flex items-center gap-2 text-sm text-clay-deep underline decoration-clay/40 underline-offset-4"
              >
                <Expand className="size-4" strokeWidth={1.5} aria-hidden="true" />
                {labels.fullscreenLabel}
              </Link>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
