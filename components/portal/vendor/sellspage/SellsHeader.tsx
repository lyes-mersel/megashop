"use client";

import { Store, Download } from "lucide-react";
import { montserrat } from "@/styles/fonts";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { SellFromAPI } from "@/lib/types/sell.types";

interface SellsHeaderProps {
  sells: SellFromAPI[];
  onExport: () => void;
}

export default function SellsHeader({ sells, onExport }: SellsHeaderProps) {
  const handleExport = () => {
    const data = sells.map((sell) => ({
      ID: sell.id,
      Produit: sell.nomProduit,
      Quantité: sell.quantite,
      Couleur: sell.couleur?.nom || "N/A",
      Taille: sell.taille?.nom || "N/A",
      Client: sell.commande.client ? `${sell.commande.client.nom} ${sell.commande.client.prenom}` : "N/A",
      Email: sell.commande.client?.email || "N/A",
      Date: new Date(sell.commande.date).toLocaleDateString("fr-FR"),
      "Prix unitaire (DA)": sell.prixUnit.toFixed(2),
      "Total (DA)": sell.total.toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "D3D3D3" } },
      alignment: { horizontal: "center" },
    };
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:I1");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle;
    }
    worksheet["!cols"] = [5, 20, 10, 15, 15, 25, 25, 15, 15, 15].map((w) => ({
      wch: w,
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventes");
    XLSX.writeFile(workbook, "ventes_chic_et_tendance.xlsx");
    toast.success("Ventes exportées avec succès !");
  };

  return (
    <>
      {/* Titre "Mes Ventes" avec bouton Exporter */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Store className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
          <h1
            className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Mes Ventes
          </h1>
        </div>
        <button
          onClick={handleExport}
          className="bg-black text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all duration-300 shadow-md text-sm sm:text-base"
        >
          <Download className="h-4 w-4 sm:h-5 sm:w-5" />
          Exporter
        </button>
      </div>

      {/* Texte descriptif */}
      <p className="mb-6 text-base sm:text-lg text-gray-700">
        Vous trouverez ici toutes vos ventes effectuées avec leurs détails.
      </p>
    </>
  );
} 