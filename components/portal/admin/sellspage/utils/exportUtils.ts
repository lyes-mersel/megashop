import * as XLSX from "xlsx";
import { SellFromAPI } from "../types";
import { toast } from "sonner";
import { extractDateString } from "@/lib/utils";

export const exportSalesToExcel = (sales: SellFromAPI[]) => {
  const data = sales.map((sale) => ({
    ID: sale.id,
    Produit: sale.nomProduit,
    Quantité: sale.quantite,
    "Prix Unitaire (DA)": sale.prixUnit.toFixed(2),
    "Total (DA)": sale.total.toFixed(2),
    Couleur: sale.couleur?.nom || "N/A",
    Taille: sale.taille?.nom || "N/A",
    Client: sale.commande.client ? `${sale.commande.client.nom} ${sale.commande.client.prenom}` : "N/A",
    Email: sale.commande.client?.email || "N/A",
    Téléphone: sale.commande.client?.tel || "N/A",
    "Date de commande": extractDateString(sale.commande.date),
    Statut: sale.commande.statut,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const headerStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "D3D3D3" } },
    alignment: { horizontal: "center" },
  };
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:L1");
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;
    worksheet[cellAddress].s = headerStyle;
  }
  worksheet["!cols"] = [5, 25, 10, 15, 15, 12, 12, 20, 25, 15, 15, 12].map((w) => ({
    wch: w,
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ventes");
  XLSX.writeFile(workbook, "ventes_chic_et_tendance.xlsx");
  toast.success("Ventes exportées avec succès !");
}; 