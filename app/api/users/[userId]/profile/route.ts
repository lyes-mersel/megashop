import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        imagePublicId: true,
        client: {
          select: {
            vendeur: {
              select: {
                nomBoutique: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.client?.vendeur) {
      return NextResponse.json(
        { error: "Le vendeur n'exite pas" },
        { status: 404 }
      );
    }

    // Formatting the response data
    const data = {
      id: userId,
      nomBoutique: user.client.vendeur.nomBoutique,
      description: user.client.vendeur.description,
      imagePublicId: user.imagePublicId,
    };

    return NextResponse.json(
      {
        message: "Profile du vendeur récupéré avec succès",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/users/[userId]/profile] :", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
