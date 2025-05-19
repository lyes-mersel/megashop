import { prisma } from "@/lib/utils/prisma";
import { CommandeStatut } from "@prisma/client";

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

// Expanded list of Algerian addresses
const addresses = [
  {
    rue: "Rue de la Liberté",
    ville: "Béjaia",
    wilaya: "Béjaia",
    codePostal: "06000",
  },
  {
    rue: "Boulevard Didouche Mourad",
    ville: "Alger Centre",
    wilaya: "Alger",
    codePostal: "16000",
  },
  {
    rue: "Avenue Colonel Amirouche",
    ville: "Oran",
    wilaya: "Oran",
    codePostal: "31000",
  },
  {
    rue: "Rue Larbi Ben M'hidi",
    ville: "Constantine",
    wilaya: "Constantine",
    codePostal: "25000",
  },
  {
    rue: "Rue Mohamed Boudiaf",
    ville: "Annaba",
    wilaya: "Annaba",
    codePostal: "23000",
  },
  {
    rue: "Avenue de l'Indépendance",
    ville: "Tlemcen",
    wilaya: "Tlemcen",
    codePostal: "13000",
  },
  {
    rue: "Boulevard Zighoud Youcef",
    ville: "Sétif",
    wilaya: "Sétif",
    codePostal: "19000",
  },
  {
    rue: "Rue Emir Abdelkader",
    ville: "Batna",
    wilaya: "Batna",
    codePostal: "05000",
  },
  {
    rue: "Rue Ali Boumendjel",
    ville: "Tizi Ouzou",
    wilaya: "Tizi Ouzou",
    codePostal: "15000",
  },
  {
    rue: "Avenue des Martyrs",
    ville: "Blida",
    wilaya: "Blida",
    codePostal: "09000",
  },
  {
    rue: "Rue Khemisti Mohamed",
    ville: "Skikda",
    wilaya: "Skikda",
    codePostal: "21000",
  },
  {
    rue: "Boulevard Che Guevara",
    ville: "Jijel",
    wilaya: "Jijel",
    codePostal: "18000",
  },
  {
    rue: "Rue 1er Novembre",
    ville: "Chlef",
    wilaya: "Chlef",
    codePostal: "02000",
  },
  {
    rue: "Avenue Ahmed Zabana",
    ville: "Médéa",
    wilaya: "Médéa",
    codePostal: "26000",
  },
  {
    rue: "Rue Frères Bouadou",
    ville: "Bordj Bou Arréridj",
    wilaya: "Bordj Bou Arréridj",
    codePostal: "34000",
  },
  {
    rue: "Rue Abdelhamid Ben Badis",
    ville: "Mostaganem",
    wilaya: "Mostaganem",
    codePostal: "27000",
  },
  {
    rue: "Avenue Souidani Boudjemaa",
    ville: "Guelma",
    wilaya: "Guelma",
    codePostal: "24000",
  },
];

// Available order statuses
const orderStatuses: CommandeStatut[] = [
  CommandeStatut.EN_ATTENTE,
  CommandeStatut.EXPEDIEE,
  CommandeStatut.LIVREE,
  CommandeStatut.ANNULEE,
];

