import { prisma } from "@/lib/utils/prisma";

// Insertion des notifications
async function insertNotifications() {
  const userId = (
    await prisma.user.findUnique({
      where: { email: "client@email.com" },
    })
  )?.id;

  if (!userId) {
    console.error("Impossible de récupérer l'ID de l'utilisateur.");
    return;
  }

  await prisma.notification.createMany({
    data: [
      {
        type: "COMMANDE",
        objet: "Nouvelle commande",
        text: "Votre commande a été reçue avec succès.",
        estLu: false,
        userId: userId,
        date: new Date(),
        urlRedirection: undefined,
      },
      {
        type: "COMMANDE",
        objet: "Mise à jour de la commande",
        text: "Votre commande a été expédiée.",
        estLu: false,
        userId: userId,
        date: new Date(),
        urlRedirection: undefined,
      },
      {
        type: "MESSAGE",
        objet: "Nouveau message",
        text: "Vous avez reçu un nouveau message de notre équipe.",
        estLu: false,
        userId: userId,
        date: new Date(),
        urlRedirection: undefined,
      },
      {
        type: "EVALUATION",
        objet: "Nouvelle réponse à votre évaluation",
        text: "Le vendeur a répondu à votre évaluation.",
        estLu: false,
        userId: userId,
        date: new Date(),
        urlRedirection: "/product/cmag1sbe0001s3o6izl8lpxqi",
      },
      {
        type: "SECURITE",
        objet: "Alerte de sécurité",
        text: "Un nouvel appareil a été connecté à votre compte.",
        estLu: false,
        userId: userId,
        date: new Date(),
        urlRedirection: undefined,
      },
      {
        type: "PAIEMENT",
        objet: "Confirmation de paiement",
        text: "Votre paiement a été reçu avec succès.",
        estLu: false,
        userId: userId,
        date: new Date(),
        urlRedirection: undefined,
      },
    ],
  });

  console.log("Notifications insérées avec succès !");
}

export default insertNotifications;
