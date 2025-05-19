import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { UserRole } from "@prisma/client";

// Get all sizes
export async function GET(_req: NextRequest) {
  try {
    const totalProducts = await prisma.produit.count();

    const totalUsers = await prisma.user.count({
      where: {
        role: UserRole.CLIENT,
      },
    });

    const totalVendors = await prisma.user.count({
      where: {
        role: UserRole.VENDEUR,
      },
    });

    return NextResponse.json(
      {
        message: "Les stats ont été récupérées avec succès",
        data: {
          totalProducts,
          totalUsers,
          totalVendors,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/metadata/sizes]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
