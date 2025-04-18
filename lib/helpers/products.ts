import { ProductFromDB, ProductResponse } from "@/lib/types/product.types";

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
            nomBoutique: true,
          },
        },
      },
    },
    images: {
      select: {
        id: true,
        imagePublicId: true,
      },
    },
  };
}

export function formatProductData(product: ProductFromDB): ProductResponse {
  const {
    produitMarketplace,
    produitBoutique,
    id,
    prix,
    noteMoyenne,
    ...rest
  } = product;

  return {
    id,
    type: produitBoutique
      ? "boutique"
      : produitMarketplace
      ? "marketplace"
      : null,
    prix: prix.toNumber(),
    noteMoyenne: noteMoyenne?.toNumber(),
    ...rest,
    ...(produitBoutique
      ? { fournisseur: { nomPublic: produitBoutique.fournisseur } }
      : {}),
    ...(produitMarketplace
      ? {
          vendeur: {
            id: produitMarketplace.vendeur.id,
            nomBoutique: produitMarketplace.vendeur.nomBoutique,
          },
        }
      : {}),
  };
}
