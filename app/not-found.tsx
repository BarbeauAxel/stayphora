import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { RichText, plainText } from "@/components/ui/RichText";

const { notFound } = getContent();

export const metadata: Metadata = {
  title: plainText(notFound.title),
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="paper-grain flex min-h-svh items-center bg-cream pt-28 pb-20">
      <Container size="wide">
        <div className="max-w-3xl">
          <p className="label-eyebrow animate-fade-up text-clay-deep">{notFound.eyebrow}</p>
          <h1 className="mt-6 animate-fade-up font-serif text-6xl leading-[1.05] tracking-[-0.015em] text-balance [animation-delay:100ms] sm:text-7xl lg:text-8xl">
            <RichText text={notFound.title} />
          </h1>
          <p className="mt-8 max-w-lg animate-fade-up text-lg leading-relaxed text-stone [animation-delay:200ms]">
            {notFound.description}
          </p>
          <div className="mt-12 animate-fade-up [animation-delay:300ms]">
            <ButtonLink href="/" size="lg">
              <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {notFound.cta}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
