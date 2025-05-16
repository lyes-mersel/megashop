import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { UserRole } from "@prisma/client";
import { formatValidationErrors, prepareOrderSchema } from "@/lib/validations";
import { Decimal } from "@prisma/client/runtime/library";
import { BadRequestIdError } from "@/lib/classes/BadRequestIdError";
import { PrepareOrderFromAPI } from "@/lib/types/order.types";

// POST: Create a new order (client only)
export async function POST(req: NextRequest) {
  const session = await auth();

  // Check authentication
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  // Check authorization
  if (session.user.role !== UserRole.CLIENT) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  // Parse and validate request body
  const body = await req.json();
  const parsed = prepareOrderSchema.safeParse(body);

  if (!parsed.success) {
    return formatValidationErrors(parsed);
  }

  const { produits } = parsed.data;

  try {
    // Fetch product details and calculate total
    let total = new Decimal(0);

    const ligneCommandeData = await Promise.all(
      produits.map(async (line) => {
        const produit = await prisma.produit.findUnique({
          where: { id: line.produitId },
          select: {
            id: true,
            nom: true,
            prix: true,
            images: { select: { imagePublicId: true }, take: 1 },
          },
        });

        if (!produit) {
          throw new BadRequestIdError(
            `Produit avec l'ID ${line.produitId} non trouvé dans la base de données.`
          );
        }

        const prixUnit = produit.prix;
        const quantite = line.quantite;
        const sousTotal = prixUnit.mul(quantite);
        total = total.add(sousTotal);

        return {
          id: produit.id,
          nomProduit: produit.nom,
          quantite,
          prixUnit,
          imagePublicId: produit.images[0]?.imagePublicId ?? null,
          produitId: produit.id,
          couleurId: line.couleurId ?? null,
          tailleId: line.tailleId ?? null,
        };
      })
    );

    const order: PrepareOrderFromAPI = {
      montant: total.toNumber(),
      produits: ligneCommandeData.map((ligne) => ({
        ...ligne,
        prixUnit: ligne.prixUnit.toNumber(),
      })),
    };

    return NextResponse.json(
      { message: "La commande a été préparée avec succès.", data: order },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error [POST /api/orders]:", error);

    if (error instanceof BadRequestIdError) {
      return NextResponse.json(
        { eroor: ERROR_MESSAGES.BAD_REQUEST_ID },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
