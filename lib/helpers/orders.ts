import { OrderFromAPI, OrderFromDB } from "@/lib/types/order.types";

export function getOrderSelect() {
  return {
    id: true,
    date: true,
    montant: true,
    statut: true,
    client: {
      select: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            tel: true,
            imagePublicId: true,
          },
        },
      },
    },
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
    adresse,
    lignesCommande,
    paiement,
    client,
  } = order;

  return {
    id,
    date,
    montant: montant.toNumber(),
    statut,
    adresse,
    client: client
      ? {
          id: client.user.id,
          nom: client.user.nom,
          prenom: client.user.prenom,
          email: client.user.email,
          tel: client.user.tel,
          imagePublicId: client.user.imagePublicId,
        }
      : null,
    produits: lignesCommande.map((ligne) => ({
      ...ligne,
      prixUnit: ligne.prixUnit.toNumber(),
    })),
    paiement,
  };
}
