"use client";

import { useState } from "react";
import { Package, Download, X, Settings } from "lucide-react";
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
  clientName: string;
  clientEmail: string;
  date: string;
  status: "Livré" | "En cours";
  total: number; // Total calculé à partir des items
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      clientName: "Ahmed Benali",
      clientEmail: "ahmed@example.com",
      date: "2024-03-15",
      status: "En cours",
      total: 15000,
      items: [
        { productName: "Produit 1", quantity: 2, color: "Noir", size: "M", price: 7500 },
      ],
    },
    {
      id: 2,
      clientName: "Sara Khedir",
      clientEmail: "sara@example.com",
      date: "2024-03-16",
      status: "En cours",
      total: 7550,
      items: [
        { productName: "Produit 2", quantity: 1, color: "Blanc", size: "L", price: 7550 },
      ],
    },
    {
      id: 3,
      clientName: "Yanis Merad",
      clientEmail: "yanis@example.com",
      date: "2024-03-17",
      status: "En cours",
      total: 22500,
      items: [
        { productName: "Produit 3", quantity: 1, color: "Gris", size: "S", price: 7500 },
        { productName: "Produit 4", quantity: 2, color: "Bleu", size: "M", price: 7500 },
      ],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [showConfirm, setShowConfirm] = useState<number | null>(null); // ID de la commande à confirmer
  const [isClientOpen, setIsClientOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isTotalOpen, setIsTotalOpen] = useState(false);

  const getFilteredOrders = () => {
    const filtered = orders.filter((order) =>
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery)
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

  const handleToggleStatus = (id: number) => {
    const order = orders.find((o) => o.id === id);
    if (order && order.status === "En cours") {
      setShowConfirm(id); // Afficher la confirmation seulement si "En cours"
    }
  };

  const confirmStatusChange = (id: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id && order.status === "En cours"
          ? { ...order, status: "Livré" }
          : order
      )
    );
    setShowConfirm(null); // Fermer la confirmation
    toast.success("Statut mis à jour avec succès !");
  };

  const cancelStatusChange = () => {
    setShowConfirm(null); // Fermer sans changement
  };

  const handleExport = () => {
    const data = filteredOrders.map((order) => ({
      "ID": order.id,
      "Client": order.clientName,
      "Email": order.clientEmail,
      "Date": order.date,
      "Statut": order.status,
      "Total (DA)": order.total.toFixed(2),
      "Articles": order.items.map(item => `${item.productName} (${item.color}, ${item.size}): ${item.quantity} x ${item.price} DA`).join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const headerStyle = { font: { bold: true }, fill: { fgColor: { rgb: "D3D3D3" } }, alignment: { horizontal: "center" } };
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:G1");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle;
    }
    worksheet["!cols"] = [5, 20, 25, 15, 10, 15, 40].map(w => ({ wch: w }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Commandes");
    XLSX.writeFile(workbook, "commandes_chic_et_tendance.xlsx");
    toast.success("Commandes exportées avec succès !");
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
        {/* Titre "Mes Commandes" avec bouton Exporter */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
            <h1
              className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Mes Commandes
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
          Gérez vos commandes facilement et suivez leur statut en temps réel.
        </p>

        {/* Barre de recherche et filtres */}
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-3 w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par client ou ID..."
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

          {/* Filtre Client */}
          <div className="relative w-full sm:w-32">
            <button
              onClick={() => setIsClientOpen(!isClientOpen)}
              className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-xs sm:text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {sortConfig?.key === "clientName" ? (sortConfig.direction === "asc" ? "A-Z" : "Z-A") : "Client"}
            </button>
            {isClientOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => { handleSort("clientName", ""); setIsClientOpen(false); }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Client
                </button>
                <button
                  onClick={() => { handleSort("clientName", "asc"); setIsClientOpen(false); }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  A-Z
                </button>
                <button
                  onClick={() => { handleSort("clientName", "desc"); setIsClientOpen(false); }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Z-A
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
              {sortConfig?.key === "date" ? (sortConfig.direction === "asc" ? "Ancien" : "Récent") : "Date"}
            </button>
            {isDateOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => { handleSort("date", ""); setIsDateOpen(false); }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Date
                </button>
                <button
                  onClick={() => { handleSort("date", "asc"); setIsDateOpen(false); }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Ancien
                </button>
                <button
                  onClick={() => { handleSort("date", "desc"); setIsDateOpen(false); }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Récent
                </button>
              </motion.div>
            )}
          </div>

          {/* Filtre Statut */}
          <div className="relative w-full sm:w-32">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-xs sm:text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {sortConfig?.key === "status" ? (sortConfig.direction === "asc" ? "Livré" : "En cours") : "Statut"}
            </button>
            {isStatusOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => { handleSort("status", ""); setIsStatusOpen(false); }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Statut
                </button>
                <button
                  onClick={() => { handleSort("status", "asc"); setIsStatusOpen(false); }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Livré
                </button>
                <button
                  onClick={() => { handleSort("status", "desc"); setIsStatusOpen(false); }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  En cours
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
              {sortConfig?.key === "total" ? (sortConfig.direction === "asc" ? "Croissant" : "Décroissant") : "Total"}
            </button>
            {isTotalOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => { handleSort("total", ""); setIsTotalOpen(false); }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Total
                </button>
                <button
                  onClick={() => { handleSort("total", "asc"); setIsTotalOpen(false); }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Croissant
                </button>
                <button
                  onClick={() => { handleSort("total", "desc"); setIsTotalOpen(false); }}
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
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg p-4 mb-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Commande #{order.id}</h3>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold shadow-md ${
                      order.status === "Livré"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-1">Client: {order.clientName}</div>
                <div className="text-xs text-gray-600 mb-1">Date: {order.date}</div>
                <div className="text-xs font-semibold text-green-600 mb-2">Total: {order.total.toFixed(2)} DA</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(order.id);
                  }}
                  className={`w-full px-3 py-1 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md text-xs ${
                    order.status === "Livré"
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                  disabled={order.status === "Livré"}
                >
                  <Settings className="h-4 w-4" />
                  Changer
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Image
                width={32}
                height={32}
                src="/images/b.png"
                alt="Aucune commande"
                className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4"
              />
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                Aucune commande trouvée
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
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">ID</th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">Client</th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">Date</th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden lg:table-cell">Statut</th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">Total</th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">#{order.id}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
                      <div>
                        <span className="font-semibold">{order.clientName}</span>
                        <p className="text-xs text-gray-600">{order.clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">{order.date}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm hidden lg:table-cell">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md ${
                          order.status === "Livré"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm font-semibold text-green-600">{order.total.toFixed(2)} DA</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(order.id);
                        }}
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md text-xs sm:text-sm ${
                          order.status === "Livré"
                            ? "bg-gray-500 text-white cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                        }`}
                        disabled={order.status === "Livré"}
                      >
                        <Settings className="h-4 w-4" />
                        Changer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modale de confirmation avec bouton rouge */}
        {showConfirm !== null && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white/30 backdrop-blur-lg border border-gray-200/50 p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[90%] sm:max-w-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Confirmer le changement de statut
              </h3>
              <p className="text-black-600 mb-6 text-sm sm:text-base">
                Confirmez-vous la livraison de la commande #{showConfirm} au client ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelStatusChange}
                  className="bg-gray-200 text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
                >
                  Annuler
                </button>
                <button
                  onClick={() => confirmStatusChange(showConfirm)}
                  className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 text-sm sm:text-base"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Carte détaillée exceptionnelle */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-3xl p-4 sm:p-8 border border-gray-200 overflow-hidden"
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
                <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-4">
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900">Commande #{selectedOrder.id}</h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md mt-2 sm:mt-0 ${
                      selectedOrder.status === "Livré"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Informations client */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">Client :</span>
                    <span className="text-gray-900 font-semibold block text-xs sm:text-sm">{selectedOrder.clientName}</span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">Email :</span>
                    <span className="text-gray-900 block text-xs sm:text-sm">{selectedOrder.clientEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">Date :</span>
                    <span className="text-gray-900 block text-xs sm:text-sm">{selectedOrder.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">Articles :</span>
                    <span className="text-gray-900 font-semibold block text-xs sm:text-sm">{selectedOrder.items.length}</span>
                  </div>
                </div>

                {/* Liste des produits */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Détails des articles</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-b-0"
                      >
                        <div className="flex-1">
                          <span className="text-gray-900 font-medium text-xs sm:text-sm">{item.productName}</span>
                          <p className="text-xs text-gray-600">
                            {item.color}, {item.size} - Quantité : {item.quantity}
                          </p>
                        </div>
                        <span className="text-gray-900 font-semibold text-xs sm:text-sm">
                          {(item.price * item.quantity).toFixed(2)} DA
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-green-50 p-3 sm:p-4 rounded-xl flex justify-between items-center">
                  <span className="text-green-700 font-medium text-sm sm:text-lg">Total de la commande :</span>
                  <span className="text-green-900 font-bold text-lg sm:text-2xl">
                    {selectedOrder.total.toFixed(2)} DA
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Message si aucune commande */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Image
              width={32}
              height={32}
              src="/images/b.png"
              alt="Aucune commande"
              className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4"
            />
            <p className="text-lg sm:text-xl font-semibold text-gray-800">
              Aucune commande trouvée
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
          .animate-fade-in,
          [data-animate] {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}