import Image from "next/image";
import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Styles() {
  const { styles } = getContent();

  return (
    <section id="styles" aria-labelledby="styles-title" className="py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <SectionHeading id="styles-title" eyebrow={styles.eyebrow} title={styles.title} description={styles.description} />

        <RevealGroup as="ul" className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {styles.items.map((style) => (
            <RevealItem as="li" key={style.name} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
                <Image
                  src={style.image.src}
                  alt={style.image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
                />
              </div>
              <h3 className="mt-6 font-serif text-3xl leading-tight">{style.name}</h3>
              <p className="mt-2 text-stone">{style.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
