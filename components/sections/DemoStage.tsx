"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Expand } from "lucide-react";
import type { Tour, TourUiContent } from "@/content/types";
import { TourPlayer } from "@/components/tour/TourPlayer";
import { cn } from "@/lib/cn";

/** Grand viewer de démo + vignettes pour changer de scène. */
export function DemoStage({
  tours,
  ui,
  moreLabel,
  fullscreenLabel,
}: {
  tours: Tour[];
  ui: TourUiContent;
  moreLabel: string;
  fullscreenLabel: string;
}) {
  const [index, setIndex] = useState(0);
  // Une fois la visite lancée, changer de scène la charge directement.
  const [engaged, setEngaged] = useState(false);
  const tour = tours[index];
  if (!tour) return null;

  return (
    <div>
      <div
        onClickCapture={() => setEngaged(true)}
        className="rounded-3xl shadow-[0_40px_120px_-40px_rgba(31,27,22,0.45)]"
      >
        <TourPlayer
          key={tour.slug}
          tour={tour}
          ui={ui}
          autoStart={engaged}
          sizes="(min-width: 1440px) 1340px, 100vw"
          className="aspect-[4/5] w-full rounded-3xl sm:aspect-video"
        />
      </div>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-stone">{moreLabel}</p>
          <ul className="flex gap-3">
            {tours.map((t, i) => (
              <li key={t.slug}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={i === index}
                  aria-label={`${t.title} · ${t.kind}`}
                  className={cn(
                    "group relative block h-14 w-20 overflow-hidden rounded-xl border-2 transition-[border-color,opacity] duration-300 sm:h-16 sm:w-24",
                    i === index ? "border-clay" : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <Image src={t.cover.src} alt="" fill sizes="96px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <p className="text-stone">
            <span className="font-medium text-ink">{tour.title}</span> · {tour.location}
          </p>
          <Link
            href={`/demo/${tour.slug}`}
            className="inline-flex items-center gap-2 text-clay-deep underline decoration-clay/40 underline-offset-4 transition-colors hover:decoration-clay-deep"
          >
            <Expand className="size-4" strokeWidth={1.5} aria-hidden="true" />
            {fullscreenLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
