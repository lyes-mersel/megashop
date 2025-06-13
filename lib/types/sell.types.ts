import { Prisma } from "@prisma/client";
import { getSellSelect } from "@/lib/helpers/sells";

export type SellFromDB = Prisma.LigneCommandeGetPayload<{
  select: ReturnType<typeof getSellSelect>;
}>;

export type SellFromAPI = {
  id: string;
  idProduit: string | null;
  nomProduit: string;
  quantite: number;
  prixUnit: number;
  total: number;
  imagePublicId: string | null;
  commande: {
    id: string;
    date: Date;
    statut: string;
    client: {
      id: string;
      nom: string;
      prenom: string;
      email: string;
      tel: string | null;
    } | null;
  };
  couleur: {
    id: string;
    nom: string;
    code: string;
  } | null;
  taille: {
    id: string;
    nom: string;
  } | null;
};
