import { prisma } from "@/lib/utils/prisma";
import { SignalementStatut } from "@prisma/client";

// Helper function to generate random dates in the past
function getPastDate(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date;
}

// Helper function to get random element from array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Available report objects
const reportObjects = [
  "Produit contrefait",
  "Produit défectueux",
  "Description incorrecte",
  "Contenu inapproprié",
  "Autre problème",
];

// Available report statuses
const reportStatuses: SignalementStatut[] = [
  SignalementStatut.EN_ATTENTE,
  SignalementStatut.TRAITE,
  SignalementStatut.REJETE,
];

// Sample report descriptions for each object
const reportDescriptions: { [key: string]: string[] } = {
  "Produit contrefait": [
    "Le produit reçu semble être une imitation de mauvaise qualité.",
    "Les logos et matériaux ne correspondent pas à l'original.",
  ],
  "Produit défectueux": [
    "Le produit est arrivé endommagé, avec des coutures déchirées.",
    "L'article ne fonctionne pas comme décrit.",
  ],
  "Description incorrecte": [
    "La couleur et la taille ne correspondent pas à la description.",
    "Les caractéristiques du produit ne sont pas celles indiquées.",
  ],
  "Contenu inapproprié": [
    "L'emballage contenait du matériel promotionnel offensant.",
    "Le produit présente des motifs inappropriés.",
  ],
  "Autre problème": [
    "Problème de livraison, article envoyé à la mauvaise adresse.",
    "Le produit n'était pas dans l'emballage.",
  ],
};

async function insertReports() {
  // Generate client emails (same as in orders seed)
  const clientEmails = [
    "client@email.com",
    ...Array.from({ length: 10 }, (_, i) => `client${i + 1}@email.com`),
  ];

  // Fetch client IDs (using Client model)
  const clients = await prisma.user.findMany({
    where: { email: { in: clientEmails } },
    select: { id: true, email: true },
  });

  if (clients.length === 0) {
    console.error("Aucun client trouvé.");
    return;
  }

  // Fetch all products
  const products = await prisma.produit.findMany({
    select: { id: true, nom: true },
  });

  // Generate 12-20 reports
  const reports = [];
  const numReports = Math.floor(Math.random() * 11) + 12; // 12 to 20 reports
  for (let i = 0; i < numReports; i++) {
    const client = getRandomElement(clients);
    const reportObject = getRandomElement(reportObjects);
    const status = getRandomElement(reportStatuses);
    const product = getRandomElement(products);

    reports.push({
      clientId: client.id,
      produitId: product ? product.id : null, // Use random product ID or null
      objet: reportObject,
      text: getRandomElement(reportDescriptions[reportObject]),
      date: getPastDate(Math.floor(Math.random() * 30)), // Spread over 30 days
      statut: status,
    });
  }

  // Insert reports with error handling
  try {
    for (const report of reports) {
      await prisma.signalement.create({ data: report });
    }
    console.log(
      `Signalements insérés avec succès ! (${reports.length} signalements)`
    );
  } catch (error) {
    console.error("Erreur lors de l'insertion des signalements :", error);
  }
}

export default insertReports;
