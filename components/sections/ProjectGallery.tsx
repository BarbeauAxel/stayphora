"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { Project, ProjectsContent } from "@/content/types";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Modal } from "@/components/ui/Modal";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

type Labels = Pick<ProjectsContent, "beforeLabel" | "afterLabel" | "sliderLabel" | "openLabel" | "closeLabel">;

const meta = (p: Project) => `${p.title} · ${p.location} · ${p.style}`;

/** Grille de projets ; un clic ouvre le comparateur dans une modale. */
export function ProjectGallery({ items, labels }: { items: Project[]; labels: Labels }) {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <>
      <RevealGroup as="ul" className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
        {items.map((project) => (
          <RevealItem as="li" key={project.slug}>
            <button
              type="button"
              onClick={() => setActive(project)}
              className="group block w-full rounded-2xl text-left"
              aria-haspopup="dialog"
            >
              <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
                <Image
                  src={project.after.src}
                  alt={project.after.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
                />
                <span className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-cream/90 px-4 py-2 text-xs font-medium text-ink backdrop-blur-sm transition-opacity duration-500 ease-soft lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
                  {labels.openLabel}
                  <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                </span>
              </span>
              <span className="mt-5 block font-serif text-2xl leading-tight">
                {project.title} <span className="text-stone">· {project.location}</span>
              </span>
              <span className="label-eyebrow mt-2 block text-clay-deep">{project.style}</span>
            </button>
          </RevealItem>
        ))}
      </RevealGroup>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        labelledBy="projet-modal-title"
        closeLabel={labels.closeLabel}
      >
        {active && (
          <>
            <BeforeAfterSlider
              key={active.slug}
              before={active.before}
              after={active.after}
              beforeLabel={labels.beforeLabel}
              afterLabel={labels.afterLabel}
              label={`${labels.sliderLabel} : ${meta(active)}`}
              sizes="(min-width: 1200px) 1100px, 100vw"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-1 pt-5 pb-1">
              <h3 id="projet-modal-title" className="font-serif text-2xl sm:text-3xl">
                {active.title} <span className="text-stone">· {active.location}</span>
              </h3>
              <p className="label-eyebrow text-clay-deep">{active.style}</p>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
