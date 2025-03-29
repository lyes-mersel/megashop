import { NextRequest, NextResponse } from "next/server";

// prisma
import { prisma } from "@/lib/utils/prisma";
import { Prisma, UserRole } from "@prisma/client";

// utils
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validations/products";
import formatValidationErrors from "@/lib/validations/formatValidationErrors";

export async function GET(_req: NextRequest) {
  try {
    const products = await prisma.produit.findMany({
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

    // Format each product data
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
        // champ: fournisseur, si produit boutique
        ...(produitBoutique
          ? { fournisseur: { nomAffichage: produitBoutique.fournisseur } }
          : {}),
        // champ: vendeur, si produit marketplace
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
