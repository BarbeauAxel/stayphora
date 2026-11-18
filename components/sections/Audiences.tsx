import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Audiences() {
  const { audiences } = getContent();

  return (
    <section id="pour-qui" aria-labelledby="pour-qui-title" className="border-t border-line py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <SectionHeading id="pour-qui-title" eyebrow={audiences.eyebrow} title={audiences.title} />

        <RevealGroup as="ul" className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-line">
          {audiences.items.map((audience) => (
            <RevealItem as="li" key={audience.title} className="max-lg:max-w-xl lg:px-12 lg:first:pl-0 lg:last:pr-0">
              <span className="flex size-14 items-center justify-center rounded-full border border-line text-clay">
                <Icon name={audience.icon} className="size-6" />
              </span>
              <h3 className="mt-8 font-serif text-3xl leading-tight">{audience.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-stone">{audience.benefit}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
