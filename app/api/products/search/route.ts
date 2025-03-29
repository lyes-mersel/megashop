import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/utils/prisma";
import { containsFilter } from "@/lib/utils";
import {
  allowedSortFields,
  formatProductData,
  getProductSelect,
  validSortOrders,
} from "@/lib/api/products";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Extract search params
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type");
  const gender = searchParams.get("gender");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const size = searchParams.get("size");
  const color = searchParams.get("color");

  // Extract sorting parameters
  let sortBy = searchParams.get("sortBy");
  let sortOrder = searchParams.get("sortOrder");

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

  // Ensure sortBy & sortOrder are valid
  sortBy = allowedSortFields.includes(sortBy ?? "") ? sortBy : "nom";
  sortOrder = validSortOrders.includes(sortOrder ?? "") ? sortOrder : "asc";

  try {
    // Fetch filtered products
    const products = await prisma.produit.findMany({
      where: whereClause,
      orderBy: { [sortBy!]: sortOrder },
      select: getProductSelect(),
    });

    // Format the response
    const data = products.map((product) => formatProductData(product));

    return NextResponse.json({ message: "OK", data }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer plus tard !" },
      { status: 500 }
    );
  }
}
