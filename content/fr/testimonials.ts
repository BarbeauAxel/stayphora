import type { Content } from "../types";

/**
 * Témoignages : n'utiliser que de vrais avis clients.
 * La section reste masquée tant que `enabled` vaut `false`.
 */
export const testimonials: Content["testimonials"] = {
  enabled: false,
  eyebrow: "Témoignages",
  title: "Ils ont vu leur logement *autrement*.",
  items: [
    {
      quote: "[Témoignage à remplacer] Citation d'un hôte sur le résultat et la rapidité.",
      name: "[Prénom N.]",
      role: "Hôte Airbnb",
      city: "[Ville]",
    },
    {
      quote: "[Témoignage à remplacer] Citation d'une conciergerie sur la valeur ajoutée pour ses propriétaires.",
      name: "[Prénom N.]",
      role: "Conciergerie",
      city: "[Ville]",
    },
    {
      quote: "[Témoignage à remplacer] Citation d'un agent ou d'un investisseur sur la projection de ses clients.",
      name: "[Prénom N.]",
      role: "Agent immobilier",
      city: "[Ville]",
    },
  ],
};
