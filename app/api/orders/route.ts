import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import {
  getPaginationParams,
  getSortingOrdersParams,
} from "@/lib/utils/params";
import { PaiementStatut, Prisma, UserRole } from "@prisma/client";
import { formatOrderData, getOrderSelect } from "@/lib/helpers/orders";
import {
  formatValidationErrors,
  fullOrderWithPaymentSchema,
} from "@/lib/validations";
import { Decimal } from "@prisma/client/runtime/library";
import { BadRequestIdError } from "@/lib/classes/BadRequestIdError";

// GET & Search all orders for admin only
export async function GET(request: NextRequest) {
  const session = await auth();

  // Authentication and authorization check
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

  // Pagination & Sorting
  const { page, pageSize, skip } = getPaginationParams(request);
  const { sortBy, sortOrder } = getSortingOrdersParams(request);

  // Search
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  // Construct the filter
  const whereClause: Prisma.CommandeWhereInput = {
    ...(search && {
      OR: [
        { id: search },
        {
          lignesCommande: {
            some: {
              nomProduit: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
        {
          client: {
            user: {
              nom: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
        {
          client: {
            user: {
              prenom: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
      ],
    }),
  };

  try {
    const total = await prisma.commande.count({
      where: whereClause,
    });

    const commandes = await prisma.commande.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: getOrderSelect(),
      take: pageSize,
      skip,
    });

    const formattedData = commandes.map(formatOrderData);

    const pagination = {
      totalItems: total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      pageSize,
    };

    return NextResponse.json(
      {
        message: "Commandes récupérées avec succès",
        pagination,
        data: formattedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/orders]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

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

  const body = await req.json();
  const parsed = fullOrderWithPaymentSchema.safeParse(body);

  if (!parsed.success) {
    return formatValidationErrors(parsed);
  }

  const { userId, addresse, produits } = parsed.data;

  if (session.user.id !== userId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    // Create address
    const address = await prisma.adresse.create({ data: addresse });

    // Build order lines and calculate total
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
          throw new BadRequestIdError(`Produit ${line.produitId} introuvable.`);
        }

        const prixUnit = produit.prix;
        const sousTotal = prixUnit.mul(line.quantite);
        total = total.add(sousTotal);

        return {
          nomProduit: produit.nom,
          quantite: line.quantite,
          prixUnit,
          imagePublicId: produit.images[0]?.imagePublicId ?? null,
          produitId: produit.id,
          couleurId: line.couleurId ?? null,
          tailleId: line.tailleId ?? null,
        };
      })
    );

    // Create order
    const order = await prisma.commande.create({
      data: {
        montant: total,
        clientId: userId,
        adresseId: address.id,
        lignesCommande: { create: ligneCommandeData },
      },
      select: getOrderSelect(),
    });

    // Create payment record
    const paiement = await prisma.paiementCommande.create({
      data: {
        commandeId: order.id,
        statut: PaiementStatut.VALIDE,
      },
    });

    const formattedOrder = formatOrderData({ ...order, paiement });

    return NextResponse.json(
      {
        message: "Commande et paiement réussis",
        data: formattedOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error [POST /api/orders]:", error);

    if (error instanceof BadRequestIdError) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_REQUEST_ID },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
