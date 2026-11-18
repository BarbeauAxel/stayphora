"use client";

/**
 * Viewer 3D interactif. Ce module (et donc three.js + Spark) n'est chargé
 * qu'au clic sur « Explorer le logement », via TourPlayer.
 */
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CircleHelp, Glasses, Info, Maximize, Minimize, Pause, Play, RotateCcw, X } from "lucide-react";
import type { Tour, TourUiContent } from "@/content/types";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { TourEngine } from "./engine";
import { TourLoading } from "./TourLoading";
import { DragHint } from "./DragHint";

export interface TourViewerProps {
  tour: Tour;
  ui: TourUiContent;
  /** Élément à passer en plein écran (le cadre du player). */
  frameRef: React.RefObject<HTMLElement | null>;
  /** Donne le focus clavier à la visite dès qu'elle est prête (page plein écran). */
  autoFocus?: boolean;
  /** Affiche la position de la caméra (aide à la définition des pièces). */
  debug?: boolean;
}

type Status = { type: "loading"; progress: number | null } | { type: "ready" } | { type: "error" };

const GUIDED_STEP_MS = 7000;

export default function TourViewer({ tour, ui, frameRef, autoFocus = false, debug = false }: TourViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<TourEngine | null>(null);
  const [status, setStatus] = useState<Status>({ type: "loading", progress: 0 });
  const [attempt, setAttempt] = useState(0);
  const [activeRoom, setActiveRoom] = useState(0);
  const [guided, setGuided] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [pseudoFullscreen, setPseudoFullscreen] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [debugView, setDebugView] = useState("");
  const [vrAvailable, setVrAvailable] = useState(false);
  const [inVr, setInVr] = useState(false);
  const reducedMotion = useRef(false);
  const guidedRef = useRef(false);
  guidedRef.current = guided;
  const helpId = useId();

  // ── Création du moteur et chargement de la scène ──────────────────────
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    setCoarse(isCoarse);
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const start = tour.rooms[0];
    if (!start) return;
    let cancelled = false;
    const engine = new TourEngine({
      container: host,
      bounds: tour.bounds,
      start,
      onInteract: () => {
        setShowHint(false);
        setActiveRoom(-1);
        if (guidedRef.current) setGuided(false);
      },
    });
    engineRef.current = engine;
    engine.onXrChange = setInVr;
    void TourEngine.vrSupported().then((ok) => !cancelled && setVrAvailable(ok));

    const file = isCoarse && tour.sceneMobile ? tour.sceneMobile : tour.scene;
    setStatus({ type: "loading", progress: 0 });
    engine
      .load(assetUrl(file), (progress) => !cancelled && setStatus({ type: "loading", progress }))
      .then(() => {
        if (cancelled) return;
        setStatus({ type: "ready" });
        if (autoFocus) host.focus({ preventScroll: true });
      })
      .catch((error: unknown) => {
        console.error("[tour] chargement impossible", error);
        if (!cancelled) setStatus({ type: "error" });
      });

    return () => {
      cancelled = true;
      engine.dispose();
      engineRef.current = null;
    };
  }, [tour, attempt, autoFocus]);

  // Masque l'indice « glissez » après quelques secondes.
  useEffect(() => {
    if (status.type !== "ready" || !showHint) return;
    const t = window.setTimeout(() => setShowHint(false), 5000);
    return () => window.clearTimeout(t);
  }, [status.type, showHint]);

  // ── Pièces et visite guidée ───────────────────────────────────────────
  const goToRoom = useCallback(
    (index: number) => {
      const room = tour.rooms[index];
      if (!room || !engineRef.current) return;
      engineRef.current.goTo(room, reducedMotion.current);
      setActiveRoom(index);
      setShowHint(false);
    },
    [tour.rooms],
  );

  useEffect(() => {
    if (!guided || status.type !== "ready") return;
    let index = activeRoom < 0 ? 0 : (activeRoom + 1) % tour.rooms.length;
    goToRoom(index);
    // Mouvement réduit : coupes franches et rythme plus lent.
    const delay = reducedMotion.current ? GUIDED_STEP_MS * 1.5 : GUIDED_STEP_MS;
    const timer = window.setInterval(() => {
      index = (index + 1) % tour.rooms.length;
      goToRoom(index);
    }, delay);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- relance uniquement au changement de mode
  }, [guided, status.type]);

  // ── Plein écran (API native, sinon plein écran CSS pour iPhone) ───────
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [frameRef]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    frame.classList.toggle("tour-pseudo-fullscreen", pseudoFullscreen);
    document.documentElement.style.overflow = pseudoFullscreen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPseudoFullscreen(false);
    if (pseudoFullscreen) window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      frame.classList.remove("tour-pseudo-fullscreen");
      document.documentElement.style.overflow = "";
    };
  }, [pseudoFullscreen, frameRef]);

  const toggleFullscreen = async () => {
    const frame = frameRef.current;
    if (!frame) return;
    if (document.fullscreenElement) return void document.exitFullscreen();
    if (pseudoFullscreen) return setPseudoFullscreen(false);
    if (document.fullscreenEnabled && frame.requestFullscreen) {
      try {
        await frame.requestFullscreen({ navigationUI: "hide" });
        return;
      } catch {
        /* repli ci-dessous */
      }
    }
    setPseudoFullscreen(true);
  };
  const isFullscreen = fullscreen || pseudoFullscreen;

  // ── Mode debug : position courante de la caméra ───────────────────────
  useEffect(() => {
    if (!debug || status.type !== "ready") return;
    // Accès console : window.__tourEngine.goTo({ position: [...], target: [...] })
    (window as unknown as { __tourEngine?: TourEngine }).__tourEngine = engineRef.current ?? undefined;
    const t = window.setInterval(() => {
      const v = engineRef.current?.controls.getViewpoint();
      if (v) setDebugView(`{ label: "…", position: [${v.position.join(", ")}], target: [${v.target.join(", ")}] },`);
    }, 250);
    return () => window.clearInterval(t);
  }, [debug, status.type]);

  const ready = status.type === "ready";
  const glass =
    "border border-white/15 bg-ink/55 text-cream backdrop-blur-md transition-colors duration-300 hover:bg-ink/75";

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {/* Surface WebGL : reçoit les gestes et le clavier */}
      <div
        ref={hostRef}
        tabIndex={0}
        role="application"
        aria-roledescription={ui.viewerLabel}
        aria-label={`${ui.viewerLabel} : ${tour.title}`}
        aria-describedby={helpId}
        className="absolute inset-0 cursor-grab touch-none select-none outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-inset"
      />
      <p id={helpId} className="sr-only">
        {tour.description} {ui.keyboardHint} {ui.helpDesktop.map((h) => `${h.keys} : ${h.action}.`).join(" ")}
      </p>

      {status.type === "loading" && <TourLoading cover={tour.cover} progress={status.progress} ui={ui} />}

      {status.type === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/90 p-6 text-center text-cream">
          <p className="font-serif text-2xl">{ui.errorTitle}</p>
          <p className="text-sm text-cream/75">{ui.errorText}</p>
          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            className="mt-2 inline-flex h-11 items-center gap-2 rounded-full bg-clay-dark px-6 text-sm font-medium text-cream hover:bg-clay-deep"
          >
            <RotateCcw className="size-4" strokeWidth={1.5} aria-hidden="true" />
            {ui.retry}
          </button>
        </div>
      )}

      {ready && showHint && <DragHint label={ui.dragHint} />}

      {ready && (
        <>
          {/* Barre d'outils */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-end gap-2 p-3 sm:p-4">
            <button
              type="button"
              onClick={() => setGuided((g) => !g)}
              aria-pressed={guided}
              className={cn("pointer-events-auto flex h-10 items-center gap-2 rounded-full px-4 text-sm", glass)}
            >
              {guided ? (
                <Pause className="size-4" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Play className="size-4" strokeWidth={1.5} aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{guided ? ui.stopGuidedTour : ui.guidedTour}</span>
              <span className="sr-only sm:hidden">{guided ? ui.stopGuidedTour : ui.guidedTour}</span>
            </button>
            {vrAvailable && (
              <button
                type="button"
                onClick={() => (inVr ? engineRef.current?.exitVr() : void engineRef.current?.enterVr().catch(() => {}))}
                aria-label={inVr ? ui.exitVr : ui.enterVr}
                className={cn("pointer-events-auto flex h-10 items-center gap-2 rounded-full px-4 text-sm", glass)}
              >
                <Glasses className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
                <span className="hidden sm:inline">VR</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setHelpOpen((o) => !o)}
              aria-expanded={helpOpen}
              aria-label={ui.help}
              className={cn("pointer-events-auto flex size-10 items-center justify-center rounded-full", glass)}
            >
              <CircleHelp className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? ui.exitFullscreen : ui.fullscreen}
              className={cn("pointer-events-auto flex size-10 items-center justify-center rounded-full", glass)}
            >
              {isFullscreen ? (
                <Minimize className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Maximize className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Aide */}
          {helpOpen && (
            <div
              role="dialog"
              aria-label={ui.helpTitle}
              className="absolute top-16 right-3 z-10 w-[min(20rem,calc(100%-1.5rem))] rounded-2xl border border-white/15 bg-ink/85 p-5 text-cream backdrop-blur-md sm:right-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-serif text-xl">{ui.helpTitle}</p>
                <button
                  type="button"
                  onClick={() => setHelpOpen(false)}
                  aria-label={ui.closeHelp}
                  className="-mr-2 flex size-9 items-center justify-center rounded-full hover:bg-white/10"
                >
                  <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                {(coarse ? ui.helpMobile : ui.helpDesktop).map((h) => (
                  <div key={h.keys} className="flex justify-between gap-4 border-t border-white/10 pt-2">
                    <dt className="font-medium text-cream">{h.keys}</dt>
                    <dd className="text-right text-cream/75">{h.action}</dd>
                  </div>
                ))}
              </dl>
              {!coarse && <p className="mt-4 text-xs text-cream/60">{ui.keyboardHint}</p>}
            </div>
          )}

          {/* Pièces */}
          <nav aria-label={ui.rooms} className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
            <ul className="pointer-events-auto mx-auto flex w-fit max-w-full gap-1.5 overflow-x-auto rounded-full border border-white/15 bg-ink/55 p-1.5 backdrop-blur-md [scrollbar-width:none]">
              {tour.rooms.map((room, i) => (
                <li key={room.label} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setGuided(false);
                      goToRoom(i);
                    }}
                    aria-current={activeRoom === i ? "location" : undefined}
                    className={cn(
                      "h-9 rounded-full px-4 text-sm whitespace-nowrap transition-colors duration-300",
                      activeRoom === i ? "bg-cream text-ink" : "text-cream/85 hover:bg-white/10 hover:text-cream",
                    )}
                  >
                    {room.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Crédit de la scène */}
          {tour.credit && (
            <div className="absolute bottom-16 left-3 sm:bottom-4 sm:left-4">
              <button
                type="button"
                onClick={() => setCreditOpen((o) => !o)}
                aria-expanded={creditOpen}
                aria-label={ui.credit}
                className={cn("flex size-8 items-center justify-center rounded-full", glass)}
              >
                <Info className="size-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
              {creditOpen && (
                <p className="absolute bottom-10 left-0 w-[min(22rem,80vw)] rounded-xl border border-white/15 bg-ink/85 p-3 text-xs leading-relaxed text-cream/85 backdrop-blur-md">
                  {tour.credit.text}{" "}
                  <a href={tour.credit.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    Source
                  </a>
                  {tour.credit.licenseHref && (
                    <>
                      {" · "}
                      <a href={tour.credit.licenseHref} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                        Licence
                      </a>
                    </>
                  )}
                </p>
              )}
            </div>
          )}

          {debug && (
            <output className="absolute bottom-20 left-1/2 max-w-[90%] -translate-x-1/2 rounded-lg bg-black/70 px-3 py-2 font-mono text-[11px] text-white select-all">
              {debugView}
            </output>
          )}
        </>
      )}

      {/* Annonce discrète pour les lecteurs d'écran */}
      <p className="sr-only" aria-live="polite">
        {ready ? ui.ready : ""}
      </p>
    </div>
  );
}
