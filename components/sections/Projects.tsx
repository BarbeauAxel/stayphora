import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TourGallery } from "./TourGallery";

/** Réalisations : grille de visites, ouvertes dans une modale plein écran. */
export function Projects() {
  const { projects, tours, tourUi } = getContent();

  return (
    <section id="realisations" aria-labelledby="realisations-title" className="border-t border-line py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <SectionHeading
          id="realisations-title"
          eyebrow={projects.eyebrow}
          title={projects.title}
          description={projects.description}
        />
        <TourGallery tours={tours} ui={tourUi} labels={projects} />
      </Container>
    </section>
  );
}
