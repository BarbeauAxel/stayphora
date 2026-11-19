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
          "Le site et les visites 3D sont hébergés par Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis (www.cloudflare.com).",
        ],
      },
      {
        title: "Propriété intellectuelle",
        paragraphs: [
          "L'ensemble des contenus de ce site (textes, visuels, visites 3D, logo, mise en page) est la propriété de Stayphora ou de ses partenaires, sauf mention contraire. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite.",
          "Les visites 3D sont des reconstructions générées par intelligence artificielle à partir d'images réelles du logement. Elles montrent le logement tel qu'il était au moment de la prise de vue.",
          "Les scènes de démonstration « Appartement » et « Loft » proviennent du jeu de données Eyeful Tower (© Meta Platforms, Inc. et affiliés), diffusé sous licence MIT, entraînées avec SplatCast puis recadrées et compressées par Stayphora, tout comme la photo source illustrant « Ce que vous filmez ». Aucun soutien de Meta n'est sous-entendu.",
        ],
      },
      {
        title: "Responsabilité",
        paragraphs: [
          "Stayphora s'efforce de fournir des informations exactes et à jour, sans pouvoir en garantir l'exhaustivité. Une visite 3D peut comporter de légères imperfections de reconstruction (reflets, zones peu filmées) qui ne constituent pas une description contractuelle du logement.",
        ],
      },
      {
        title: "Données personnelles",
        paragraphs: [
          "Le traitement des données collectées via le formulaire de devis et des images des logements est décrit dans notre politique de confidentialité.",
        ],
      },
    ],
  },
  privacy: {
    title: "Politique de confidentialité",
    description: "Comment Stayphora collecte, utilise et protège vos données personnelles et les images de votre logement.",
    updated: "Dernière mise à jour : [date]",
    sections: [
      {
        title: "Responsable du traitement",
        paragraphs: [
          "Le responsable du traitement est [Nom ou raison sociale], [adresse], joignable à l'adresse contact@stayphora.fr.",
        ],
      },
      {
        title: "Données collectées via le formulaire",
        paragraphs: ["Lorsque vous demandez un devis, nous collectons :"],
        list: [
          "votre prénom et votre nom, votre adresse email et, si vous le souhaitez, votre téléphone ;",
          "votre profil (conciergerie, propriétaire, hôte, agent immobilier, autre) ;",
          "les informations sur le logement : type, surface, ville, nombre de logements ;",
          "les liens que vous choisissez de nous transmettre (site, annonce, vidéos déjà filmées) ;",
          "votre message.",
        ],
      },
      {
        title: "Images et vidéos des logements",
        paragraphs: [
          "Les vidéos et photos que vous nous transmettez servent uniquement à reconstruire la visite 3D de votre logement. Avant livraison, nous pouvons flouter ou retirer les objets personnels, les photos de famille, les documents et toute personne apparaissant par inadvertance.",
          "Vos images ne sont jamais utilisées pour entraîner des modèles d'IA, ni publiées comme réalisation sans votre accord écrit. La visite livrée est publiée à l'adresse que vous choisissez de partager ; elle n'est pas référencée sur notre site sans votre accord.",
        ],
      },
      {
        title: "Finalités et bases légales",
        paragraphs: [
          "Vos données servent à répondre à votre demande, à établir un devis et à réaliser la prestation. Ce traitement repose sur l'exécution de mesures précontractuelles prises à votre demande, puis du contrat (article 6.1.b du RGPD).",
          "La protection du formulaire contre le spam et les abus (vérification Cloudflare Turnstile, limitation du nombre de requêtes) repose sur notre intérêt légitime à sécuriser le service (article 6.1.f du RGPD).",
        ],
      },
      {
        title: "Destinataires et sous-traitants",
        paragraphs: ["Vos données sont destinées à Stayphora uniquement. Nous faisons appel aux sous-traitants suivants :"],
        list: [
          "Cloudflare, Inc. (États-Unis) : hébergement du site et des visites 3D (Workers, R2), stockage des demandes de devis dans une base de données Cloudflare D1 (emplacement principal : Europe de l'Ouest), protection anti-spam (Turnstile) ;",
          "Resend, Inc. (États-Unis) : acheminement des emails liés à votre demande ;",
          "le service de transfert de fichiers que vous choisissez (WeTransfer, Google Drive, Dropbox…) pour l'envoi de vos vidéos.",
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
          "Les données d'une demande de devis sans suite sont conservées au maximum 3 ans à compter du dernier contact. Les vidéos et photos sources sont supprimées au plus tard 90 jours après la livraison de la visite. La visite 3D reste en ligne pendant la durée d'hébergement prévue au devis, puis est supprimée. Les données de facturation sont archivées 10 ans (obligation comptable).",
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
        paragraphs: ["Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :"],
        list: [
          "droit d'accès, de rectification et d'effacement ;",
          "droit à la limitation du traitement et droit d'opposition ;",
          "droit à la portabilité ;",
          "droit de demander le retrait d'une visite publiée ;",
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
