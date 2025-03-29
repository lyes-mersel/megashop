import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { Prisma, UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";
import {
  allowedSortFields,
  formatProductData,
  getProductSelect,
  validSortOrders,
} from "@/lib/api/products";
import { productSchema, formatValidationErrors } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Extract sorting parameters
  let sortBy = searchParams.get("sortBy");
  let sortOrder = searchParams.get("sortOrder");

  // Ensure sortBy & sortOrder are valid
  sortBy = allowedSortFields.includes(sortBy ?? "") ? sortBy : "nom";
  sortOrder = validSortOrders.includes(sortOrder ?? "") ? sortOrder : "asc";

  try {
    // Fetch all products
    const products = await prisma.produit.findMany({
      select: getProductSelect(),
      orderBy: { [sortBy!]: sortOrder },
    });

    // Format the response
    const data = products.map((product) => formatProductData(product));

    return NextResponse.json({ message: "OK", data }, { status: 200 });
  } catch (error) {
    console.error("API Error : ", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer plus tard !" },
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
      { error: "Une erreur est survenue. Veuillez réessayer plus tard !" },
      { status: 500 }
    );
  }
}

// TODO: PATCH (images will be added after creation of the product)
