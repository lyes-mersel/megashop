import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { auth } from "@/lib/auth";
import { UserRole, CommandeStatut } from "@prisma/client";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

export async function GET(_req: NextRequest) {
  const session = await auth();

  // Check if user is authenticated and has admin role
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

  // Get the admin analytics
  try {
    const [
      totalVentes,
      totalProduits,
      totalClients,
      totalVendeurs,
      produitsVendus,
      meilleurProduit,
      pireProduit,
      commandes,
      produitPlusRevenu,
      produitPlusVendu,
    ] = await Promise.all([
      prisma.commande.aggregate({
        _sum: { montant: true },
        where: { statut: CommandeStatut.LIVREE },
      }),
      prisma.produit.count(),
      prisma.user.count({ where: { role: UserRole.CLIENT } }),
      prisma.user.count({ where: { role: UserRole.VENDEUR } }),
      prisma.ligneCommande.aggregate({ _sum: { quantite: true } }),
      prisma.produit.findFirst({
        orderBy: { noteMoyenne: "desc" },
        where: { noteMoyenne: { not: 0 } },
        select: {
          id: true,
          nom: true,
          noteMoyenne: true,
          totalEvaluations: true
        },
      }),
      prisma.produit.findFirst({
        orderBy: { noteMoyenne: "asc" },
        where: { noteMoyenne: { gt: 0 } },
        select: {
          id: true,
          nom: true,
          noteMoyenne: true,
          totalEvaluations: true
        },
      }),
      prisma.commande.findMany({
        where: { statut: CommandeStatut.LIVREE },
        include: { lignesCommande: true },
      }),
      prisma.ligneCommande.groupBy({
        by: ["produitId"],
        _sum: {
          quantite: true,
          prixUnit: true,
        },
        orderBy: {
          _sum: {
            prixUnit: "desc",
          },
        },
        take: 1,
      }),
      prisma.ligneCommande.groupBy({
        by: ["produitId"],
        _sum: {
          quantite: true,
        },
        orderBy: {
          _sum: {
            quantite: "desc",
          },
        },
        take: 1,
      }),
    ]);

    // Get the product details for the highest revenue product
    const produitPlusRevenuDetails = produitPlusRevenu[0]?.produitId
      ? await prisma.produit.findUnique({
          where: { id: produitPlusRevenu[0].produitId },
          select: {
            id: true,
            nom: true,
            prix: true,
          },
        })
      : null;

    // Get the product details for the most sold product
    const produitPlusVenduDetails = produitPlusVendu[0]?.produitId
      ? await prisma.produit.findUnique({
          where: { id: produitPlusVendu[0].produitId },
          select: {
            id: true,
            nom: true,
            prix: true,
          },
        })
      : null;

    // WeekData
    const weekDataMap = new Map();
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    for (const cmd of commandes) {
      const day = days[new Date(cmd.date).getDay()];
      const prev = weekDataMap.get(day) || { sales: 0, itemsSold: 0 };
      const itemsSold = cmd.lignesCommande.reduce(
        (sum, l) => sum + l.quantite,
        0
      );
      weekDataMap.set(day, {
        sales: prev.sales + Number(cmd.montant),
        itemsSold: prev.itemsSold + itemsSold,
      });
    }
    const weekData = days.map((day) => ({
      day,
      sales: weekDataMap.get(day)?.sales || 0,
      itemsSold: weekDataMap.get(day)?.itemsSold || 0,
    }));

    // MonthData (tranches 1-5, 6-10, ...)
    const getRangeLabel = (day: number) => {
      const start = Math.floor((day - 1) / 5) * 5 + 1;
      const end = Math.min(start + 4, 30);
      return `${start}-${end}`;
    };

    const monthDataMap = new Map();
    for (const cmd of commandes) {
      const day = new Date(cmd.date).getDate();
      const range = getRangeLabel(day);
      const prev = monthDataMap.get(range) || { sales: 0, itemsSold: 0 };
      const itemsSold = cmd.lignesCommande.reduce(
        (sum, l) => sum + l.quantite,
        0
      );
      monthDataMap.set(range, {
        sales: prev.sales + Number(cmd.montant),
        itemsSold: prev.itemsSold + itemsSold,
      });
    }
    const monthData = Array.from(monthDataMap.entries())
      .sort()
      .map(([day, data]) => ({
        day,
        ...data,
      }));

    // YearData (mois en abrégé français)
    const months = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sept",
      "Oct",
      "Nov",
      "Déc",
    ];
    const yearDataMap = new Map();
    for (const cmd of commandes) {
      const monthIndex = new Date(cmd.date).getMonth();
      const label = months[monthIndex];
      const prev = yearDataMap.get(label) || { sales: 0, itemsSold: 0 };
      const itemsSold = cmd.lignesCommande.reduce(
        (sum, l) => sum + l.quantite,
        0
      );
      yearDataMap.set(label, {
        sales: prev.sales + Number(cmd.montant),
        itemsSold: prev.itemsSold + itemsSold,
      });
    }
    const yearData = months.map((month) => ({
      month,
      sales: yearDataMap.get(month)?.sales || 0,
      itemsSold: yearDataMap.get(month)?.itemsSold || 0,
    }));

    return NextResponse.json({
      totalVentes: totalVentes._sum.montant,
      totalProduits,
      utilisateurs: {
        clients: totalClients,
        vendeurs: totalVendeurs,
      },
      produitsVendus: produitsVendus._sum.quantite,
      meilleurProduit: meilleurProduit ? {
        id: meilleurProduit.id,
        nom: meilleurProduit.nom,
        noteMoyenne: meilleurProduit.noteMoyenne,
        totalEvaluations: meilleurProduit.totalEvaluations
      } : null,
      pireProduit: pireProduit ? {
        id: pireProduit.id,
        nom: pireProduit.nom,
        noteMoyenne: pireProduit.noteMoyenne,
        totalEvaluations: pireProduit.totalEvaluations
      } : null,
      produitPlusRevenu: produitPlusRevenuDetails
        ? {
            ...produitPlusRevenuDetails,
            totalRevenu: produitPlusRevenu[0]._sum.prixUnit,
            quantiteVendue: produitPlusRevenu[0]._sum.quantite,
          }
        : null,
      produitPlusVendu: produitPlusVenduDetails
        ? {
            ...produitPlusVenduDetails,
            quantiteVendue: produitPlusVendu[0]._sum.quantite,
          }
        : null,
      weekData,
      monthData,
      yearData,
    });
  } catch (error) {
    console.error("Erreur dans /api/analytics/admin:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
