import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { PaiementStatut } from "@prisma/client";
import { formatValidationErrors, paymentSchema } from "@/lib/validations";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Authentication and authorization check
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }
    if (session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Validate request body
    const { orderId } = await params;
    const body = await req.json();
    const parsed = paymentSchema.parse({ ...body, commandeId: orderId });
    if (!parsed) {
      return formatValidationErrors(parsed);
    }

    // Fake validation logic (real validation would use a payment processor)
    const { cardNumber, cvc, expirationDate, legalName, commandeId } = parsed;

    console.log("Payment details:");
    console.log("Card Number:", cardNumber);
    console.log("CVC:", cvc);
    console.log("Expiration Date:", expirationDate);
    console.log("Legal Name:", legalName);

    // Check if order exists
    const existingOrder = await prisma.commande.findUnique({
      where: { id: commandeId },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Check if a payment already exists
    const existingPayment = await prisma.paiementCommande.findUnique({
      where: { commandeId },
      select: {
        id: true,
        statut: true,
        date: true,
        commande: {
          select: {
            clientId: true,
          },
        },
      },
    });

    // Concerned user check
    if (existingPayment?.commande.clientId !== session.user.id) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Check if payment is already validated
    if (existingPayment && existingPayment.statut === PaiementStatut.VALIDE) {
      return NextResponse.json(
        { error: "Payment already exists for this order" },
        { status: 400 }
      );
    }

    // Create payment record
    const paiement = await prisma.paiementCommande.create({
      data: {
        commandeId,
        statut: PaiementStatut.VALIDE,
      },
    });

    return NextResponse.json(
      { message: "Paiement enregistré avec succèes", data: paiement },
      { status: 201 }
    );
  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
