import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { DemoTour } from "./DemoTour";

/** Une page statique par visite de /content/fr/tours.ts. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getContent().tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { tours, site } = getContent();
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) return {};
  // Adresse publique et définitive de la visite (servie sur visite.stayphora.fr).
  const url = `${site.toursUrl}/${tour.slug}`;
  const title = `Visite 3D · ${tour.title}`;
  return {
    title,
    description: tour.description,
    alternates: { canonical: url },
    openGraph: { title, description: tour.description, url, images: [{ url: tour.cover.src, alt: tour.cover.alt }] },
  };
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { tours, tourUi, demoPage, site } = getContent();
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) notFound();

  return (
    <main id="contenu" className="fixed inset-0 bg-ink">
      <h1 className="sr-only">
        {`Visite 3D · ${tour.title}${tour.location ? ` · ${tour.location}` : ""}`}
      </h1>
      <DemoTour tour={tour} ui={tourUi} labels={demoPage} siteUrl={site.url} />
    </main>
  );
}
