import { Prisma } from "@prisma/client";
import { getProductSelect } from "@/lib/helpers/products";

// Used in old frontend
export type Discount = {
  amount: number;
  percentage: number;
};

// Used in old frontend
export type Product = {
  id: number;
  title: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
  type: "boutique" | "marketplace" | null;
};

export type ProductFromDB = Prisma.ProduitGetPayload<{
  select: ReturnType<typeof getProductSelect>;
}>;

export type ProductFromAPI = {
  id: string;
  type: "boutique" | "marketplace" | null;
  nom: string;
  objet: string | null;
  description: string | null;
  prix: number;
  qteStock: number;
  noteMoyenne: number;
  totalEvaluations: number;
  dateCreation: Date;
  dateModification: Date;
  genre: { id: string; nom: string } | null;
  categorie: { id: string; nom: string } | null;
  couleurs: { id: string; nom: string; code: string }[];
  tailles: { id: string; nom: string }[];
  fournisseur?: { nom: string | null };
  vendeur?: { id: string; nomBoutique: string };
  images: { id: string; imagePublicId: string }[];
};
