import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RichText, plainText } from "@/components/ui/RichText";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

const { guide } = getContent();

export const metadata: Metadata = {
  title: plainText(guide.title),
  description: guide.metaDescription,
  alternates: { canonical: "/guide-tournage" },
};

export default function GuideTournagePage() {
  return (
    <>
      <header className="paper-grain bg-sand pt-36 pb-20 sm:pt-44 sm:pb-28">
        <Container size="wide">
          <p className="label-eyebrow animate-fade-up text-clay-deep">{guide.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl animate-fade-up font-serif text-5xl leading-[1.05] tracking-[-0.01em] text-balance [animation-delay:100ms] sm:text-6xl lg:text-7xl">
            <RichText text={guide.title} />
          </h1>
          <p className="mt-7 max-w-2xl animate-fade-up text-lg leading-relaxed text-stone [animation-delay:200ms]">
            {guide.description}
          </p>
        </Container>
      </header>

      {/* Étapes */}
      <section aria-labelledby="etapes" className="py-20 sm:py-28">
        <Container size="wide">
          <h2 id="etapes" className="sr-only">
            Étapes
          </h2>
          <RevealGroup as="ol" className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {guide.steps.map((step, i) => (
              <RevealItem as="li" key={step.title} className="flex flex-col bg-cream p-8 lg:p-10">
                <div className="flex items-start justify-between">
                  <span className="font-serif text-6xl leading-none text-clay" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon name={step.icon} className="size-7 text-ink/70" />
                </div>
                <h3 className="mt-10 font-serif text-2xl leading-tight">
                  <span className="sr-only">Étape {i + 1} : </span>
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-stone">{step.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Bonnes pratiques / erreurs / checklist */}
      <section aria-label="Bonnes pratiques" className="border-t border-line py-20 sm:py-28">
        <Container size="wide" className="grid gap-6 lg:grid-cols-3">
          {[
            { block: guide.dos, icon: <Check className="size-4" strokeWidth={2} aria-hidden="true" />, tone: "text-clay" },
            { block: guide.donts, icon: <X className="size-4" strokeWidth={2} aria-hidden="true" />, tone: "text-error" },
            { block: guide.checklist, icon: <Check className="size-4" strokeWidth={2} aria-hidden="true" />, tone: "text-stone" },
          ].map(({ block, icon, tone }) => (
            <Reveal key={block.title} className="rounded-2xl border border-line p-8">
              <h2 className="font-serif text-3xl leading-tight">{block.title}</h2>
              <ul className="mt-6 space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 leading-snug">
                    <span className={`mt-0.5 shrink-0 ${tone}`}>{icon}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Appel à l'action */}
      <section className="pb-24 sm:pb-32">
        <Container size="wide">
          <Reveal className="flex flex-col items-start gap-6 rounded-3xl bg-ink p-10 text-cream sm:p-14 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{guide.cta.title}</h2>
              <p className="mt-3 max-w-xl text-cream/75">{guide.cta.text}</p>
            </div>
            <ButtonLink href="/#devis" size="lg" className="shrink-0">
              {guide.cta.button}
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
