import { prisma } from "@/lib/utils/prisma";

// Création des genres
async function insertGenders() {
  await prisma.genre.createMany({
    data: [
      { nom: "Homme" },
      { nom: "Femme" },
      { nom: "Enfant" },
      { nom: "Unisexe" },
    ],
  });

  console.log("Genres ajoutés !");
}

export default insertGenders;
