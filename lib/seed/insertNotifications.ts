import { prisma } from "@/lib/utils/prisma";
import { NotificationType } from "@prisma/client";

// Helper function to generate random dates in the past
function getPastDate(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date;
}

// Helper function to generate random boolean for estLu
function getRandomReadStatus(): boolean {
  return Math.random() > 0.7;
}

// Helper function to get random element from array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Interface for notification templates
interface NotificationTemplate {
  type: NotificationType;
  objet: string;
  text: string;
  urlRedirection?: string;
}

// Product names for EVALUATION notifications
const productNames = [
  "Pull simple",
  "Pull avec col",
  "Jean slim",
  "Short en jean",
  "Chemise élégante",
  "Ensemble en jean garçon",
  "Ensemble en jean garçon 2",
  "Ensemble en jean fille",
  "Robe d'été",
  "Veste en cuir",
  "Ceinture en cuir",
  "Baskets sport",
  "Pull moderne",
  "Baskets blanches sportives",
  "Manteau long",
  "Sac à main en cuir",
];

async function insertNotifications() {
  // Generate client emails
  const clientEmails = [
    "client@email.com",
    ...Array.from({ length: 10 }, (_, i) => `client${i + 1}@email.com`),
  ];

  // Fetch all users
  const clients = await prisma.user.findMany({
    where: { email: { in: clientEmails } },
    select: { id: true, email: true },
  });
  const vendor = await prisma.user.findUnique({
    where: { email: "vendeur@email.com" },
  });
  const admin = await prisma.user.findUnique({
    where: { email: "admin@email.com" },
  });

  if (clients.length !== clientEmails.length || !vendor?.id || !admin?.id) {
    console.error("Certains utilisateurs n'ont pas été trouvés.");
    return;
  }

  // URL prefixes for different roles
  const urlPrefixes = {
    client: "/client",
    vendor: "/vendor",
    admin: "/admin",
  };

  // Notification templates
  const notificationTemplates: NotificationTemplate[] = [
    {
      type: NotificationType.DEFAULT,
      objet: "Mise à jour du système",
      text: "Une nouvelle version de l'application est disponible. Découvrez les nouvelles fonctionnalités !",
    },
    {
      type: NotificationType.COMMANDE,
      objet: "Nouvelle commande",
      text: `Votre commande #${Math.floor(
        1000 + Math.random() * 9000
      )} a été reçue avec succès.`,
      urlRedirection: "/orders",
    },
    {
      type: NotificationType.COMMANDE,
      objet: "Mise à jour de la commande",
      text: `Votre commande #${Math.floor(
        1000 + Math.random() * 9000
      )} a été expédiée.`,
      urlRedirection: "/orders",
    },
    {
      type: NotificationType.COMMANDE,
      objet: "Commande annulée",
      text: `Votre commande #${Math.floor(
        1000 + Math.random() * 9000
      )} a été annulée.`,
      urlRedirection: "/orders",
    },
    {
      type: NotificationType.LIVRAISON,
      objet: "Suivi de livraison",
      text: "Votre colis est en route. Suivez sa progression avec le numéro de suivi.",
      urlRedirection: "/orders",
    },
    {
      type: NotificationType.PAIEMENT,
      objet: "Confirmation de paiement",
      text: `Votre paiement de ${(Math.random() * 9000 + 1000).toFixed(
        2
      )} DA a été reçu avec succès.`,
    },
    {
      type: NotificationType.SIGNALEMENT,
      objet: "Nouveau signalement",
      text: "Un produit a été signalé pour vérification. Veuillez examiner les détails.",
      urlRedirection: "/reports",
    },
    {
      type: NotificationType.EVALUATION,
      objet: "Nouvelle évaluation",
      text: `Le produit "${getRandomElement(
        productNames
      )}" a reçu une nouvelle évaluation.`,
      urlRedirection: "/store",
    },
    {
      type: NotificationType.EVALUATION,
      objet: "Évaluez votre achat",
      text: `Merci pour votre achat de "${getRandomElement(
        productNames
      )}". Laissez une évaluation !`,
      urlRedirection: "/store",
    },
    {
      type: NotificationType.MESSAGE,
      objet: "Nouveau message",
      text: "Vous avez reçu un message de l'équipe de support. Veuillez vérifier votre boîte de réception. Ceci est un message de test. Veuillez l'ignorer.",
    },
    {
      type: NotificationType.MESSAGE,
      objet: "Message du vendeur",
      text: "Un vendeur a répondu à votre question concernant un produit. Ceci est un message de test. Veuillez l'ignorer.",
    },
    {
      type: NotificationType.SECURITE,
      objet: "Alerte de sécurité",
      text: "Une connexion depuis un nouvel appareil a été détectée. Vérifiez vos paramètres de sécurité.",
      urlRedirection: "/settings",
    },
  ];

  // Generate notifications
  const notifications = [];

  // Client notifications (for all 11 clients)
  for (const client of clients) {
    notifications.push(
      ...notificationTemplates
        .filter(
          (t) =>
            new Set<NotificationType>([
              NotificationType.DEFAULT,
              NotificationType.COMMANDE,
              NotificationType.LIVRAISON,
              NotificationType.PAIEMENT,
              NotificationType.MESSAGE,
              NotificationType.SECURITE,
              NotificationType.EVALUATION,
            ]).has(t.type) && t.objet !== "Nouvelle évaluation"
        )
        // Each client gets 6-10 notifications
        .slice(0, Math.floor(Math.random() * 5) + 6)
        .map((template) => ({
          ...template,
          userId: client.id,
          estLu: getRandomReadStatus(),
          date: getPastDate(Math.floor(Math.random() * 30)), // Spread over 30 days
          urlRedirection: template.urlRedirection
            ? `${urlPrefixes.client}${template.urlRedirection}`
            : undefined,
        }))
    );
  }

  // Vendor notifications
  notifications.push(
    ...notificationTemplates
      .filter(
        (t) =>
          new Set<NotificationType>([
            NotificationType.DEFAULT,
            NotificationType.COMMANDE,
            NotificationType.LIVRAISON,
            NotificationType.MESSAGE,
            NotificationType.SECURITE,
            NotificationType.EVALUATION,
          ]).has(t.type) && t.objet !== "Évaluez votre achat"
      )
      .map((template) => ({
        ...template,
        userId: vendor.id,
        estLu: getRandomReadStatus(),
        date: getPastDate(Math.floor(Math.random() * 30)),
        text: template.text.replace("Votre", "Une"),
        urlRedirection: template.urlRedirection
          ? `${urlPrefixes.vendor}${template.urlRedirection}`
          : undefined,
      }))
  );

  // Admin notifications
  notifications.push(
    ...notificationTemplates
      .filter(
        (t) =>
          new Set<NotificationType>([
            NotificationType.DEFAULT,
            NotificationType.SIGNALEMENT,
            NotificationType.MESSAGE,
            NotificationType.SECURITE,
            NotificationType.EVALUATION,
          ]).has(t.type) && t.objet !== "Évaluez votre achat"
      )
      .map((template) => ({
        ...template,
        userId: admin.id,
        estLu: getRandomReadStatus(),
        date: getPastDate(Math.floor(Math.random() * 30)),
        text: `Admin: ${template.text}`,
        urlRedirection: template.urlRedirection
          ? `${urlPrefixes.admin}${template.urlRedirection}`
          : undefined,
      }))
  );

  // Insert notifications with error handling
  try {
    await prisma.notification.createMany({
      data: notifications,
    });
    console.log(
      `Notifications insérées avec succès ! (${notifications.length} notifications)`
    );
    console.log(
      `- Clients: ${
        notifications.filter((n) => clients.some((c) => c.id === n.userId))
          .length
      }`
    );
    console.log(
      `- Vendor: ${notifications.filter((n) => n.userId === vendor.id).length}`
    );
    console.log(
      `- Admin: ${notifications.filter((n) => n.userId === admin.id).length}`
    );
    console.log(
      `- Évaluation (Nouvelle): ${
        notifications.filter(
          (n) =>
            n.type === NotificationType.EVALUATION &&
            n.objet === "Nouvelle évaluation"
        ).length
      }`
    );
    console.log(
      `- Évaluation (Évaluez): ${
        notifications.filter(
          (n) =>
            n.type === NotificationType.EVALUATION &&
            n.objet === "Évaluez votre achat"
        ).length
      }`
    );
  } catch (error) {
    console.error("Erreur lors de l'insertion des notifications :", error);
  }
}

export default insertNotifications;
