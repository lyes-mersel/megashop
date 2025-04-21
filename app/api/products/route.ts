import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { Prisma, UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { productSchema, formatValidationErrors } from "@/lib/validations";
import {
  getPaginationParams,
  getSortingProductsParams,
} from "@/lib/utils/params";
import { formatProductData, getProductSelect } from "@/lib/helpers/products";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/lib/helpers/cloudinary";

// Fetch all products
export async function GET(req: NextRequest) {
  const { page, pageSize, skip } = getPaginationParams(req);
  const { sortBy, sortOrder } = getSortingProductsParams(req);

  try {
    // Fetch all products & count
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
      {
        message: "Les produits ont été récupérés avec succès",
        pagination,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/products] : ", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// Create a new product
export async function POST(req: NextRequest) {
  try {
    // Authentication Check
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

    // Validate and Parse Form Data
    const formData = await req.formData();
    const parsedData = productSchema.safeParse({
      nom: formData.get("nom"),
      objet: formData.get("objet"),
      description: formData.get("description"),
      prix: Number(formData.get("prix")),
      qteStock: Number(formData.get("qteStock")),
      categorieId: formData.get("categorieId"),
      genreId: formData.get("genreId"),
      couleurs: formData.getAll("couleurs"),
      tailles: formData.getAll("tailles"),
      images: formData.getAll("images"),
    });

    if (!parsedData.success) {
      return formatValidationErrors(parsedData);
    }

    // Upload Images to Cloudinary
    const { images } = parsedData.data;
    let uploadedImages: string[] = [];

    try {
      uploadedImages = await Promise.all(
        images.map(async (image) => {
          const result = await uploadToCloudinary(image, "products");
          return result.public_id;
        })
      );
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
      return NextResponse.json(
        { error: "Échec du téléversement des images." },
        { status: 500 }
      );
    }

    // Attempt to Create Product in Database
    try {
      const product = await prisma.produit.create({
        data: {
          nom: parsedData.data.nom,
          prix: parsedData.data.prix,
          qteStock: parsedData.data.qteStock,
          objet: parsedData.data.objet,
          description: parsedData.data.description,
          categorie: parsedData.data.categorieId
            ? { connect: { id: parsedData.data.categorieId } }
            : undefined,
          genre: parsedData.data.genreId
            ? { connect: { id: parsedData.data.genreId } }
            : undefined,
          couleurs: parsedData.data.couleurs?.length
            ? {
                connect: parsedData.data.couleurs.map((id: string) => ({ id })),
              }
            : undefined,
          tailles: parsedData.data.tailles?.length
            ? {
                connect: parsedData.data.tailles.map((id: string) => ({ id })),
              }
            : undefined,
          images: {
            create: uploadedImages.map((publicId) => ({
              imagePublicId: publicId,
            })),
          },
          ...(isVendeur && {
            produitMarketplace: {
              create: {
                vendeurId: session.user.id,
              },
            },
          }),
          ...(isAdmin && {
            produitBoutique: {
              create: {},
            },
          }),
        },
      });

      return NextResponse.json(
        { message: "Produit créé avec succès", data: product },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database error:", dbError);

      // If product creation fails, delete the uploaded images
      await Promise.all(
        uploadedImages.map(async (publicId) => {
          try {
            await deleteFromCloudinary(publicId);
          } catch (deleteError) {
            console.error(`Failed to delete image ${publicId}:`, deleteError);
          }
        })
      );

      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        if (dbError.code === "P2025") {
          return NextResponse.json(
            { error: ERROR_MESSAGES.BAD_REQUEST_ID },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error [POST /api/products] :", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// DELETE all products
export async function DELETE(_req: NextRequest) {
  const session = await auth();

  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  try {
    let produitsToDelete;
    let message;

    switch (session.user.role) {
      case UserRole.ADMIN:
        // Get all boutique products and their images
        produitsToDelete = await prisma.produit.findMany({
          where: {
            produitBoutique: {
              isNot: null,
            },
          },
          select: {
            id: true,
            images: true,
          },
        });
        message = "Tous les produits boutique ont été supprimés avec succès.";
        break;

      case UserRole.VENDEUR:
        // Get vendor's marketplace products and their images
        produitsToDelete = await prisma.produit.findMany({
          where: {
            produitMarketplace: {
              vendeurId: session.user.id,
            },
          },
          select: {
            id: true,
            images: true,
          },
        });
        message = "Tous vos produits ont été supprimés avec succès.";
        break;

      default:
        return NextResponse.json(
          { error: ERROR_MESSAGES.FORBIDDEN },
          { status: 403 }
        );
    }

    // Delete all related images from Cloudinary
    await Promise.all(
      produitsToDelete.flatMap((produit) =>
        (produit.images || []).map((img) =>
          deleteFromCloudinary(img.imagePublicId)
        )
      )
    );

    // Delete all products
    const deleted = await prisma.produit.deleteMany({
      where: {
        id: {
          in: produitsToDelete.map((p) => p.id),
        },
      },
    });

    return NextResponse.json(
      {
        message,
        count: deleted.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [DELETE /api/products]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
