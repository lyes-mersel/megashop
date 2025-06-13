import { SellFromDB, SellFromAPI } from "@/lib/types/sell.types";

export function getSellSelect() {
  return {
    id: true,
    nomProduit: true,
    quantite: true,
    prixUnit: true,
    imagePublicId: true,
    commande: {
      select: {
        id: true,
        date: true,
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
              },
            },
          },
        },
      },
    },
    produit: {
      select: {
        id: true,
      },
    },
    couleur: {
      select: {
        id: true,
        nom: true,
        code: true,
      },
    },
    taille: {
      select: {
        id: true,
        nom: true,
      },
    },
  } as const;
}

export function formatSellData(sell: SellFromDB): SellFromAPI {
  const prixUnit = sell.prixUnit.toNumber();
  const total = prixUnit * sell.quantite;

  return {
    id: sell.id,
    idProduit: sell.produit?.id ?? null,
    nomProduit: sell.nomProduit,
    quantite: sell.quantite,
    prixUnit,
    total,
    imagePublicId: sell.imagePublicId,
    commande: {
      id: sell.commande.id,
      date: sell.commande.date,
      statut: sell.commande.statut,
      client: sell.commande.client?.user ?? null,
    },
    couleur: sell.couleur,
    taille: sell.taille,
  };
}
