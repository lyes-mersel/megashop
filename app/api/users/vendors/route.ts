import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { formatUserData, getUserSelect } from "@/lib/helpers/users";
import { getPaginationParams } from "@/lib/utils/params";

// Get all vendors (Admin only)
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
    const totalVendors = await prisma.user.count({
      where: {
        role: UserRole.VENDEUR,
      },
    });

    const vendors = await prisma.user.findMany({
      where: {
        role: UserRole.VENDEUR,
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
                produitMarketplace: {
                  select: {
                    produit: {
                      select: {
                        id: true,
                        lignesCommande: {
                          select: {
                            quantite: true,
                            prixUnit: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      take: pageSize,
      skip,
    });

    const data = vendors.map((vendor) => {
      const products = vendor.client?.vendeur?.produitMarketplace ?? [];
      const totalProduits = products.length;

      const totalVentes = products.reduce((sum, { produit }) => {
        const productSales = produit.lignesCommande.reduce(
          (productSum, ligne) =>
            productSum + Number(ligne.prixUnit) * ligne.quantite,
          0
        );
        return sum + productSales;
      }, 0);

      const produitsVendus = products.reduce((sum, { produit }) => {
        const productQuantity = produit.lignesCommande.reduce(
          (productSum, ligne) => productSum + ligne.quantite,
          0
        );
        return sum + productQuantity;
      }, 0);

      return {
        ...formatUserData(vendor),
        stats: {
          totalVentes,
          totalProduits,
          produitsVendus,
        },
      };
    });

    const pagination = {
      totalVendors,
      totalPages: Math.ceil(totalVendors / pageSize),
      currentPage: page,
      pageSize,
    };

    return NextResponse.json(
      {
        message: "Les vendeurs ont été récupérés avec succès",
        pagination,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET ALL /api/users/vendors]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
