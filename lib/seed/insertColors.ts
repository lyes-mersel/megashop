import { prisma } from "@/lib/utils/prisma";

// Insertion des couleurs
async function insertColors() {
  await prisma.couleur.createMany({
    data: [
      { nom: "Noir", code: "#000000" },
      { nom: "Blanc", code: "#FFFFFF" },
      { nom: "Rouge", code: "#FF0000" },
      { nom: "Bleu", code: "#0000FF" },
      { nom: "Vert", code: "#008000" },
      { nom: "Jaune", code: "#FFFF00" },
      { nom: "Orange", code: "#FFA500" },
      { nom: "Rose", code: "#FFC0CB" },
      { nom: "Gris", code: "#808080" },
      { nom: "Marron", code: "#8B4513" },
      { nom: "Violet", code: "#800080" },
      { nom: "Beige", code: "#F5F5DC" },
    ],
    skipDuplicates: true,
  });

  console.log("Couleurs insérées avec succès !");
}

export default insertColors;
