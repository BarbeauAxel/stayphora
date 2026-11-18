import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { DemoStage } from "./DemoStage";

/** Section « Démo » : la visite 3D interactive, cœur du site. */
export function DemoSection() {
  const { demo, tours, tourUi } = getContent();
  const { compare } = demo;

  return (
    <section id="demo" aria-labelledby="demo-title" className="py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <SectionHeading id="demo-title" eyebrow={demo.eyebrow} title={demo.title} description={demo.description} />

        <Reveal className="mt-12 sm:mt-16">
          <DemoStage tours={tours} ui={tourUi} moreLabel={demo.moreDemos} fullscreenLabel={demo.openFullscreen} />
        </Reveal>

        {/* Avant / après : de la prise de vue à la visite */}
        <Reveal className="mt-20 sm:mt-28">
          <h3 className="label-eyebrow text-clay-deep">{compare.title}</h3>
          <div className="mt-6 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
            {[compare.filmed, compare.explored].map((item, i) => (
              <figure key={item.label} className={i === 1 ? "sm:order-3" : undefined}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-cream/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur-sm">
                    {item.label}
                  </span>
                </div>
                <figcaption className="mt-3 text-sm text-stone">{item.caption}</figcaption>
              </figure>
            ))}
            <div className="flex justify-center sm:order-2" aria-hidden="true">
              <span className="flex size-12 items-center justify-center rounded-full border border-line text-clay">
                <ArrowRight className="size-5 rotate-90 sm:rotate-0" strokeWidth={1.25} />
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
