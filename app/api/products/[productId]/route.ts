import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

import { formatProductData, getProductSelect } from "@/lib/helpers/products";
import { auth } from "@/lib/auth";
import { Prisma, UserRole } from "@prisma/client";
import { deleteFromCloudinary } from "@/lib/helpers/cloudinary";
import { updateProductSchema, formatValidationErrors } from "@/lib/validations";

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
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Format the response
    const data = formatProductData(product);

    return NextResponse.json(
      { message: "Le produit a été récupéré avec succès", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/products/:productId] : ", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
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

    // Uncomment the following lines if you want to delete images from Cloudinary
    // Keep it commented for now to avoid accidental deletions
    // await Promise.all(
    //   (produit?.images || []).map((img) =>
    //     deleteFromCloudinary(img.imagePublicId)
    //   )
    // );

    // Delete the product from the database
    await prisma.produit.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      { message: "Produit supprimé avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [DELETE /api/products/:productId]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// Update an existing product
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    // Auth check
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const isVendeur = session.user.role === UserRole.VENDEUR;
    const isAdmin = session.user.role === UserRole.ADMIN;

    if (!isVendeur && !isAdmin) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Validate and Parse request body
    const body = await req.json();
    const parsedData = updateProductSchema.safeParse(body);
    if (!parsedData.success) {
      return formatValidationErrors(parsedData);
    }

    const {
      nom,
      prix,
      qteStock,
      objet,
      description,
      categorieId,
      genreId,
      couleurs,
      tailles,
    } = parsedData.data;

    // Check if the product exists
    const produit = await prisma.produit.findUnique({
      where: { id: productId },
      select: {
        produitMarketplace: true,
        produitBoutique: true,
      },
    });

    if (!produit) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Vendor can only update his products
    if (produit.produitMarketplace) {
      if (
        !isVendeur ||
        produit.produitMarketplace.vendeurId !== session.user.id
      ) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.FORBIDDEN },
          { status: 403 }
        );
      }
    }

    // Admin can only update boutique products
    if (produit.produitBoutique) {
      if (!isAdmin) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.FORBIDDEN },
          { status: 403 }
        );
      }
    }

    // Update the product in the database
    const updatedProduct = await prisma.produit.update({
      where: { id: productId },
      data: {
        nom,
        prix,
        qteStock,
        objet,
        description,
        categorie: categorieId ? { connect: { id: categorieId } } : undefined,
        genre: genreId ? { connect: { id: genreId } } : undefined,
        couleurs: couleurs?.length
          ? {
              set: couleurs.map((id: string) => ({ id })),
            }
          : undefined,
        tailles: tailles?.length
          ? {
              set: tailles.map((id: string) => ({ id })),
            }
          : undefined,
      },
      select: getProductSelect(),
    });

    const data = formatProductData(updatedProduct);

    return NextResponse.json(
      { message: "Produit mis à jour avec succès.", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [PATCH /api/products/:productId] :", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_REQUEST_ID },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
