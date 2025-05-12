import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

// Get all genders
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
    const genders = await prisma.genre.findMany({
      select: {
        id: true,
        nom: true,
      },
    });

    return NextResponse.json(
      { message: "Les genres ont été récupérés avec succès", data: genders },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/metadata/genders]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
