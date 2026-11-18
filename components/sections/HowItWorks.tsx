import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function HowItWorks() {
  const { howItWorks, guide } = getContent();

  return (
    <section
      id="comment-ca-marche"
      aria-labelledby="etapes-title"
      className="paper-grain bg-sand py-24 sm:py-32 lg:py-40"
    >
      <Container size="wide">
        <SectionHeading
          id="etapes-title"
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.title}
          description={howItWorks.description}
        />

        <RevealGroup
          as="ol"
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
        >
          {howItWorks.steps.map((step, i) => (
            <RevealItem as="li" key={step.title} className="flex flex-col bg-sand p-8 lg:p-10">
              <div className="flex items-start justify-between">
                <span className="font-serif text-6xl leading-none text-clay lg:text-7xl" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon name={step.icon} className="size-7 text-ink/70" />
              </div>
              <h3 className="mt-10 font-serif text-2xl leading-tight lg:mt-14">
                <span className="sr-only">Étape {i + 1} : </span>
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-stone">{step.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Mini-guide de tournage */}
        <Reveal className="mt-8">
          <Link
            href="/guide-tournage"
            className="group flex flex-col gap-4 rounded-2xl border border-line bg-cream p-6 transition-colors duration-300 hover:border-clay sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <div className="flex items-start gap-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sand text-clay">
                <BookOpen className="size-5" strokeWidth={1.25} aria-hidden="true" />
              </span>
              <div>
                <p className="font-serif text-2xl leading-tight">{guide.teaser.title}</p>
                <p className="mt-1 text-stone">{guide.teaser.text}</p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-clay-deep">
              {guide.teaser.cta}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
            </span>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
