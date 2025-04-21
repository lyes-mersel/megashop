import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { formatUserData, getUserSelect } from "@/lib/helpers/users";
import { deleteFromCloudinary } from "@/lib/helpers/cloudinary";

// Get all users (Admin only)
export async function GET(_req: NextRequest) {
  const session = await auth();

  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  // Authorization Check: Only Admins
  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    const users = await prisma.user.findMany({
      select: getUserSelect(),
    });

    const data = users.map(formatUserData);

    return NextResponse.json({ message: "OK", data }, { status: 200 });
  } catch (error) {
    console.error("API Error [GET ALL /api/users]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// Delete all users (Admin only)
export async function DELETE(_req: NextRequest) {
  const session = await auth();

  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  // Authorization Check: Only Admins
  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    // Fetch all users with their imagePublicIds and products
    const users = await prisma.user.findMany({
      select: {
        id: true,
        imagePublicId: true,
        client: {
          select: {
            vendeur: {
              select: {
                produitMarketplace: {
                  select: {
                    produitId: true,
                    produit: {
                      select: {
                        images: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        admin: null,
        role: {
          notIn: [UserRole.ADMIN],
        },
      },
    });

    // Delete Cloudinary images (profile + product images)
    const allImagePublicIds = users.flatMap((user) => {
      const profileImage = user.imagePublicId ? [user.imagePublicId] : [];
      const productImages =
        user.client?.vendeur?.produitMarketplace.flatMap(
          (pm) => pm.produit?.images.map((img) => img.imagePublicId) || []
        ) || [];
      return [...profileImage, ...productImages];
    });

    await Promise.all(allImagePublicIds.map(deleteFromCloudinary));

    // Collect all product IDs
    const allProductIds = users.flatMap(
      (user) =>
        user.client?.vendeur?.produitMarketplace.map((pm) => pm.produitId) || []
    );

    // Delete all products
    if (allProductIds.length > 0) {
      await prisma.produit.deleteMany({
        where: { id: { in: allProductIds } },
      });
    }

    // Delete all users
    const deleted = await prisma.user.deleteMany({
      where: {
        admin: null,
        role: {
          notIn: [UserRole.ADMIN],
        },
      },
    });

    return NextResponse.json(
      {
        message: "Tous les utilisateurs ont été supprimés avec succès.",
        count: deleted.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [DELETE ALL /api/users]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
