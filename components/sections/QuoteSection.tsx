import { Check } from "lucide-react";
import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import { QuoteForm } from "./QuoteForm";

/** CTA final + formulaire de demande de devis (ancre #devis). */
export function QuoteSection() {
  const { form, site } = getContent();

  return (
    <section id="devis" aria-labelledby="devis-title" className="paper-grain bg-sand py-24 sm:py-32 lg:py-40">
      <Container size="wide" className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="label-eyebrow text-clay-deep">{site.ctaLabel}</p>
            <h2 id="devis-title" className="mt-5 font-serif text-5xl leading-[1.05] tracking-[-0.01em] text-balance sm:text-6xl lg:text-7xl">
              <RichText text={form.title} />
            </h2>
            <ul className="mt-10 space-y-4">
              {form.reassurance.map((item) => (
                <li key={item} className="flex items-start gap-4 text-ink">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-clay text-clay">
                    <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm text-stone">
              Ou écrivez-nous :{" "}
              <a href={`mailto:${site.email}`} className="text-clay-deep underline underline-offset-4">
                {site.email}
              </a>
            </p>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <QuoteForm content={form} />
        </Reveal>
      </Container>
    </section>
  );
}
