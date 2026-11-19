import { Info } from "lucide-react";
import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** « Où partager votre visite ? » : section courte et visuelle. */
export function Share() {
  const { share, site } = getContent();

  return (
    <section id="partager" aria-labelledby="partager-title" className="paper-grain bg-sand py-24 sm:py-32">
      <Container size="wide" className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading id="partager-title" eyebrow={share.eyebrow} title={share.title} />
          {/* Exemple de code d'intégration : rend concret « une ligne de code ». */}
          <Reveal className="mt-10 hidden lg:block">
            <pre className="overflow-x-auto rounded-2xl bg-ink p-5 font-mono text-[12px] leading-relaxed text-cream/85">
              <code>
                <span className="text-clay">{"<iframe"}</span>
                {` src="${site.toursUrl}/votre-logement"\n  width="100%" height="560"\n  allow="fullscreen; xr-spatial-tracking"`}
                <span className="text-clay">{"></iframe>"}</span>
              </code>
            </pre>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2">
            {share.items.map((item) => (
              <RevealItem
                as="li"
                key={item.title}
                className="flex gap-5 rounded-2xl border border-line bg-cream p-6 last:sm:col-span-2"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sand text-clay">
                  <Icon name={item.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="font-serif text-xl leading-snug">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone">{item.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-6">
            <p className="flex gap-3 text-sm leading-relaxed text-stone">
              <Info className="mt-0.5 size-4 shrink-0 text-clay" strokeWidth={1.5} aria-hidden="true" />
              {share.note}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
