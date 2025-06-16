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

export type ClientStats = {
  totalDepenses: number;
  totalCommandes: number;
};

export type VendorStats = {
  totalVentes: number;
  totalProduits: number;
  produitsVendus: number;
};

export type ClientWithStats = UserFromAPI & {
  stats: ClientStats;
};

export type VendorWithStats = UserFromAPI & {
  stats: VendorStats;
};

export type UserType = "CLIENT" | "VENDEUR" | "ADMIN";

export type SortField =
  | "name"
  | "createdAt"
  | "orders"
  | "expenses"
  | "totalVentes"
  | "totalProduits"
  | "produitsVendus";
export type SortOrder = "asc" | "desc";

export interface SortConfig {
  key: SortField;
  direction: SortOrder;
}
