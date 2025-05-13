import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

// Get all categories
export async function GET(_req: NextRequest) {
  try {
    const categories = await prisma.categorie.findMany({
      select: {
        id: true,
        nom: true,
        description: true,
      },
    });

    return NextResponse.json(
      {
        message: "Les catégories ont été récupérées avec succès",
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/metadata/categories]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
