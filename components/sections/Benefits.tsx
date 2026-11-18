import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** « Pourquoi une visite 3D ? » : 4 bénéfices. */
export function Benefits() {
  const { benefits } = getContent();

  return (
    <section id="pourquoi" aria-labelledby="pourquoi-title" className="py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <SectionHeading id="pourquoi-title" eyebrow={benefits.eyebrow} title={benefits.title} description={benefits.description} />

        <RevealGroup as="ul" className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {benefits.items.map((item) => (
            <RevealItem as="li" key={item.title} className="border-t border-line pt-8">
              <Icon name={item.icon} className="size-7 text-clay" />
              <h3 className="mt-6 font-serif text-2xl leading-tight">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-stone">{item.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