// Complete product list based on provided data
const productTemplates = [
  {
    nom: "Pull simple",
    prix: 1500,
    imagePublicId: "pic1_etcsri_vmai50",
    couleurs: ["Noir", "Blanc", "Orange"],
    tailles: ["M", "L", "XL"],
  },
  {
    nom: "Pull avec col",
    prix: 2500,
    imagePublicId: "pic12_wnptms_sbxlyq",
    couleurs: ["Bleu", "Rose"],
    tailles: ["M", "L", "XL"],
  },
  {
    nom: "Jean slim",
    prix: 4500,
    imagePublicId: "pic2_vqzxsr_fwyict",
    couleurs: ["Bleu", "Noir"],
    tailles: ["S", "M", "L"],
  },
  {
    nom: "Short en jean",
    prix: 3000,
    imagePublicId: "pic7_hfywjb_bd7zuk",
    couleurs: ["Bleu"],
    tailles: ["S", "M", "L", "XL"],
  },
  {
    nom: "Chemise élégante",
    prix: 4000,
    imagePublicId: "pic5_rruoqd_dfgeqq",
    couleurs: ["Vert", "Bleu"],
    tailles: ["S", "M", "L", "XL"],
  },
  {
    nom: "Ensemble en jean garçon",
    prix: 5000,
    imagePublicId: "pic17_be8rmr_uhtalr",
    couleurs: ["Bleu"],
    tailles: ["S", "6Y", "5Y", "4Y"],
  },
  {
    nom: "Ensemble en jean garçon 2",
    prix: 5000,
    imagePublicId: "pic15_eslrop_dbmnj8",
    couleurs: ["Bleu"],
    tailles: ["S", "6Y", "5Y", "4Y"],
  },
  {
    nom: "Ensemble en jean fille",
    prix: 6000,
    imagePublicId: "pic18_o6pini_pjmcsk",
    couleurs: ["Bleu"],
    tailles: ["S", "6Y", "5Y", "4Y"],
  },
  {
    nom: "Robe d'été",
    prix: 3500,
    imagePublicId: "pic20_a81vv9_etfc4n",
    couleurs: ["Violet", "Blanc"],
    tailles: ["S", "M"],
  },
  {
    nom: "Veste en cuir",
    prix: 8000,
    imagePublicId: "pic22_flkjfejf_s3yiu9",
    couleurs: ["Noir", "Marron"],
    tailles: ["M", "L", "XL"],
  },
  {
    nom: "Ceinture en cuir",
    prix: 1000,
    imagePublicId: "pic30_dweino_nnrykg",
    couleurs: ["Marron", "Noir"],
    tailles: ["Standart"],
  },
  {
    nom: "Baskets sport",
    prix: 4000,
    imagePublicId: "pic25_jji03o_dangrc",
    couleurs: ["Gris", "Noir", "Rouge"],
    tailles: ["36", "37", "38", "39", "40", "41", "42", "43", "44"],
  },
  {
    nom: "Pull moderne",
    prix: 2000,
    imagePublicId: "pic9_cfvvky_qj114o",
    couleurs: ["Vert", "Orange", "Blanc"],
    tailles: ["S", "M", "L"],
  },
  {
    nom: "Baskets blanches sportives",
    prix: 5000,
    imagePublicId: "pic28_wnnyyd_ok1hij",
    couleurs: ["Blanc"],
    tailles: ["36", "37", "38", "39", "40"],
  },
  {
    nom: "Manteau long",
    prix: 12000,
    imagePublicId: "pic28_eq4xqj_s4tlks",
    couleurs: ["Noir", "Vert"],
    tailles: ["S", "M", "L"],
  },
  {
    nom: "Sac à main en cuir",
    prix: 7000,
    imagePublicId: "pic32_hjy8fx_cmhgfg",
    couleurs: ["Noir", "Marron"],
    tailles: ["Standart"],
  },
];

async function insertOrders() {
  // Generate client emails
  const clientEmails = [
    "client@email.com",
    ...Array.from({ length: 10 }, (_, i) => `client${i + 1}@email.com`),
  ];

  // Fetch client IDs
  const clients = await prisma.user.findMany({
    where: { email: { in: clientEmails } },
    select: { id: true, email: true },
  });

  if (clients.length !== clientEmails.length) {
    console.error("Certains utilisateurs n'ont pas été trouvés.");
    return;
  }

  // Fetch all products, tailles, and couleurs in one go
  const products = await prisma.produit.findMany({
    select: { id: true, nom: true },
  });
  const tailles = await prisma.taille.findMany({
    select: { id: true, nom: true },
  });
  const couleurs = await prisma.couleur.findMany({
    select: { id: true, nom: true },
  });

  const tailleMap = new Map(tailles.map((t) => [t.nom, t.id]));
  const couleurMap = new Map(couleurs.map((c) => [c.nom, c.id]));
  const productMap = new Map(products.map((p) => [p.nom, p.id]));

  // Generate orders
  const orders = [];
  for (const client of clients) {
    // Each client gets 6-10 orders
    const numOrders = Math.floor(Math.random() * 5) + 6;
    for (let i = 0; i < numOrders; i++) {
      // Select 1-5 random products for the order
      const numItems = Math.floor(Math.random() * 5) + 1;
      const selectedProducts = Array.from({ length: numItems }, () =>
        getRandomElement(productTemplates)
      );

      // Generate ligneCommande data
      const lignesCommande = await Promise.all(
        selectedProducts.map(async (product) => {
          const quantite = Math.floor(Math.random() * 3) + 1;
          const couleur = getRandomElement(product.couleurs);
          const taille = getRandomElement(product.tailles);

          return {
            nomProduit: product.nom,
            quantite,
            prixUnit: product.prix,
            imagePublicId: product.imagePublicId,
            produitId: productMap.get(product.nom) ?? null,
            tailleId: tailleMap.get(taille),
            couleurId: couleurMap.get(couleur),
          };
        })
      );

      // Calculate total montant
      const montant = lignesCommande.reduce(
        (sum, item) => sum + item.prixUnit * item.quantite,
        0
      );

      // Create order
      orders.push({
        client: { connect: { id: client.id } },
        date: getPastDate(Math.floor(Math.random() * 30)), // Spread over 30 days
        montant,
        statut: getRandomElement(orderStatuses),
        adresse: { create: getRandomElement(addresses) },
        lignesCommande: { createMany: { data: lignesCommande } },
      });
    }
  }

  // Insert orders with error handling
  try {
    for (const order of orders) {
      await prisma.commande.create({ data: order });
    }
    console.log(
      `Commandes insérées avec succès ! (${orders.length} commandes)`
    );
  } catch (error) {
    console.error("Erreur lors de l'insertion des commandes :", error);
  }
}

export default insertOrders;
