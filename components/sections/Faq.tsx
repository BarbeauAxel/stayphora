import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";

export function Faq() {
  const { faq, site } = getContent();

  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-line py-24 sm:py-32 lg:py-40">
      <Container size="wide" className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading id="faq-title" eyebrow={faq.eyebrow} title={faq.title} />
            <Reveal className="mt-8 text-stone">
              <p>
                Une autre question ?{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-clay-deep underline decoration-clay/40 underline-offset-4 transition-colors hover:decoration-clay-deep"
                >
                  {site.email}
                </a>
              </p>
            </Reveal>
          </div>
        </div>
        <Reveal className="lg:col-span-7">
          <Accordion items={faq.items} />
        </Reveal>
      </Container>
    </section>
  );
}
