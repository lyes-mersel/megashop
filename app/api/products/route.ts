import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { Prisma, UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { productSchema, formatValidationErrors } from "@/lib/validations";
import { getPaginationParams, getSortingParams } from "@/lib/utils/params";
import { formatProductData, getProductSelect } from "@/lib/helpers/products";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/lib/helpers/cloudinary";

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
    return NextResponse.json({ error: ERROR_MESSAGES }, { status: 500 });
  }
}

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

    // Role Check
    if (session.user.role !== UserRole.VENDEUR) {
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
          images: {
            create: uploadedImages.map((imageUrl) => ({
              imageUrl,
            })),
          },
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
            {
              error:
                "Échec de la création du produit : Un ou plusieurs IDs fournis sont invalides.",
            },
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
    console.error("API Error:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
