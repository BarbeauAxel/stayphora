import type { Project, ProjectsContent } from "../types";

/** Les images suivent la convention /images/projects/<slug>-avant.jpg et <slug>-apres.jpg */
function project(slug: string, title: string, location: string, style: string, room: string): Project {
  return {
    slug,
    title,
    location,
    style,
    before: { src: `/images/projects/${slug}-avant.jpg`, alt: `${room} à ${location} avant redécoration` },
    after: {
      src: `/images/projects/${slug}-apres.jpg`,
      alt: `${room} à ${location} après redécoration, style ${style}`,
    },
  };
}

// [À remplacer] projets et images d'exemple
export const projects: ProjectsContent = {
  eyebrow: "Réalisations",
  title: "Le même logement, une *autre* histoire.",
  description: "Faites glisser la poignée pour comparer. Chaque rendu part d'une simple photo prise par l'hôte.",
  beforeLabel: "Avant",
  afterLabel: "Après",
  sliderLabel: "Comparer avant et après",
  openLabel: "Voir le projet",
  closeLabel: "Fermer",
  featured: project("salon-bordeaux", "Appartement", "Bordeaux", "Boutique Hôtel", "Salon"),
  items: [
    project("studio-nantes", "Studio", "Nantes", "Japandi", "Studio"),
    project("gite-luberon", "Gîte", "Luberon", "Méditerranéen", "Séjour"),
    project("loft-lille", "Loft", "Lille", "Industriel", "Loft"),
    project("chambre-annecy", "Chambre", "Annecy", "Scandinave", "Chambre"),
    project("t2-biarritz", "T2", "Biarritz", "Bohème", "Séjour"),
    project("duplex-lyon", "Duplex", "Lyon", "Boutique Hôtel", "Duplex"),
  ],
};
