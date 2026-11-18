"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

/** API globale exposée par le script Turnstile. */
interface TurnstileApi {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile indisponible"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export interface TurnstileHandle {
  reset: () => void;
}

interface TurnstileProps {
  siteKey: string;
  onToken: (token: string | null) => void;
  ref?: Ref<TurnstileHandle>;
  className?: string;
}

/**
 * Widget Cloudflare Turnstile, en mode discret (`interaction-only` : visible
 * seulement si une interaction est nécessaire) et thème clair.
 * Le script n'est chargé qu'à l'approche du formulaire (performance).
 */
export function Turnstile({ siteKey, onToken, ref, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
      onTokenRef.current(null);
    },
  }));

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !siteKey) return;
    let cancelled = false;

    const render = () => {
      loadScript()
        .then(() => {
          if (cancelled || !window.turnstile || widgetId.current) return;
          widgetId.current = window.turnstile.render(el, {
            sitekey: siteKey,
            theme: "light",
            appearance: "interaction-only",
            size: "flexible",
            language: "fr",
            "refresh-expired": "auto",
            callback: (token: string) => onTokenRef.current(token),
            "expired-callback": () => onTokenRef.current(null),
            "error-callback": () => onTokenRef.current(null),
          });
        })
        .catch(() => onTokenRef.current(null));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          render();
        }
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  return <div ref={containerRef} className={className} />;
}
