import { getContent, type Project } from "@/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectGallery } from "./ProjectGallery";

export function projectMeta(p: Project) {
  return `${p.title} · ${p.location} · ${p.style}`;
}

export function Projects() {
  const { projects } = getContent();
  const { featured, items, ...labels } = projects;

  return (
    <section id="realisations" aria-labelledby="realisations-title" className="py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <SectionHeading
          id="realisations-title"
          eyebrow={projects.eyebrow}
          title={projects.title}
          description={projects.description}
        />

        {/* Projet vedette */}
        <Reveal className="mt-14 sm:mt-20">
          <BeforeAfterSlider
            before={featured.before}
            after={featured.after}
            beforeLabel={projects.beforeLabel}
            afterLabel={projects.afterLabel}
            label={`${projects.sliderLabel} : ${projectMeta(featured)}`}
            sizes="(min-width: 1440px) 1340px, 100vw"
            className="sm:aspect-video"
          />
          <p className="mt-5 text-sm text-stone">{projectMeta(featured)}</p>
        </Reveal>

        <ProjectGallery
          items={items}
          labels={{
            beforeLabel: labels.beforeLabel,
            afterLabel: labels.afterLabel,
            sliderLabel: labels.sliderLabel,
            openLabel: labels.openLabel,
            closeLabel: labels.closeLabel,
          }}
        />
      </Container>
    </section>
  );
}
