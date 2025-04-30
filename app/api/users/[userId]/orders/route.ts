import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import {
  getPaginationParams,
  getSortingOrdersParams,
} from "@/lib/utils/params";
import { Prisma } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
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

  // Pagination & Sorting
  const { page, pageSize, skip } = getPaginationParams(request);
  const { sortBy, sortOrder } = getSortingOrdersParams(request);

  // Recherche
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  // Construction du filtre
  const whereClause: Prisma.CommandeWhereInput = {
    clientId: userId,
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
      // include: {
      //   lignesCommande: true,
      // },
      take: pageSize,
      skip,
      select: {
        id: true,
        date: true,
        montant: true,
        statut: true,
        adresse: {
          select: {
            id: true,
            rue: true,
            ville: true,
            wilaya: true,
            codePostal: true,
          },
        },
        lignesCommande: {
          select: {
            id: true,
            nomProduit: true,
            quantite: true,
            prixUnit: true,
            imagePublicId: true,
            produitId: true,
            // continue
          },
        },
      },
    });

    const formatted = commandes.map((commande) => ({
      id: commande.id,
      date: commande.date,
      montant: commande.montant.toFixed(2),
      statut: commande.statut,
      produits: commande.lignesCommande.map((ligne) => ({
        nom: ligne.nomProduit,
        quantite: ligne.quantite,
        prixUnit: ligne.prixUnit.toFixed(2),
      })),
    }));

    const pagination = {
      totalItems: total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      pageSize,
    };

    return NextResponse.json(
      {
        message: "Commandes récupérées avec succès",
        data: formatted,
        pagination,
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

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return NextResponse.json(
    { message: `Create an order for user with ID: ${userId}` },
    { status: 201 }
  );
}
