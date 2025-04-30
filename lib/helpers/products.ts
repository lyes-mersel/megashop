import { ProductFromDB, ProductFromAPI } from "@/lib/types/product.types";

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
    totalEvaluations: true,
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

export function formatProductData(product: ProductFromDB): ProductFromAPI {
  const {
    produitMarketplace,
    produitBoutique,
    id,
    nom,
    objet,
    description,
    prix,
    qteStock,
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
    nom,
    objet,
    description,
    prix: prix.toNumber(),
    qteStock,
    noteMoyenne: noteMoyenne?.toNumber(),
    ...rest,
    ...(produitBoutique
      ? { fournisseur: { nom: produitBoutique.fournisseur } }
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
