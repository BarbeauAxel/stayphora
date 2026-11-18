import type { Content } from "../types";

/**
 * Témoignages : n'utiliser que de vrais avis clients.
 * La section reste masquée tant que `enabled` vaut `false`.
 */
export const testimonials: Content["testimonials"] = {
  enabled: false,
  eyebrow: "Témoignages",
  title: "Ils font déjà *visiter* leurs logements.",
  items: [
    {
      quote: "[Témoignage à remplacer] Citation d'une conciergerie sur la signature de nouveaux propriétaires.",
      name: "[Prénom N.]",
      role: "Conciergerie",
      city: "[Ville]",
    },
    {
      quote: "[Témoignage à remplacer] Citation d'un propriétaire de gîte sur les réservations directes.",
      name: "[Prénom N.]",
      role: "Propriétaire de gîte",
      city: "[Ville]",
    },
    {
      quote: "[Témoignage à remplacer] Citation d'un hôte sur les questions évitées avant l'arrivée.",
      name: "[Prénom N.]",
      role: "Hôte Airbnb",
      city: "[Ville]",
    },
  ],
};
