import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { formatUserData, getUserSelect } from "@/lib/helpers/users";
import { getPaginationParams } from "@/lib/utils/params";

// Get all users (Admin only)
export async function GET(req: NextRequest) {
  const session = await auth();

  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  // Authorization Check: Only Admins
  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  const { page, pageSize, skip } = getPaginationParams(req);

  try {
    const totalUsers = await prisma.user.count({
      where: {
        role: UserRole.CLIENT,
      },
    });

    const clients = await prisma.user.findMany({
      where: {
        role: UserRole.CLIENT,
      },
      select: {
        ...getUserSelect(),
        client: {
          select: {
            vendeur: {
              select: {
                nomBoutique: true,
                description: true,
                nomBanque: true,
                rib: true,
              },
            },
            commandes: {
              select: {
                montant: true,
              },
            },
          },
        },
      },
      take: pageSize,
      skip,
    });

    const data = clients.map((client) => {
      const totalDepenses =
        client.client?.commandes.reduce(
          (sum, cmd) => sum + Number(cmd.montant),
          0
        ) ?? 0;
      const totalCommandes = client.client?.commandes.length ?? 0;

      return {
        ...formatUserData(client),
        stats: {
          totalDepenses,
          totalCommandes,
        },
      };
    });

    const pagination = {
      totalUsers,
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage: page,
      pageSize,
    };

    return NextResponse.json(
      {
        message: "Les clients ont été récupérés avec succès",
        pagination,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET ALL /api/users/clients]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
