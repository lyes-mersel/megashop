import { getUserSelect } from "@/lib/helpers/users";
import { Adresse, Prisma } from "@prisma/client";

export type UserFromDB = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserSelect>;
}>;

export type UserResponse = {
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
  adresse?: Adresse | null;
  // admin?: { userId: string } | null;
  // client?: { id?: string } | null;
  vendeur?: {
    nomBoutique: string;
    description?: string | null;
    NomBanque: string;
    rib: string;
  } | null;
};
