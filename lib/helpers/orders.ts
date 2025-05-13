import { OrderFromAPI, OrderFromDB } from "@/lib/types/order.types";

export function getOrderSelect() {
  return {
    id: true,
    date: true,
    montant: true,
    statut: true,
    clientId: true,
    adresse: {
      select: {
        id: true,
        rue: true,
        ville: true,
        wilaya: true,
        codePostal: true,
      },
    },
    lignesCommande: {
      select: {
        id: true,
        nomProduit: true,
        quantite: true,
        prixUnit: true,
        imagePublicId: true,
        produitId: true,
        taille: {
          select: {
            id: true,
            nom: true,
          },
        },
        couleur: {
          select: {
            id: true,
            nom: true,
            code: true,
          },
        },
      },
    },
    paiement: {
      select: {
        id: true,
        statut: true,
        date: true,
      },
    },
  };
}

export function formatOrderData(order: OrderFromDB): OrderFromAPI {
  const {
    id,
    date,
    montant,
    statut,
    clientId,
    adresse,
    lignesCommande,
    paiement,
  } = order;

  return {
    id,
    date,
    montant: montant.toNumber(),
    statut,
    clientId,
    adresse,
    produits: lignesCommande.map((ligne) => ({
      ...ligne,
      prixUnit: ligne.prixUnit.toNumber(),
    })),
    paiement,
  };
}
