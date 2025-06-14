import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { formatUserData, getUserSelect } from "@/lib/helpers/users";
import { getPaginationParams } from "@/lib/utils/params";
import { VendorStats, VendorWithStats } from "@/lib/types/user.types";

type SortField =
  | "name"
  | "createdAt"
  | "totalVentes"
  | "totalProduits"
  | "produitsVendus";
type SortOrder = "asc" | "desc";

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
  const searchParams = req.nextUrl.searchParams;
  const sortField = (searchParams.get("sortBy") as SortField) || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as SortOrder) || "desc";

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
      orderBy:
        sortField === "name"
          ? { nom: sortOrder }
          : sortField === "createdAt"
          ? { dateCreation: sortOrder }
          : undefined,
      take: pageSize,
      skip,
    });

    const data = vendors.map((vendor) => {
      const products = vendor.client?.vendeur?.produitMarketplace ?? [];
      const totalProduits = products.length;

      const totalVentes = products.reduce((sum: number, { produit }) => {
        const productSales = produit.lignesCommande.reduce(
          (productSum: number, ligne) =>
            productSum + Number(ligne.prixUnit) * ligne.quantite,
          0
        );
        return sum + productSales;
      }, 0);

      const produitsVendus = products.reduce((sum: number, { produit }) => {
        const productQuantity = produit.lignesCommande.reduce(
          (productSum: number, ligne) => productSum + ligne.quantite,
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
      } as VendorWithStats;
    });

    // Sort the data array for calculated fields
    if (
      ["totalVentes", "totalProduits", "produitsVendus"].includes(sortField)
    ) {
      data.sort((a, b) => {
        const aValue = a.stats[sortField as keyof VendorStats];
        const bValue = b.stats[sortField as keyof VendorStats];
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
    }

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
