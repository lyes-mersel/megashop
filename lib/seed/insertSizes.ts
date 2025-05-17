import { prisma } from "@/lib/utils/prisma";

// Insertion des tailles
async function insertSizes() {
  await prisma.taille.createMany({
    data: [
      { nom: "Standart" },
      // Tailles pour les vêtements adultes
      { nom: "S" },
      { nom: "M" },
      { nom: "L" },
      { nom: "XL" },
      { nom: "XXL" },
      { nom: "3XL" },
      // Tailles pour les vêtements enfants
      { nom: "2Y" },
      { nom: "3Y" },
      { nom: "4Y" },
      { nom: "5Y" },
      { nom: "6Y" },
      // Tailles pour les baskets
      { nom: "27" },
      { nom: "28" },
      { nom: "29" },
      { nom: "30" },
      { nom: "31" },
      { nom: "32" },
      { nom: "33" },
      { nom: "34" },
      { nom: "35" },
      { nom: "36" },
      { nom: "37" },
      { nom: "38" },
      { nom: "39" },
      { nom: "40" },
      { nom: "41" },
      { nom: "42" },
      { nom: "43" },
      { nom: "44" },
    ],
    skipDuplicates: true,
  });

  console.log("Tailles pour vêtements et baskets insérées avec succès !");
}

export default insertSizes;
