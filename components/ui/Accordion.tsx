"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export interface AccordionItem {
  question: string;
  answer: string;
  link?: { label: string; href: string };
}

/** Accordéon accessible : `button` + `aria-expanded` + `aria-controls`. */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div key={item.question} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left sm:py-7"
              >
                <span className="font-serif text-xl leading-snug text-ink transition-colors duration-300 group-hover:text-clay-deep sm:text-2xl">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-clay-deep transition-[transform,background-color,border-color] duration-500 ease-soft",
                    isOpen && "rotate-45 border-clay bg-clay text-cream",
                  )}
                  aria-hidden="true"
                >
                  <Plus className="size-4" strokeWidth={1.5} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="max-w-2xl pr-12 pb-7">
                    <p className="leading-relaxed text-stone">{item.answer}</p>
                    {item.link && (
                      <Link
                        href={item.link.href}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-clay-deep underline decoration-clay/40 underline-offset-4 hover:decoration-clay-deep"
                      >
                        {item.link.label}
                        <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
