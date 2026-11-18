"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Play, Video, X } from "lucide-react";
import type { Tour, TourUiContent } from "@/content/types";
import { cn } from "@/lib/cn";
import { TourLoading } from "./TourLoading";

/**
 * Lecteur de visite 3D, léger : couverture + bouton « Explorer le logement ».
 * Le viewer (three.js + Spark, ~1 Mo compressé) n'est téléchargé qu'au clic,
 * et jamais rendu côté serveur : il n'entre ni dans le chargement initial
 * de la page, ni dans le bundle du Worker.
 */
const loadViewer = () => import("./TourViewer");
const TourViewer = dynamic(loadViewer, { ssr: false, loading: () => null });

type Mode = "cover" | "viewer" | "video";

export interface TourPlayerProps {
  tour: Tour;
  ui: TourUiContent;
  /** Classes du cadre (ratio, coins arrondis…). */
  className?: string;
  /** Lance la visite sans attendre de clic (page plein écran, changement de scène). */
  autoStart?: boolean;
  /** Image de couverture prioritaire (au-dessus de la ligne de flottaison). */
  priority?: boolean;
  sizes?: string;
  debug?: boolean;
}

/** WebGL 2 est requis ; on écarte aussi les appareils à très faible mémoire. */
function canRun3D(): boolean {
  try {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (memory !== undefined && memory < 2) return false;
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

export function TourPlayer({
  tour,
  ui,
  className,
  autoStart = false,
  priority = false,
  sizes = "100vw",
  debug = false,
}: TourPlayerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("cover");
  const [unsupported, setUnsupported] = useState(false);

  // Démarrage automatique : mêmes vérifications qu'au clic (la couverture sert d'image LCP).
  useEffect(() => {
    if (autoStart) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- au montage uniquement
  }, []);

  function start() {
    if (!canRun3D()) {
      setUnsupported(true);
      setMode(tour.video ? "video" : "viewer");
      return;
    }
    setMode("viewer");
  }

  return (
    <div ref={frameRef} className={cn("tour-frame relative isolate overflow-hidden bg-ink text-cream", className)}>
      {mode === "cover" && (
        <>
          <Image
            src={tour.cover.src}
            alt={tour.cover.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/20 to-ink/10" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <button
              type="button"
              onClick={start}
              onPointerEnter={() => void loadViewer()}
              onFocus={() => void loadViewer()}
              className="group flex flex-col items-center gap-4 rounded-3xl p-2"
            >
              <span className="flex size-20 items-center justify-center rounded-full bg-cream/95 text-ink shadow-[0_8px_40px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-soft group-hover:scale-105 sm:size-24">
                <Play className="ml-1 size-8 fill-current" strokeWidth={1.25} aria-hidden="true" />
              </span>
              <span className="rounded-full bg-ink/55 px-5 py-2.5 text-base font-medium backdrop-blur-md sm:text-lg">
                {ui.explore}
              </span>
            </button>
            <p className="text-sm text-cream/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">{ui.hint}</p>
          </div>
          {tour.video && (
            <button
              type="button"
              onClick={() => setMode("video")}
              className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-full bg-ink/55 px-3.5 py-2 text-xs text-cream/90 backdrop-blur-md transition-colors hover:bg-ink/75 sm:right-4 sm:bottom-4"
            >
              <Video className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
              {ui.videoAlternative}
            </button>
          )}
        </>
      )}

      {mode === "viewer" && (
        <>
          {/* Pendant le téléchargement du code du viewer : chargement indéterminé. */}
          <TourLoading cover={tour.cover} progress={null} ui={ui} />
          <TourViewer tour={tour} ui={ui} frameRef={frameRef} autoFocus={autoStart} debug={debug} />
        </>
      )}

      {mode === "video" && tour.video && (
        <div className="absolute inset-0">
          <video
            className="size-full object-cover"
            controls
            autoPlay
            muted
            loop
            playsInline
            poster={tour.cover.src}
            aria-label={`${ui.videoAlternative} : ${tour.title}`}
          >
            <source src={tour.video.webm} type="video/webm" />
            {tour.video.mp4 && <source src={tour.video.mp4} type="video/mp4" />}
          </video>
          {unsupported ? (
            <div className="absolute inset-x-3 top-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink/80 p-4 backdrop-blur-md sm:inset-x-4 sm:top-4">
              <div>
                <p className="font-medium">{ui.fallbackTitle}</p>
                <p className="mt-1 text-sm text-cream/75">{ui.fallbackText}</p>
              </div>
              <button
                type="button"
                onClick={() => setMode("viewer")}
                className="rounded-full border border-white/30 px-4 py-2 text-sm hover:bg-white/10"
              >
                {ui.fallbackTry}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setMode("cover")}
              aria-label={ui.closeVideo}
              className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-ink/60 backdrop-blur-md hover:bg-ink/80"
            >
              <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
