import { prisma } from "@/lib/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const product = await prisma.produit.findUnique({
      where: { id: productId },
      select: {
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
        categorieId: true,

        images: { select: { id: true, imageUrl: true } },
        categorie: { select: { id: true, nom: true } },
        genre: { select: { id: true, nom: true } },
        couleurs: { select: { id: true, nom: true } },
        tailles: { select: { id: true, nom: true } },

        produitBoutique: true,
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
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    // Format the product data
    const { produitMarketplace, produitBoutique, id, ...rest } = product;
    const data = {
      id,
      type: produitBoutique
        ? "boutique"
        : produitMarketplace
        ? "marketplace"
        : null,
      ...rest,
      ...(produitBoutique ? { produitBoutique } : {}),
      ...(produitMarketplace ? { produitMarketplace } : {}),
    };

    return NextResponse.json({ message: "OK", data }, { status: 200 });
  } catch (error) {
    console.error("API Error : ", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer plus tard !" },
      { status: 500 }
    );
  }
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  return NextResponse.json(
    { message: `Update product with ID: ${productId}` },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  return NextResponse.json(
    { message: `Delete product with ID: ${productId}` },
    { status: 200 }
  );
}
