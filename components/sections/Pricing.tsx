import { Check } from "lucide-react";
import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

export function Pricing() {
  const { pricing } = getContent();

  return (
    <section id="tarifs" aria-labelledby="tarifs-title" className="paper-grain bg-sand py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <SectionHeading
          id="tarifs-title"
          align="center"
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          description={pricing.description}
        />

        <RevealGroup as="ul" className="mx-auto mt-16 grid max-w-xl gap-6 lg:mt-20 lg:max-w-6xl lg:grid-cols-3 lg:items-stretch">
          {pricing.plans.map((plan) => (
            <RevealItem
              as="li"
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-cream p-8 sm:p-10",
                plan.highlighted ? "border-clay lg:-my-4 lg:py-14" : "border-line",
              )}
            >
              {plan.badge && (
                <p className="absolute -top-3.5 left-8 rounded-full bg-clay-dark px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-cream sm:left-10">
                  {plan.badge}
                </p>
              )}
              <h3 className="font-serif text-3xl leading-tight">{plan.name}</h3>
              <p className="mt-3 min-h-12 text-sm leading-relaxed text-stone">{plan.description}</p>

              <p className="mt-8 flex items-baseline gap-2 border-b border-line pb-8">
                <span className="font-serif text-5xl leading-none tracking-tight">{plan.price}</span>
                {plan.unit && <span className="text-sm text-stone">{plan.unit}</span>}
              </p>

              <ul className="mt-8 flex-1 space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-[0.95rem] leading-snug">
                    <Check className="mt-0.5 size-4 shrink-0 text-clay" strokeWidth={1.75} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="#devis"
                variant={plan.highlighted ? "primary" : "secondary"}
                className="mt-10 w-full"
                aria-label={`${plan.cta} : ${plan.name}`}
              >
                {plan.cta}
              </ButtonLink>
            </RevealItem>
          ))}
        </RevealGroup>

        {pricing.note && <p className="mt-12 text-center text-sm text-stone">{pricing.note}</p>}
      </Container>
    </section>
  );
}
