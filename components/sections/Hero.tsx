import Image from "next/image";
import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  const { hero } = getContent();

  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink text-white">
      {/* Arrière-plan : poster (LCP) puis vidéo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={hero.poster.src}
          alt={hero.poster.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        {hero.video.enabled && <HeroVideo webm={hero.video.webm} mp4={hero.video.mp4} />}
        {/* Voile : garantit la lisibilité (contraste AA) quel que soit l'arrière-plan. */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-linear-to-r from-black/35 via-black/10 to-transparent" />
      </div>

      <Container size="wide" className="flex flex-1 flex-col justify-end pt-32 pb-28 sm:pb-32 lg:pb-36">
        <div className="max-w-4xl">
          <p className="label-eyebrow animate-fade-up text-white/85 [animation-delay:150ms]">{hero.eyebrow}</p>
          <h1
            id="hero-title"
            className="mt-6 animate-fade-up font-serif text-[3.1rem] leading-[1.05] tracking-[-0.015em] text-balance [animation-delay:250ms] sm:text-7xl lg:text-8xl"
          >
            <RichText text={hero.title} />
          </h1>
          <p className="mt-7 max-w-xl animate-fade-up text-base leading-relaxed text-white/85 text-pretty [animation-delay:400ms] sm:text-lg">
            {hero.subtitle}
          </p>
          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:550ms] sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href="#devis" size="lg">
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink href="#realisations" variant="light" size="lg">
              {hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>
      </Container>

      {/* Indicateur de défilement */}
      <a
        href="#reassurance"
        aria-label={hero.scrollLabel}
        className="absolute bottom-7 left-1/2 hidden h-12 w-6 -translate-x-1/2 animate-fade-in items-start justify-center overflow-hidden rounded-full border border-white/40 pt-2 [animation-delay:1s] sm:flex"
      >
        <span className="block h-2.5 w-px animate-scroll-dot bg-white" />
      </a>
    </section>
  );
}
