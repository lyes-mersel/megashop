import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/utils/prisma";
import { containsFilter } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    // Extract search params
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query") || "";
    const type = searchParams.get("type");
    const gender = searchParams.get("gender");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const size = searchParams.get("size");
    const color = searchParams.get("color");

    // where conditions
    const whereClause: Prisma.ProduitWhereInput = {
      OR: [
        { nom: containsFilter(query) },
        { description: containsFilter(query) },
        { couleurs: { some: { nom: containsFilter(query) } } },
        { tailles: { some: { nom: containsFilter(query) } } },
      ],
    };

    if (type === "boutique") whereClause.produitBoutique = { isNot: null };
    if (type === "marketplace")
      whereClause.produitMarketplace = { isNot: null };

    if (gender) whereClause.genre = { nom: containsFilter(gender) };
    if (category) whereClause.categorie = { nom: containsFilter(category) };
    if (size) whereClause.tailles = { some: { nom: containsFilter(size) } };
    if (color) whereClause.couleurs = { some: { nom: containsFilter(color) } };

    if (minPrice || maxPrice) {
      whereClause.prix = {};
      if (minPrice) whereClause.prix.gte = Number(minPrice);
      if (maxPrice) whereClause.prix.lte = Number(maxPrice);
    }

    // Fetch filtered products
    const products = await prisma.produit.findMany({
      where: whereClause,
      select: {
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
      },
    });

    // Format the response
    const data = products.map((product) => {
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
    });

    return NextResponse.json({ message: "OK", data }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer plus tard !" },
      { status: 500 }
    );
  }
}
