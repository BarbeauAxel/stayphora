import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** Masquée tant que `testimonials.enabled` vaut `false` dans /content. */
export function Testimonials() {
  const { testimonials } = getContent();
  if (!testimonials.enabled || testimonials.items.length === 0) return null;

  return (
    <section id="temoignages" aria-labelledby="temoignages-title" className="py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <SectionHeading id="temoignages-title" eyebrow={testimonials.eyebrow} title={testimonials.title} />

        <RevealGroup as="ul" className="mt-16 grid gap-6 md:grid-cols-3 lg:mt-20">
          {testimonials.items.map((t) => (
            <RevealItem as="li" key={t.quote}>
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-line p-8 sm:p-10">
                <span className="font-serif text-6xl leading-none text-clay" aria-hidden="true">
                  “
                </span>
                <blockquote className="mt-2 flex-1 font-serif text-2xl leading-snug italic text-ink">
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption className="mt-10 border-t border-line pt-6">
                  <p className="font-medium">{t.name}</p>
                  <p className="mt-1 text-sm text-stone">
                    {t.role} · {t.city}
                  </p>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
