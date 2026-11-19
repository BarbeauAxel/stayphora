import type { Content } from "../types";

export const faq: Content["faq"] = {
  eyebrow: "FAQ",
  title: "Vos *questions*, nos réponses.",
  items: [
    {
      question: "Ai-je besoin d'un matériel particulier ?",
      answer:
        "Non. Un smartphone récent suffit : pas de caméra 360°, pas de trépied spécial, pas de technicien à faire venir. Vous filmez en vidéo, en marchant lentement, pièce par pièce.",
    },
    {
      question: "Comment filmer mon logement ?",
      answer:
        "Lumières allumées, logement rangé, portes ouvertes, et une marche lente et régulière. Nous vous envoyons un guide simple avec votre devis ; il est aussi disponible en ligne.",
      link: { label: "Lire le guide de tournage", href: "/guide-tournage" },
    },
    {
      question: "En combien de temps je reçois ma visite ?",
      answer:
        "Sous 72 h après réception de vos vidéos, pour un logement standard. Pour un grand logement ou un volume important, nous vous indiquons un délai précis dans le devis.",
    },
    {
      question: "Puis-je mettre la visite sur mon annonce Airbnb ?",
      answer:
        "Airbnb n'autorise pas les liens externes dans les annonces. La visite est faite pour votre site de réservation directe, votre fiche Google, vos réseaux sociaux et vos échanges avec les voyageurs après réservation.",
    },
    {
      question: "La visite fonctionne-t-elle sur mobile ?",
      answer:
        "Oui. La visite s'ouvre dans le navigateur, sans application, sur smartphone, tablette et ordinateur. Une version allégée est servie automatiquement aux mobiles pour rester fluide.",
    },
    {
      question: "Combien de temps la visite reste-t-elle en ligne ?",
      answer:
        "L'hébergement est inclus pendant [X mois], puis peut être prolongé pour un petit forfait annuel. Vous pouvez aussi nous demander une mise à jour après des travaux ou un changement de décoration.",
    },
    {
      question: "Et ma vie privée ?",
      answer:
        "Nous pouvons flouter ou retirer les objets personnels, les photos de famille et les documents visibles. Pensez aussi à ranger avant de filmer : la visite montre le logement tel qu'il est.",
    },
    {
      question: "Travaillez-vous avec les conciergeries ?",
      answer:
        "Oui, c'est même notre priorité. Tarifs dégressifs, visites en marque blanche, page de visite à vos couleurs et interlocuteur dédié : de quoi valoriser tout votre parc et convaincre de nouveaux propriétaires.",
    },
    {
      question: "Comment se passe le paiement ?",
      answer:
        "Le devis est gratuit. Vous ne payez qu'une fois la visite livrée et validée, par virement ou carte bancaire. Les conciergeries peuvent opter pour une facturation mensuelle.",
    },
  ],
};
