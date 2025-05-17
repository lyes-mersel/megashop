import { prisma } from "@/lib/utils/prisma";

// Création des catégories
async function insertCategories() {
  await prisma.categorie.createMany({
    data: [
      {
        nom: "Hauts",
        description:
          "T-shirts, chemises, pulls et autres vêtements pour le haut du corps.",
      },
      {
        nom: "Bas",
        description:
          "Pantalons, jeans, shorts et autres vêtements pour le bas du corps.",
      },
      {
        nom: "Robes & Ensembles",
        description: "Robes et ensembles assortis pour toutes occasions.",
      },
      {
        nom: "Vestes & Manteaux",
        description: "Vestes légères, manteaux d'hiver et blousons.",
      },
      {
        nom: "Chaussures",
        description: "Baskets, bottes, sandales et autres types de chaussures.",
      },
      {
        nom: "Accessoires",
        description:
          "Sacs, écharpes, ceintures et autres compléments de tenue.",
      },
      {
        nom: "Autres",
        description:
          "Articles divers ne rentrant pas dans les autres catégories.",
      },
    ],
  });

  console.log("Catégories ajoutées !");
}

export default insertCategories;
