import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Audiences() {
  const { audiences } = getContent();

  return (
    <section id="pour-qui" aria-labelledby="pour-qui-title" className="py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <SectionHeading id="pour-qui-title" eyebrow={audiences.eyebrow} title={audiences.title} />

        <RevealGroup as="ul" className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {audiences.items.map((audience, i) => (
            <RevealItem
              as="li"
              key={audience.title}
              className="flex flex-col rounded-2xl border border-line p-7 sm:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-full border border-line text-clay">
                  <Icon name={audience.icon} className="size-5" />
                </span>
                <span className="font-serif text-lg text-stone/70" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-10 font-serif text-2xl leading-tight">{audience.title}</h3>
              <p className="mt-3 leading-relaxed text-stone">{audience.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
