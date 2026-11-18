"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * Vidéo d'arrière-plan du hero.
 * Montée uniquement côté client, après vérification des préférences :
 * rien n'est téléchargé si l'utilisateur préfère moins d'animations ou
 * économise ses données. Le poster (next/image, rendu par le serveur)
 * reste l'élément LCP ; la vidéo apparaît en fondu par-dessus.
 */
export function HeroVideo({ webm, mp4 }: { webm: string; mp4: string }) {
  const [allowed, setAllowed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const slow = connection?.saveData === true || /(^|-)2g$/.test(connection?.effectiveType ?? "");
    setAllowed(!reduced && !slow);
  }, []);

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
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
