import { NextRequest, NextResponse } from "next/server";
import { Prisma, UserRole } from "@prisma/client";

import { prisma } from "@/lib/utils/prisma";
import { containsFilter } from "@/lib/utils";
import { formatProductData, getProductSelect } from "@/lib/helpers/products";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import {
  getPaginationParams,
  getSortingProductsParams,
} from "@/lib/utils/params";
import { auth } from "@/lib/auth";

// Search and retrieve all my products (for vendors)
export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  if (session.user.role !== UserRole.VENDEUR) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const { page, pageSize, skip } = getPaginationParams(req);
  const { sortBy, sortOrder } = getSortingProductsParams(req);

  // Extract search params
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type");
  const gender = searchParams.get("gender");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const size = searchParams.get("size");
  const color = searchParams.get("color");

  // where close
  const whereClause: Prisma.ProduitWhereInput = {
    AND: [
      {
        produitMarketplace: {
          vendeurId: session.user.id,
        },
      },
      {
        OR: [
          { nom: containsFilter(query) },
          { description: containsFilter(query) },
          { couleurs: { some: { nom: containsFilter(query) } } },
          { tailles: { some: { nom: containsFilter(query) } } },
        ],
      },
    ],
  };

  if (type === "boutique") whereClause.produitBoutique = { isNot: null };
  if (type === "marketplace") whereClause.produitMarketplace = { isNot: null };

  if (gender) whereClause.genre = { nom: containsFilter(gender) };
  if (category) whereClause.categorie = { nom: containsFilter(category) };
  if (size) whereClause.tailles = { some: { nom: containsFilter(size) } };
  if (color) whereClause.couleurs = { some: { nom: containsFilter(color) } };

  if (minPrice || maxPrice) {
    whereClause.prix = {};
    if (minPrice) whereClause.prix.gte = Number(minPrice);
    if (maxPrice) whereClause.prix.lte = Number(maxPrice);
  }

  try {
    // Fetch filtered products & count
    const totalProducts = await prisma.produit.count({ where: whereClause });
    const products = await prisma.produit.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      select: getProductSelect(),
      skip,
      take: pageSize,
    });

    // Format the response
    const data = products.map((product) => formatProductData(product));

    // Pagination response
    const pagination = {
      totalItems: totalProducts,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
      pageSize,
    };

    // Return response
    return NextResponse.json(
      {
        message: "Les résultats de la recherche ont été récupérés avec succès",
        pagination,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
