"use client";

import { useState } from "react";
import { Store, Download, X } from "lucide-react";
import { Montserrat } from "next/font/google";
import { motion } from "framer-motion";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import Image from "next/image";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

interface Variant {
  color: string;
  size: string;
  quantity: number;
}

interface Sale {
  id: number;
  productName: string;
  quantity: number;
  variants: Variant[];
  clientName: string;
  clientEmail: string;
  date: string;
  total: number;
  productImage: string;
}

export default function SalesPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sales, setSales] = useState<Sale[]>([
    {
      id: 1,
      productName: "Produit 1",
      quantity: 2,
      variants: [{ color: "Noir", size: "M", quantity: 2 }],
      clientName: "Ahmed Benali",
      clientEmail: "ahmed@example.com",
      date: "2024-03-15",
      total: 15000,
      productImage: "/images/f.jpeg",
    },
    {
      id: 2,
      productName: "Produit 2",
      quantity: 1,
      variants: [{ color: "Blanc", size: "L", quantity: 1 }],
      clientName: "Sara Khedir",
      clientEmail: "sara@example.com",
      date: "2024-03-16",
      total: 7550,
      productImage: "/images/g.jpeg",
    },
    {
      id: 3,
      productName: "Produit 3",
      quantity: 3,
      variants: [
        { color: "Gris", size: "S", quantity: 1 },
        { color: "Bleu", size: "M", quantity: 2 },
      ],
      clientName: "Yanis Merad",
      clientEmail: "yanis@example.com",
      date: "2024-03-17",
      total: 22500,
      productImage: "/images/store.png",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isQuantityOpen, setIsQuantityOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTotalOpen, setIsTotalOpen] = useState(false);

  const getFilteredSales = () => {
    const filtered = sales.filter(
      (sale) =>
        sale.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Sale];
        const bValue = b[sortConfig.key as keyof Sale];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const filteredSales = getFilteredSales();

  const handleExport = () => {
    const data = filteredSales.map((sale) => ({
      ID: sale.id,
      Produit: sale.productName,
      Quantité: sale.quantity,
      Variantes: sale.variants
        .map((v) => `${v.color} (${v.size}): ${v.quantity}`)
        .join(", "),
      Client: sale.clientName,
      Email: sale.clientEmail,
      Date: sale.date,
      "Total (DA)": sale.total.toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "D3D3D3" } },
      alignment: { horizontal: "center" },
    };
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:H1");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle;
    }
    worksheet["!cols"] = [5, 20, 10, 30, 20, 25, 15, 15].map((w) => ({
      wch: w,
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventes");
    XLSX.writeFile(workbook, "ventes_chic_et_tendance.xlsx");
    toast.success("Ventes exportées avec succès !");
  };

  const handleSort = (key: string, direction: "asc" | "desc" | "") => {
    if (direction === "") {
      setSortConfig(null);
    } else {
      setSortConfig({ key, direction });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
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

        {/* Barre de recherche et filtres alignés */}
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-3 w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par produit ou client..."
              className="w-full px-4 py-2 sm:py-3 bg-white/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-gradient-to-r focus:from-gray-400 focus:to-black focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 hover:shadow-[0_6px_25px_rgba(0,0,0,0.1)] text-sm sm:text-base"
            />
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 hover:text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filtre Produit */}
          <div className="relative w-full sm:w-32">
            <button
              onClick={() => setIsProductOpen(!isProductOpen)}
              className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-xs sm:text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {sortConfig?.key === "productName"
                ? sortConfig.direction === "asc"
                  ? "A-Z"
                  : "Z-A"
                : "Produit"}
            </button>
            {isProductOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => {
                    handleSort("productName", "");
                    setIsProductOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Produit
                </button>
                <button
                  onClick={() => {
                    handleSort("productName", "asc");
                    setIsProductOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  A-Z
                </button>
                <button
                  onClick={() => {
                    handleSort("productName", "desc");
                    setIsProductOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Z-A
                </button>
              </motion.div>
            )}
          </div>

          {/* Filtre Quantité */}
          <div className="relative w-full sm:w-32">
            <button
              onClick={() => setIsQuantityOpen(!isQuantityOpen)}
              className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-xs sm:text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {sortConfig?.key === "quantity"
                ? sortConfig.direction === "asc"
                  ? "Croissant"
                  : "Décroissant"
                : "Quantité"}
            </button>
            {isQuantityOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => {
                    handleSort("quantity", "");
                    setIsQuantityOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Quantité
                </button>
                <button
                  onClick={() => {
                    handleSort("quantity", "asc");
                    setIsQuantityOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Croissant
                </button>
                <button
                  onClick={() => {
                    handleSort("quantity", "desc");
                    setIsQuantityOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Décroissant
                </button>
              </motion.div>
            )}
          </div>

          {/* Filtre Date */}
          <div className="relative w-full sm:w-32">
            <button
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-xs sm:text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {sortConfig?.key === "date"
                ? sortConfig.direction === "asc"
                  ? "Ancien"
                  : "Récent"
                : "Date"}
            </button>
            {isDateOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => {
                    handleSort("date", "");
                    setIsDateOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Date
                </button>
                <button
                  onClick={() => {
                    handleSort("date", "asc");
                    setIsDateOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Ancien
                </button>
                <button
                  onClick={() => {
                    handleSort("date", "desc");
                    setIsDateOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Récent
                </button>
              </motion.div>
            )}
          </div>

          {/* Filtre Total */}
          <div className="relative w-full sm:w-32">
            <button
              onClick={() => setIsTotalOpen(!isTotalOpen)}
              className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-xs sm:text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {sortConfig?.key === "total"
                ? sortConfig.direction === "asc"
                  ? "Croissant"
                  : "Décroissant"
                : "Total"}
            </button>
            {isTotalOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => {
                    handleSort("total", "");
                    setIsTotalOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Total
                </button>
                <button
                  onClick={() => {
                    handleSort("total", "asc");
                    setIsTotalOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Croissant
                </button>
                <button
                  onClick={() => {
                    handleSort("total", "desc");
                    setIsTotalOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Décroissant
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Affichage en cartes sur mobile */}
        <div className="sm:hidden">
          {filteredSales.length > 0 ? (
            filteredSales.map((sale) => (
              <div
                key={sale.id}
                className="bg-white rounded-xl shadow-lg p-4 mb-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedSale(sale)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    width={30}
                    height={30}
                    src={sale.productImage}
                    alt={sale.productName}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {sale.productName}
                    </h3>
                    <p className="text-xs text-gray-600">{sale.clientName}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  Quantité: {sale.quantity}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  Date: {sale.date}
                </div>
                <div className="text-xs font-semibold text-green-600">
                  Total: {sale.total.toFixed(2)} DA
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Image
                width={100}
                height={100}
                src="/images/not-found.png"
                alt="Aucune vente"
                className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4"
              />
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                Aucune vente trouvée
              </p>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Aucun résultat ne correspond à votre recherche.
              </p>
            </div>
          )}
        </div>

        {/* Affichage en tableau sur desktop */}
        <div className="hidden sm:block bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                    Image
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                    Produit
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                    Quantité
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">
                    Couleurs
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden lg:table-cell">
                    Tailles
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">
                    Client
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden lg:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedSale(sale)}
                  >
                    <td className="px-4 py-2 sm:px-6 sm:py-4">
                      <Image
                        width={32}
                        height={32}
                        src={sale.productImage}
                        alt={sale.productName}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
                      {sale.productName}
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
                      {sale.quantity}
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {sale.variants.map((variant) => (
                          <span
                            key={variant.color}
                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                          >
                            {variant.color}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {sale.variants.map((variant) => (
                          <span
                            key={variant.size}
                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                          >
                            {variant.size}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                      <div>
                        <span className="font-semibold">{sale.clientName}</span>
                        <p className="text-xs text-gray-600">
                          {sale.clientEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                      {sale.date}
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm font-semibold text-green-600">
                      {sale.total.toFixed(2)} DA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Carte détaillée compacte et plus large */}
        {selectedSale && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-2xl p-4 sm:p-6 border border-gray-100"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <button
                onClick={() => setSelectedSale(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                {/* Image du produit */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                  <Image
                    width={100}
                    height={100}
                    src={selectedSale.productImage}
                    alt={selectedSale.productName}
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                </div>
                <div className="flex-grow space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {selectedSale.productName}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-700 font-medium text-xs sm:text-sm">
                        Client :
                      </span>
                      <span className="text-gray-900 font-semibold block text-xs sm:text-sm">
                        {selectedSale.clientName}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-700 font-medium text-xs sm:text-sm">
                        Email :
                      </span>
                      <span className="text-gray-900 block text-xs sm:text-sm">
                        {selectedSale.clientEmail}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-700 font-medium text-xs sm:text-sm">
                        Date :
                      </span>
                      <span className="text-gray-900 block text-xs sm:text-sm">
                        {selectedSale.date}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-700 font-medium text-xs sm:text-sm">
                        Quantité :
                      </span>
                      <span className="text-gray-900 font-semibold block text-xs sm:text-sm">
                        {selectedSale.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg flex justify-between items-center">
                    <span className="text-green-700 font-medium text-xs sm:text-sm">
                      Total :
                    </span>
                    <span className="text-green-900 font-bold text-base sm:text-lg">
                      {selectedSale.total.toFixed(2)} DA
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-700 font-medium block mb-1 text-xs sm:text-sm">
                      Variantes :
                    </span>
                    {selectedSale.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-xs sm:text-sm text-gray-900"
                      >
                        <span>
                          {variant.color} ({variant.size})
                        </span>
                        <span className="font-semibold">
                          {variant.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Message si aucune vente */}
        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <Image
              width={100}
              height={100}
              src="/images/not-found.png"
              alt="Aucune vente"
              className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4"
            />
            <p className="text-lg sm:text-xl font-semibold text-gray-800">
              Aucune vente trouvée
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Aucun résultat ne correspond à votre recherche.
            </p>
          </div>
        )}
      </div>

      {/* Styles CSS */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          [data-animate] {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
