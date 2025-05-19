import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { auth } from "@/lib/auth";
import { UserRole, CommandeStatut } from "@prisma/client";

export async function GET(_req: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

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
          prix: true,
        },
      }),
      prisma.produit.findFirst({
        orderBy: { noteMoyenne: "asc" },
        where: { noteMoyenne: { gt: 0 } },
        select: {
          id: true,
          nom: true,
          noteMoyenne: true,
          prix: true,
        },
      }),
      prisma.commande.findMany({
        where: { statut: CommandeStatut.LIVREE },
        include: { lignesCommande: true },
      }),
    ]);

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
      meilleurProduit,
      pireProduit,
      weekData,
      monthData,
      yearData,
    });
  } catch (error) {
    console.error("Erreur dans /api/stats:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
