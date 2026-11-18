"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Id de l'élément qui sert de titre (aria-labelledby). */
  labelledBy: string;
  closeLabel: string;
  children: ReactNode;
}

/**
 * Modale basée sur l'élément natif <dialog> : focus piégé, touche Échap,
 * restauration du focus et arrière-plan inerte sont gérés par le navigateur.
 */
export function Modal({ open, onClose, labelledBy, closeLabel, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => {
        // Clic sur le fond (en dehors du contenu) : fermeture.
        if (e.target === e.currentTarget) onClose();
      }}
      className="modal m-auto w-[min(72rem,calc(100%-2rem))] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
    >
      <div className="relative rounded-2xl bg-cream p-4 sm:p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute -top-3 -right-3 z-20 flex size-11 items-center justify-center rounded-full border border-line bg-cream text-ink transition-colors duration-300 hover:bg-ink hover:text-cream sm:-top-4 sm:-right-4"
        >
          <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
