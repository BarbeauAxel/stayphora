import type { Content } from "../types";

/*
 * [À remplacer] Contenu juridique PLACEHOLDER : complétez les champs entre
 * crochets et faites relire ces pages avant la mise en ligne.
 */

export const legal: Content["legal"] = {
  mentions: {
    title: "Mentions légales",
    description: "Informations légales relatives à l'éditeur et à l'hébergeur du site stayphora.fr.",
    updated: "Dernière mise à jour : [date]",
    sections: [
      {
        title: "Éditeur du site",
        paragraphs: [
          "Le site stayphora.fr est édité par [Nom ou raison sociale], [forme juridique, ex. entreprise individuelle / SAS] au capital de [montant] €.",
        ],
        list: [
          "Siège social : [adresse complète]",
          "SIREN / SIRET : [numéro]",
          "RCS / RM : [ville et numéro, le cas échéant]",
          "N° de TVA intracommunautaire : [numéro, le cas échéant]",
          "Email : contact@stayphora.fr",
          "Directeur de la publication : [Prénom Nom]",
        ],
      },
      {
        title: "Hébergement",
        paragraphs: [
          "Le site est hébergé par Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis (www.cloudflare.com).",
        ],
      },
      {
        title: "Propriété intellectuelle",
        paragraphs: [
          "L'ensemble des contenus de ce site (textes, visuels, rendus, logo, mise en page) est la propriété de Stayphora ou de ses partenaires, sauf mention contraire. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite.",
          "Les rendus présentés sont des visualisations générées par intelligence artificielle puis retouchées. Ils ne constituent pas des photographies de logements réels après travaux.",
        ],
      },
      {
        title: "Responsabilité",
        paragraphs: [
          "Stayphora s'efforce de fournir des informations exactes et à jour, sans pouvoir en garantir l'exhaustivité. Stayphora ne saurait être tenue responsable de l'usage fait des informations et rendus présentés sur ce site.",
        ],
      },
      {
        title: "Données personnelles",
        paragraphs: [
          "Le traitement des données collectées via le formulaire de devis est décrit dans notre politique de confidentialité.",
        ],
      },
    ],
  },
  privacy: {
    title: "Politique de confidentialité",
    description: "Comment Stayphora collecte, utilise et protège vos données personnelles.",
    updated: "Dernière mise à jour : [date]",
    sections: [
      {
        title: "Responsable du traitement",
        paragraphs: [
          "Le responsable du traitement est [Nom ou raison sociale], [adresse], joignable à l'adresse contact@stayphora.fr.",
        ],
      },
      {
        title: "Données collectées",
        paragraphs: ["Lorsque vous remplissez le formulaire de demande de devis, nous collectons :"],
        list: [
          "votre prénom et votre nom ;",
          "votre adresse email ;",
          "votre numéro de téléphone (facultatif) ;",
          "votre profil (hôte, conciergerie, agent immobilier, autre) ;",
          "les informations sur votre projet (nombre de pièces, style, message) ;",
          "les photos de votre logement que vous choisissez de nous transmettre.",
        ],
      },
      {
        title: "Finalités et bases légales",
        paragraphs: [
          "Vos données servent uniquement à répondre à votre demande, à établir un devis et, le cas échéant, à réaliser la prestation. Ce traitement repose sur l'exécution de mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).",
          "La protection du formulaire contre le spam et les abus (vérification Cloudflare Turnstile, limitation du nombre de requêtes) repose sur notre intérêt légitime à sécuriser le service (article 6.1.f du RGPD).",
          "Vos données ne sont jamais vendues ni utilisées à des fins publicitaires. Vos photos ne sont pas utilisées pour entraîner des modèles d'IA ni publiées sans votre accord écrit.",
        ],
      },
      {
        title: "Destinataires et sous-traitants",
        paragraphs: [
          "Vos données sont destinées à Stayphora uniquement. Nous faisons appel aux sous-traitants suivants :",
        ],
        list: [
          "Cloudflare, Inc. (États-Unis) : hébergement du site et protection anti-spam (Turnstile) ;",
          "Resend, Inc. (États-Unis) : acheminement des emails liés à votre demande, y compris les photos jointes.",
        ],
      },
      {
        title: "Transferts hors de l'Union européenne",
        paragraphs: [
          "Ces prestataires peuvent traiter des données aux États-Unis. Ces transferts sont encadrés par le Data Privacy Framework UE–États-Unis et/ou par les clauses contractuelles types de la Commission européenne.",
        ],
      },
      {
        title: "Durée de conservation",
        paragraphs: [
          "Les données d'une demande de devis sans suite sont conservées au maximum 3 ans à compter du dernier contact. Les photos transmises sont supprimées au plus tard [12 mois] après la fin de la prestation ou de l'échange. Les données des clients sont conservées pendant la durée de la relation commerciale, puis archivées selon les obligations légales (notamment comptables, 10 ans pour les factures).",
        ],
      },
      {
        title: "Cookies",
        paragraphs: [
          "Ce site n'utilise ni cookie publicitaire ni outil de mesure d'audience. Cloudflare Turnstile peut traiter des informations techniques strictement nécessaires à la détection des robots, sans finalité de suivi.",
        ],
      },
      {
        title: "Vos droits",
        paragraphs: [
          "Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants sur vos données :",
        ],
        list: [
          "droit d'accès, de rectification et d'effacement ;",
          "droit à la limitation du traitement et droit d'opposition ;",
          "droit à la portabilité ;",
          "droit de définir des directives relatives au sort de vos données après votre décès.",
        ],
      },
      {
        title: "Exercer vos droits",
        paragraphs: [
          "Pour exercer ces droits, écrivez à contact@stayphora.fr. Nous répondons dans un délai d'un mois. Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr).",
        ],
      },
    ],
  },
};
