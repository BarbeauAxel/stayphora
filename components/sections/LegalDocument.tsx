import type { LegalPage } from "@/content";
import { Container } from "@/components/ui/Container";

/** Mise en page éditoriale des pages légales. */
export function LegalDocument({ page }: { page: LegalPage }) {
  return (
    <article className="pt-36 pb-24 sm:pt-44 sm:pb-32">
      <Container size="narrow">
        <header className="border-b border-line pb-10">
          <p className="label-eyebrow text-clay-deep">{page.updated}</p>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] tracking-[-0.01em] sm:text-6xl">{page.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-stone">{page.description}</p>
        </header>

        <div className="mt-12 space-y-12">
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-3xl leading-tight">{section.title}</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-ink/85">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {section.list && (
                  <ul className="space-y-2 pl-5 marker:text-clay [list-style-type:'–_']">
                    {section.list.map((item) => (
                      <li key={item} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </article>
  );
}
