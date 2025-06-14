import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import {
  getPaginationParams,
  getSortingOrdersParams,
} from "@/lib/utils/params";
import { Prisma, UserRole } from "@prisma/client";
import { formatOrderData, getOrderSelect } from "@/lib/helpers/orders";

// GET & Search all orders for vendor only
export async function GET(request: NextRequest) {
  const session = await auth();

  // Authentication and authorization check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  if (session.user.role !== UserRole.VENDEUR) {
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
    lignesCommande: {
      some: {
        produit: {
          produitMarketplace: {
            vendeurId: session.user.id
          }
        }
      }
    },
    ...(search && {
      OR: [
        { id: search },
        {
          lignesCommande: {
            some: {
              AND: [
                {
                  produit: {
                    produitMarketplace: {
                      vendeurId: session.user.id
                    }
                  }
                },
                {
                  nomProduit: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  }
                }
              ]
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
        message: "Commandes du vendeur récupérées avec succès",
        pagination,
        data: formattedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/orders/vendor]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
