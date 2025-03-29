import { Prisma } from "@prisma/client";

export const validSortOrders = ["asc", "desc"];

export const allowedSortFields = ["nom", "prix", "noteMoyenne", "dateCreation"];

export function getProductSelect() {
  return {
    // Attributes
    id: true,
    nom: true,
    objet: true,
    description: true,
    prix: true,
    qteStock: true,
    noteMoyenne: true,
    totalNotations: true,
    dateCreation: true,
    dateModification: true,
    // Relations
    genre: true,
    categorie: true,
    couleurs: true,
    tailles: true,
    produitBoutique: {
      select: { fournisseur: true },
    },
    produitMarketplace: {
      select: {
        vendeur: {
          select: {
            id: true,
            nomAffichage: true,
          },
        },
      },
    },
    images: {
      select: {
        id: true,
        imageUrl: true,
      },
    },
  };
}

export type ProductWithDetails = Prisma.ProduitGetPayload<{
  select: ReturnType<typeof getProductSelect>;
}>;

export function formatProductData(product: ProductWithDetails) {
  const { produitMarketplace, produitBoutique, id, ...rest } = product;
  return {
    id,
    type: produitBoutique
      ? "boutique"
      : produitMarketplace
      ? "marketplace"
      : null,
    ...rest,
    ...(produitBoutique
      ? { fournisseur: { nomAffichage: produitBoutique.fournisseur } }
      : {}),
    ...(produitMarketplace
      ? {
          vendeur: {
            id: produitMarketplace.vendeur.id,
            nomAffichage: produitMarketplace.vendeur.nomAffichage,
          },
        }
      : {}),
  };
}
