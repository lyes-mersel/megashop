"use client";

import { useState } from "react";
import { Package, Download, X } from "lucide-react";
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

interface OrderItem {
  productName: string;
  quantity: number;
  color: string;
  size: string;
  price: number; // Prix unitaire en DA
}

interface Order {
  id: number;
  vendorName: string; // Nom et prénom du vendeur
  vendorEmail: string; // Email du vendeur
  date: string;
  total: number; // Total calculé à partir des items
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      vendorName: "Karim Belkacem",
      vendorEmail: "karim.belkacem@example.com",
      date: "2024-03-15",
      total: 15000,
      items: [
        {
          productName: "Produit 1",
          quantity: 2,
          color: "Noir",
          size: "M",
          price: 7500,
        },
      ],
    },
    {
      id: 2,
      vendorName: "Amina Cherif",
      vendorEmail: "amina.cherif@example.com",
      date: "2024-03-16",
      total: 7550,
      items: [
        {
          productName: "Produit 2",
          quantity: 1,
          color: "Blanc",
          size: "L",
          price: 7550,
        },
      ],
    },
    {
      id: 3,
      vendorName: "Sofiane Merad",
      vendorEmail: "sofiane.merad@example.com",
      date: "2024-03-17",
      total: 22500,
      items: [
        {
          productName: "Produit 3",
          quantity: 1,
          color: "Gris",
          size: "S",
          price: 7500,
        },
        {
          productName: "Produit 4",
          quantity: 2,
          color: "Bleu",
          size: "M",
          price: 7500,
        },
      ],
    },
    {
      id: 4,
      vendorName: "Leila Khedir",
      vendorEmail: "leila.khedir@example.com",
      date: "2024-03-18",
      total: 18000,
      items: [
        {
          productName: "Produit 5",
          quantity: 3,
          color: "Rouge",
          size: "L",
          price: 6000,
        },
      ],
    },
    {
      id: 5,
      vendorName: "Yanis Haddad",
      vendorEmail: "yanis.haddad@example.com",
      date: "2024-03-19",
      total: 12000,
      items: [
        {
          productName: "Produit 6",
          quantity: 2,
          color: "Vert",
          size: "M",
          price: 6000,
        },
      ],
    },
    {
      id: 6,
      vendorName: "Nadia Benali",
      vendorEmail: "nadia.benali@example.com",
      date: "2024-03-20",
      total: 9000,
      items: [
        {
          productName: "Produit 7",
          quantity: 1,
          color: "Jaune",
          size: "S",
          price: 9000,
        },
      ],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTotalOpen, setIsTotalOpen] = useState(false);

  const getFilteredOrders = () => {
    const filtered = orders.filter(
      (order) =>
        order.id.toString().includes(searchQuery) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Order];
        const bValue = b[sortConfig.key as keyof Order];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const handleExport = () => {
    const data = filteredOrders.map((order) => ({
      ID: order.id,
      "Nom du Vendeur": order.vendorName,
      "Email du Vendeur": order.vendorEmail,
      Date: order.date,
      "Total (DA)": order.total.toFixed(2),
      Articles: order.items
        .map(
          (item) =>
            `${item.productName} (${item.color}, ${item.size}): ${item.quantity} x ${item.price} DA`
        )
        .join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "D3D3D3" } },
      alignment: { horizontal: "center" },
    };
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:F1");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle;
    }
    worksheet["!cols"] = [5, 20, 25, 15, 15, 40].map((w) => ({ wch: w }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historique Commandes");
    XLSX.writeFile(workbook, "historique_commandes.xlsx");
    toast.success("Historique des commandes exporté avec succès !");
  };

  const handleSort = (key: string, direction: "asc" | "desc" | "") => {
    if (direction === "") {
      setSortConfig(null);
    } else {
      setSortConfig({ key, direction });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:pl-10 sm:pr-10">
      <div className="max-w-7xl mx-auto">
        {/* Titre "Historique des Commandes" avec bouton Exporter */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
            <h1
              className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Historique des Commandes
            </h1>
          </div>
          <button
            onClick={handleExport}
            className="w-full sm:w-auto bg-black text-white px-4 sm:px-6 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300 shadow-md text-sm sm:text-base"
          >
            <Download className="h-4 w-4 sm:h-5 sm:w-5" />
            Exporter
          </button>
        </div>

        {/* Texte descriptif */}
        <p className="mb-6 text-base sm:text-lg text-gray-700">
          Consultez l’historique de vos commandes et suivez vos achats.
        </p>

        {/* Barre de recherche et filtres */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par ID ou produit..."
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

          {/* Filtre Date */}
          <div className="relative w-full sm:w-32">
            <button
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
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
                  className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Date
                </button>
                <button
                  onClick={() => {
                    handleSort("date", "asc");
                    setIsDateOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Ancien
                </button>
                <button
                  onClick={() => {
                    handleSort("date", "desc");
                    setIsDateOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
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
              className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
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
                  className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Total
                </button>
                <button
                  onClick={() => {
                    handleSort("total", "asc");
                    setIsTotalOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Croissant
                </button>
                <button
                  onClick={() => {
                    handleSort("total", "desc");
                    setIsTotalOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Décroissant
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Conteneur flex pour le tableau et l'image */}
        {filteredOrders.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Tableau réduit (100% sur mobile, 60% sur desktop) */}
            <div className="w-full lg:w-3/5 bg-white rounded-xl shadow-lg overflow-hidden">
              {/* En-tête du tableau (fixe) */}
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                      ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                      Nom du Vendeur
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
              </table>
              {/* Corps du tableau avec défilement (5 lignes maximum) */}
              <div className="max-h-[20rem] overflow-y-auto">
                <table className="w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                          <div>
                            <span className="font-semibold">
                              {order.vendorName}
                            </span>
                            <p className="text-xs text-gray-600">
                              {order.vendorEmail}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                          {order.date}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-green-600">
                          {order.total.toFixed(2)} DA
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Image (100% sur mobile, 40% sur desktop) */}
            <div className="w-full lg:w-2/5 flex items-center justify-center">
              <Image
                height={90}
                width={90}
                src="/images/a.png"
                alt="Historique des commandes"
                className="w-full sm:w-90 h-auto sm:h-90 object-contain"
              />
            </div>
          </div>
        ) : (
          /* Message si aucune commande */
          <div className="text-center py-12">
            <Image
              height={32}
              width={32}
              src="/images/b.png"
              alt="Aucune commande"
              className="mx-auto w-24 sm:w-32 h-24 sm:h-32 mb-4"
            />
            <p className="text-lg sm:text-xl font-semibold text-gray-800">
              Aucune commande trouvée
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Vous n’avez pas encore effectué de commande.
            </p>
          </div>
        )}

        {/* Carte détaillée exceptionnelle */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-[90%] sm:max-w-3xl w-full p-4 sm:p-8 border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <div className="space-y-4 sm:space-y-6">
                {/* En-tête de la commande */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-3 sm:pb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Commande #{selectedOrder.id}
                  </h3>
                </div>

                {/* Informations vendeur */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <div>
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      Nom du Vendeur :
                    </span>
                    <span className="text-gray-900 font-semibold block text-sm sm:text-base">
                      {selectedOrder.vendorName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      Email :
                    </span>
                    <span className="text-gray-900 block text-sm sm:text-base">
                      {selectedOrder.vendorEmail}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      Date :
                    </span>
                    <span className="text-gray-900 block text-sm sm:text-base">
                      {selectedOrder.date}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      Articles :
                    </span>
                    <span className="text-gray-900 font-semibold block text-sm sm:text-base">
                      {selectedOrder.items.length}
                    </span>
                  </div>
                </div>

                {/* Liste des produits */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Détails des articles
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-2 last:border-b-0"
                      >
                        <div className="flex-1">
                          <span className="text-gray-900 font-medium text-sm sm:text-base">
                            {item.productName}
                          </span>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {item.color}, {item.size} - Quantité :{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <span className="text-gray-900 font-semibold text-sm sm:text-base mt-1 sm:mt-0">
                          {(item.price * item.quantity).toFixed(2)} DA
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-green-50 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-green-700 font-medium text-base sm:text-lg">
                    Total de la commande :
                  </span>
                  <span className="text-green-900 font-bold text-lg sm:text-2xl">
                    {selectedOrder.total.toFixed(2)} DA
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
