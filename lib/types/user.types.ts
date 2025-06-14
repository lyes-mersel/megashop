import { getUserSelect } from "@/lib/helpers/users";
import { Adresse, Prisma } from "@prisma/client";

export type UserFromDB = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserSelect>;
}>;

export type UserFromAPI = {
  id: string;
  email: string;
  role: "CLIENT" | "VENDEUR" | "ADMIN";
  nom: string;
  prenom: string;
  tel?: string | null;
  imagePublicId: string | null;
  emailVerifie: boolean;
  emailEnAttente?: string | null;
  dateCreation: Date;
  adresse: Adresse | null;
  vendeur?: {
    nomBoutique: string;
    description?: string | null;
    nomBanque: string;
    rib: string;
  } | null;
};

export type ClientWithStats = UserFromAPI & {
  stats: {
    totalDepenses: number;
    totalCommandes: number;
  };
};

export type VendorWithStats = UserFromAPI & {
  stats: {
    totalVentes: number;
    totalProduits: number;
    produitsVendus: number;
  };
};
