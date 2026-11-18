"use client";

import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ProjectImage } from "@/content";
import { cn } from "@/lib/cn";

interface BeforeAfterSliderProps {
  before: ProjectImage;
  after: ProjectImage;
  beforeLabel: string;
  afterLabel: string;
  /** Libellé accessible du curseur. */
  label: string;
  sizes: string;
  priority?: boolean;
  initial?: number;
  className?: string;
}

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/**
 * Comparateur avant / après sans dépendance.
 * - souris et tactile (Pointer Events, capture du pointeur)
 * - clavier : flèches (±2 %, ±10 % avec Maj), Début / Fin
 * - `role="slider"` avec `aria-valuenow`
 */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
  label,
  sizes,
  priority = false,
  initial = 50,
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) updateFromClientX(e.clientX);
  };

  const stopDragging = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    const moves: Record<string, number> = {
      ArrowLeft: position - step,
      ArrowDown: position - step,
      ArrowRight: position + step,
      ArrowUp: position + step,
      PageDown: position - 10,
      PageUp: position + 10,
      Home: 0,
      End: 100,
    };
    const next = moves[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setPosition(clamp(next));
  };

  const rounded = Math.round(position);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative isolate aspect-[16/10] cursor-ew-resize select-none overflow-hidden rounded-2xl bg-sand",
        // Laisse le défilement vertical natif sur mobile.
        "touch-pan-y",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      {/* Après : image de fond */}
      <Image src={after.src} alt={after.alt} fill sizes={sizes} priority={priority} draggable={false} className="object-cover" />

      {/* Avant : image découpée à gauche de la poignée */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }} aria-hidden={false}>
        <Image src={before.src} alt={before.alt} fill sizes={sizes} priority={priority} draggable={false} className="object-cover" />
      </div>

      {/* Étiquettes */}
      <span
        className={cn(
          "pointer-events-none absolute left-3 top-3 rounded-full bg-ink/55 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-cream backdrop-blur-sm transition-opacity duration-300 sm:left-4 sm:top-4",
          position < 12 && "opacity-0",
        )}
      >
        {beforeLabel}
      </span>
      <span
        className={cn(
          "pointer-events-none absolute right-3 top-3 rounded-full bg-cream/85 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink backdrop-blur-sm transition-opacity duration-300 sm:right-4 sm:top-4",
          position > 88 && "opacity-0",
        )}
      >
        {afterLabel}
      </span>

      {/* Poignée */}
      <div className="pointer-events-none absolute inset-y-0 z-10 -ml-px w-0.5 bg-cream/90" style={{ left: `${position}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={rounded}
          aria-valuetext={`${rounded} % ${beforeLabel.toLowerCase()}, ${100 - rounded} % ${afterLabel.toLowerCase()}`}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className={cn(
            "pointer-events-auto absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-cream text-ink shadow-[0_2px_20px_rgba(31,27,22,0.18)] transition-transform duration-300 ease-soft",
            dragging ? "scale-110" : "hover:scale-105",
          )}
        >
          <ChevronsLeftRight className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
