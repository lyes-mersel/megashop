import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

// Get all colors
export async function GET(_req: NextRequest) {
  const session = await auth();

  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  // Authorization Check: Only Admins and Vendors
  if (
    session.user.role !== UserRole.ADMIN &&
    session.user.role !== UserRole.VENDEUR
  ) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    const colors = await prisma.couleur.findMany({
      select: {
        id: true,
        nom: true,
        code: true,
      },
    });

    return NextResponse.json(
      { message: "Les couleurs ont été récupérées avec succès", data: colors },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/metadata/colors]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
