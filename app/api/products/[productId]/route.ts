import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

import { formatProductData, getProductSelect } from "@/lib/helpers/products";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { deleteFromCloudinary } from "@/lib/helpers/cloudinary";

// Fetch product by ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    // Fetch product by ID
    const product = await prisma.produit.findUnique({
      where: { id: productId },
      select: getProductSelect(),
    });

    // Check if product exists
    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    // Format the response
    const data = formatProductData(product);

    return NextResponse.json({ message: "OK", data }, { status: 200 });
  } catch (error) {
    console.error("API Error [GET PRODUCT BY ID] : ", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
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

// Delete a product
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = await auth();
  const { productId } = await params;

  //  Check authentication
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  try {
    const produit = await prisma.produit.findUnique({
      where: { id: productId },
      select: {
        id: true,
        produitMarketplace: true,
        produitBoutique: true,
        images: true,
      },
    });

    if (!produit) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    switch (session.user.role) {
      case UserRole.ADMIN:
        // Admin can delete any product
        // Note: Uncomment the following lines if you want to restrict admin to only delete boutique products
        // if (!produit.produitBoutique) {
        //   return NextResponse.json(
        //     { error: "Ce produit n'appartient pas à la boutique." },
        //     { status: 403 }
        //   );
        // }
        break;

      case UserRole.VENDEUR:
        if (
          !produit.produitMarketplace ||
          produit.produitMarketplace.vendeurId !== session.user.id
        ) {
          return NextResponse.json(
            { error: "Vous n'êtes pas autorisé à supprimer ce produit." },
            { status: 403 }
          );
        }
        break;

      default:
        return NextResponse.json(
          { error: ERROR_MESSAGES.FORBIDDEN },
          { status: 403 }
        );
    }

    // Delete associated images from Cloudinary
    await Promise.all(
      (produit?.images || []).map((img) =>
        deleteFromCloudinary(img.imagePublicId)
      )
    );

    // Delete the product from the database
    await prisma.produit.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      { message: "Produit supprimé avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [DELETE /api/products/:id]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
