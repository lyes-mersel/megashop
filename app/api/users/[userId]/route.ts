import { NextRequest, NextResponse } from "next/server";

import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { deleteFromCloudinary } from "@/lib/helpers/cloudinary";
import { getUserSelect, formatUserData } from "@/lib/helpers/users";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const session = await auth();

  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  // Check if the user is trying to access their own data
  if (session.user.id !== userId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    // Fetch user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: getUserSelect(),
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: `L'utilisateur avec l'ID ${userId} n'existe pas` },
        { status: 404 }
      );
    }

    // Format the response
    const data = formatUserData(user);

    return NextResponse.json({ message: "OK", data }, { status: 200 });
  } catch (error) {
    console.error("API Error [GET USER BY ID]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const session = await auth();

  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  // Authorization Check
  if (session.user.id !== userId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    // Get user info first
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
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
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: `L'utilisateur avec l'ID ${userId} n'existe pas.` },
        { status: 404 }
      );
    }

    // Delete profile image from Cloudinary if exists
    if (user.imagePublicId) {
      await deleteFromCloudinary(user.imagePublicId);
    }

    // If the user is a vendor & has products
    const produits = user?.client?.vendeur?.produitMarketplace || [];
    if (produits.length > 0) {
      // Delete all his product images from Cloudinary
      await Promise.all(
        produits.flatMap((pm) =>
          (pm.produit?.images || []).map((img) =>
            deleteFromCloudinary(img.imagePublicId)
          )
        )
      );
      // Delete all his products from the database
      const productIds = produits.map((p) => p.produitId);
      await prisma.produit.deleteMany({
        where: { id: { in: productIds } },
      });
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    // Delete the session
    await signOut({ redirect: false });

    return NextResponse.json(
      { message: `L'utilisateur avec l'ID ${userId} a été supprimé.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [DELETE USER BY ID]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return NextResponse.json(
    { message: `Update user with ID: ${userId}` },
    { status: 200 }
  );
}
