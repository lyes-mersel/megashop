import { Prisma } from "@prisma/client";
import { getOrderSelect } from "@/lib/helpers/orders";

export type OrderFromDB = Prisma.CommandeGetPayload<{
  select: ReturnType<typeof getOrderSelect>;
}>;

export type OrderFromAPI = {
  id: string;
  date: Date;
  montant: number;
  statut: string;
  clientId: string | null;
  adresse: {
    id: string;
    rue: string;
    ville: string;
    wilaya: string;
    codePostal: string;
  } | null;
  produits: {
    id: string;
    nomProduit: string;
    quantite: number;
    prixUnit: number;
    imagePublicId: string | null;
    produitId: string | null;
    taille?: { id: string; nom: string } | null;
    couleur?: { id: string; nom: string; code: string } | null;
  }[];
  paiement: {
    id: string;
    statut: string;
    date: Date;
  } | null;
};

export interface SortConfig {
  key: keyof OrderFromAPI;
  direction: "asc" | "desc";
}

export type PrepareOrderFromAPI = {
  montant: number;
  produits: {
    id: string;
    nomProduit: string;
    quantite: number;
    prixUnit: number;
    imagePublicId: string | null;
    produitId: string | null;
    taille?: { id: string; nom: string } | null;
    couleur?: { id: string; nom: string; code: string } | null;
  }[];
};
