import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

export function Reassurance() {
  const { reassurance } = getContent();

  return (
    <section id="reassurance" aria-label="Nos engagements" className="border-b border-line bg-cream">
      <Container size="wide">
        <RevealGroup as="ul" className="grid grid-cols-2 lg:grid-cols-4">
          {reassurance.map((item, i) => (
            <RevealItem
              as="li"
              key={item.label}
              className={cn(
                "flex flex-col items-center gap-3 border-line px-3 py-8 text-center sm:flex-row sm:justify-center sm:gap-4 sm:py-10",
                // Séparateurs fins : grille 2×2 sur mobile, ligne de 4 sur desktop.
                i % 2 === 0 && "border-r",
                i < 2 && "border-b lg:border-b-0",
                i === 1 && "lg:border-r",
              )}
            >
              <Icon name={item.icon} className="size-6 shrink-0 text-clay" />
              <span className="text-sm font-medium text-ink sm:text-[0.95rem]">{item.label}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
