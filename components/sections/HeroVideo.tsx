"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * Vidéo d'arrière-plan du hero.
 * Montée uniquement côté client, après le chargement de la page et vérification des préférences :
 * rien n'est téléchargé si l'utilisateur préfère moins d'animations ou
 * économise ses données. Le poster (next/image, rendu par le serveur)
 * reste l'élément LCP ; la vidéo apparaît en fondu par-dessus.
 */
interface Sources {
  webm: string;
  mp4?: string;
}

export function HeroVideo({ webm, mp4, mobile }: Sources & { mobile?: Sources }) {
  const [allowed, setAllowed] = useState(false);
  const [sources, setSources] = useState<Sources>({ webm, mp4 });
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const slow = connection?.saveData === true || /(^|-)2g$/.test(connection?.effectiveType ?? "");
    if (reduced || slow) return;
    // Écrans étroits : vidéo portrait légère.
    if (mobile && window.matchMedia("(max-width: 767px)").matches) setSources(mobile);

    // La vidéo ne démarre qu'une fois la page chargée et le navigateur au repos :
    // elle ne concurrence jamais les ressources critiques (poster, polices, JS).
    let idle = 0;
    let timer = 0;
    const start = () => {
      idle = window.requestIdleCallback?.(() => setAllowed(true), { timeout: 2500 }) ?? 0;
      if (!window.requestIdleCallback) timer = window.setTimeout(() => setAllowed(true), 1200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle) window.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
    };
  }, [mobile]);

  if (!allowed) return null;

  return (
    <video
      className={cn(
        "absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-out",
        playing ? "opacity-100" : "opacity-0",
      )}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
    >
      <source src={sources.webm} type="video/webm" />
      {sources.mp4 && <source src={sources.mp4} type="video/mp4" />}
    </video>
  );
}
