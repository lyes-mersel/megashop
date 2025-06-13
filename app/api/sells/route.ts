import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import {
  getPaginationParams,
  getSortingSellsParams,
} from "@/lib/utils/params";
import { Prisma, UserRole } from "@prisma/client";
import { formatSellData, getSellSelect } from "@/lib/helpers/sells";

// GET & Search all sells for admin only
export async function GET(request: NextRequest) {
  const session = await auth();

  // Authentication and authorization check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  // Pagination & Sorting
  const { page, pageSize, skip } = getPaginationParams(request);
  const { sortBy, sortOrder } = getSortingSellsParams(request);

  // Search
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  // Construct the filter
  const whereClause: Prisma.LigneCommandeWhereInput = {
    ...(search && {
      OR: [
        { id: search },
        { nomProduit: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          commande: {
            client: {
              user: {
                nom: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
            },
          },
        },
        {
          commande: {
            client: {
              user: {
                prenom: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
            },
          },
        },
      ],
    }),
  };

  try {
    const total = await prisma.ligneCommande.count({
      where: whereClause,
    });

    const sells = await prisma.ligneCommande.findMany({
      where: whereClause,
      orderBy: sortBy === "date"
        ? {
            commande: {
              date: sortOrder as Prisma.SortOrder,
            },
          }
        : {
            [sortBy]: sortOrder as Prisma.SortOrder,
          },
      select: getSellSelect(),
      take: pageSize,
      skip,
    });

    const formattedData = sells.map(formatSellData);

    const pagination = {
      totalItems: total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      pageSize,
    };

    return NextResponse.json(
      {
        message: "Ventes récupérées avec succès",
        pagination,
        data: formattedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/sells]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
