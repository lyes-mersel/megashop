import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { Prisma, UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";
import { formatProductData, getProductSelect } from "@/lib/api/products";
import { productSchema, formatValidationErrors } from "@/lib/validations";
import { getPaginationParams, getSortingParams } from "@/lib/utils/params";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants/settings";

export async function GET(req: NextRequest) {
  const { page, pageSize, skip } = getPaginationParams(req);
  const { sortBy, sortOrder } = getSortingParams(req);

  try {
    // Fetch total products & count
    const totalProducts = await prisma.produit.count();
    const products = await prisma.produit.findMany({
      select: getProductSelect(),
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
    });

    // Format products
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
      { message: "OK", pagination, data },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error : ", error);
    return NextResponse.json(
      { error: INTERNAL_ERROR_MESSAGE },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authentication Check
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    if (session.user.role !== UserRole.VENDEUR) {
      return NextResponse.json(
        {
          error: "Non autorisé : Seuls les vendeurs peuvent créer des produits",
        },
        { status: 403 }
      );
    }

    // Validate Request Body
    const body = await req.json();
    const parsedData = productSchema.safeParse(body);

    if (!parsedData.success) {
      return formatValidationErrors(parsedData);
    }

    // Création du produit

    const product = await prisma.produit.create({
      data: {
        nom: parsedData.data.nom,
        prix: parsedData.data.prix,
        qteStock: parsedData.data.qteStock,
        objet: parsedData.data.objet,
        description: parsedData.data.description,
        categorie: parsedData.data.categorieId
          ? {
              connect: {
                id: parsedData.data.categorieId,
              },
            }
          : undefined,
        genre: parsedData.data.genreId
          ? {
              connect: {
                id: parsedData.data.genreId,
              },
            }
          : undefined,
        couleurs: parsedData.data.couleurs
          ? {
              connect: parsedData.data.couleurs.map((id: string) => ({ id })),
            }
          : undefined,
        tailles: parsedData.data.tailles
          ? { connect: parsedData.data.tailles.map((id: string) => ({ id })) }
          : undefined,
        produitMarketplace: {
          create: {
            vendeurId: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Produit créé avec succès", data: product },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            error:
              "Échec de la création du produit : Un ou plusieurs IDs fournis sont invalides.",
          },
          { status: 400 }
        );
      }
    }

    console.error("API Error : ", error);
    return NextResponse.json(
      { error: INTERNAL_ERROR_MESSAGE },
      { status: 500 }
    );
  }
}

// TODO: PATCH (images will be added after creation of the product)
