import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { getOrderSelect } from "@/lib/helpers/orders";
import { prisma } from "@/lib/utils/prisma";
import { CommandeStatut } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  // Check if the user is authenticated and has the role of admin
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  const { orderId } = await params;
  const { statut } = await req.json();

  // check if statut is valid
  if (!Object.values(CommandeStatut).includes(statut)) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.BAD_REQUEST },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.commande.update({
      where: { id: String(orderId) },
      data: { statut },
      select: getOrderSelect(),
    });

    if (!order) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Le statut de la commande a été mis à jour avec succès",
        data: order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);

    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
