import { prisma } from "@/lib/utils/prisma";
import { CommandeStatut } from "@prisma/client";

// Insertion des commandes
async function insertOrders() {
  const userId = (
    await prisma.user.findUnique({
      where: { email: "client@email.com" },
    })
  )?.id;

  if (!userId) {
    console.error("Impossible de récupérer l'ID de l'utilisateur.");
    return;
  }

  await prisma.commande.create({
    data: {
      client: { connect: { id: userId } },
      date: new Date(),
      montant: 14500,
      statut: CommandeStatut.LIVREE,
      adresse: {
        create: {
          rue: "Rue de la liberté",
          ville: "Béjaia",
          wilaya: "Béjaia",
          codePostal: "06000",
        },
      },
      lignesCommande: {
        createMany: {
          data: [
            {
              nomProduit: "Pull simple",
              quantite: 1,
              prixUnit: 1500,
              imagePublicId: "pic1_etcsri_vmai50",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "L" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Noir" } })
              )?.id,
            },
            {
              nomProduit: "Jean slim",
              quantite: 2,
              prixUnit: 4500,
              imagePublicId: "pic2_vqzxsr_fwyict",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "L" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Bleu" } })
              )?.id,
            },
            {
              nomProduit: "Baskets sport",
              quantite: 1,
              prixUnit: 4000,
              imagePublicId: "pic25_jji03o_dangrc",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "42" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Gris" } })
              )?.id,
            },
          ],
        },
      },
    },
  });

  await prisma.commande.create({
    data: {
      client: { connect: { id: userId } },
      date: new Date(),
      montant: 7000,
      statut: CommandeStatut.EN_ATTENTE,
      adresse: {
        create: {
          rue: "Rue Didouche Mourad",
          ville: "Alger Centre",
          wilaya: "Alger",
          codePostal: "16000",
        },
      },
      lignesCommande: {
        createMany: {
          data: [
            {
              nomProduit: "Pull moderne",
              quantite: 1,
              prixUnit: 2000,
              imagePublicId: "pic9_cfvvky_qj114o",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "M" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Vert" } })
              )?.id,
            },
            {
              nomProduit: "Baskets blanches sportives",
              quantite: 1,
              prixUnit: 5000,
              imagePublicId: "pic28_wnnyyd_ok1hij",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "42" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Blanc" } })
              )?.id,
            },
          ],
        },
      },
    },
  });

  await prisma.commande.create({
    data: {
      client: { connect: { id: userId } },
      date: new Date(),
      montant: 6000,
      statut: CommandeStatut.EXPEDIEE,
      adresse: {
        create: {
          rue: "Boulevard Colonel Amirouche",
          ville: "Béjaia",
          wilaya: "Béjaia",
          codePostal: "06000",
        },
      },
      lignesCommande: {
        createMany: {
          data: [
            {
              nomProduit: "Pull avec col",
              quantite: 1,
              prixUnit: 2500,
              imagePublicId: "pic12_wnptms_sbxlyq",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "L" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Bleu" } })
              )?.id,
            },
            {
              nomProduit: "Robe d'été",
              quantite: 1,
              prixUnit: 3500,
              imagePublicId: "pic20_a81vv9_etfc4n",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "M" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Violet" } })
              )?.id,
            },
          ],
        },
      },
    },
  });

  console.log("Commandes insérées avec succès !");
}

export default insertOrders;
