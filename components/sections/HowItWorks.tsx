import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function HowItWorks() {
  const { howItWorks } = getContent();

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
      </Container>
    </section>
  );
}
