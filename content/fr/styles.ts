import type { StyleItem, Content } from "../types";

function style(slug: string, name: string, description: string): StyleItem {
  return {
    name,
    description,
    image: { src: `/images/styles/${slug}.jpg`, alt: `Intérieur de style ${name}` },
  };
}

// [À remplacer] images d'illustration des styles dans /public/images/styles
export const styles: Content["styles"] = {
  eyebrow: "Styles",
  title: "Une ambiance pour chaque *clientèle*.",
  description: "Six directions éprouvées, que nous adaptons à votre logement, à votre région et à vos voyageurs.",
  items: [
    style("scandinave", "Scandinave", "Bois clair, lin et lumière : l'évidence douce."),
    style("japandi", "Japandi", "Lignes calmes, matières brutes, esprit apaisé."),
    style("boheme", "Bohème", "Rotin, textiles et plantes pour un séjour libre."),
    style("mediterraneen", "Méditerranéen", "Enduits chaulés, terre cuite et soleil du Sud."),
    style("industriel", "Industriel", "Métal, brique et cuir pour les lofts urbains."),
    style("boutique-hotel", "Boutique Hôtel", "Velours, laiton et détails d'hôtel de caractère."),
  ],
};
