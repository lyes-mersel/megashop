// /api/users/[userId]/orders/[orderId]

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { formatOrderData, getOrderSelect } from "@/lib/helpers/orders";

// GET an orders by Id for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; orderId: string }> }
) {
  const { userId, orderId } = await params;
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  if (session.user.id !== userId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    const commande = await prisma.commande.findUnique({
      where: {
        id: orderId,
        clientId: userId,
      },
      select: getOrderSelect(),
    });

    if (!commande) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    const formattedData = formatOrderData(commande);

    return NextResponse.json(
      {
        message: "Commande récupérée avec succès",
        data: formattedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/users/[userId]/orders]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
