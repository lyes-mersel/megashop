"use client";

import { useState } from "react";
import { AlertTriangle, X, Send, Download } from "lucide-react";
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

interface Report {
  clientName: string;
  clientEmail: string;
  productName: string;
  vendor: string;
  signalText: string;
  date: string;
  status: "En attente" | "Répondu";
  response?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([
    {
      clientName: "Ahmed Benali",
      clientEmail: "ahmed@example.com",
      productName: "Produit 1",
      vendor: "Vendeur A",
      signalText: "Le produit est arrivé endommagé.",
      date: "2024-03-15",
      status: "En attente",
    },
    {
      clientName: "Sara Khedir",
      clientEmail: "sara@example.com",
      productName: "Produit 2",
      vendor: "Vendeur B",
      signalText: "Mauvaise couleur reçue, je voulais du bleu.",
      date: "2024-03-16",
      status: "En attente",
    },
    {
      clientName: "Yanis Merad",
      clientEmail: "yanis@example.com",
      productName: "Produit 3",
      vendor: "Vendeur C",
      signalText: "Livraison trop lente, plus d'une semaine de retard.",
      date: "2024-03-17",
      status: "Répondu",
      response:
        "Nous nous excusons pour le retard. Un remboursement partiel a été effectué.",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [responseText, setResponseText] = useState("");
  const [dateSort, setDateSort] = useState<"asc" | "desc" | "">("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const getFilteredReports = () => {
    let filtered = reports.filter(
      (report) =>
        report.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter) {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    if (dateSort) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateSort === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
    }

    return filtered;
  };

  const filteredReports = getFilteredReports();

  const handleRespond = (report: Report) => {
    if (!responseText.trim()) {
      toast.error("Veuillez entrer une réponse avant d'envoyer.");
      return;
    }
    setReports((prevReports) =>
      prevReports.map((r) =>
        r === report ? { ...r, status: "Répondu", response: responseText } : r
      )
    );
    setResponseText("");
    setSelectedReport(null);
    toast.success("Réponse envoyée avec succès !");
  };

  const handleExport = () => {
    const data = filteredReports.map((report) => ({
      Client: report.clientName,
      Email: report.clientEmail,
      Produit: report.productName,
      Vendeur: report.vendor,
      Signalement: report.signalText,
      Date: report.date,
      Statut: report.status,
      Réponse: report.response || "Aucune",
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
    worksheet["!cols"] = [20, 25, 20, 20, 30, 15, 15, 40].map((w) => ({
      wch: w,
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Signalements");
    XLSX.writeFile(workbook, "signalements.xlsx");
    toast.success("Signalements exportés avec succès !");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Titre "Signalements" avec bouton Exporter */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
            <h1
              className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Signalements
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
          Consultez et gérez les signalements envoyés par vos clients ici.
        </p>

        {/* Barre de recherche et filtres */}
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-3 w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par client, produit ou vendeur..."
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
              className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-xs sm:text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {dateSort === "asc"
                ? "Plus ancien"
                : dateSort === "desc"
                ? "Plus récent"
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
                    setDateSort("");
                    setIsDateOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Date
                </button>
                <button
                  onClick={() => {
                    setDateSort("asc");
                    setIsDateOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Plus ancien
                </button>
                <button
                  onClick={() => {
                    setDateSort("desc");
                    setIsDateOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Plus récent
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
              {statusFilter === "En attente"
                ? "En attente"
                : statusFilter === "Répondu"
                ? "Répondu"
                : "Statut"}
            </button>
            {isStatusOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => {
                    setStatusFilter("");
                    setIsStatusOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Statut
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("En attente");
                    setIsStatusOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  En attente
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("Répondu");
                    setIsStatusOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  Répondu
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Affichage en cartes sur mobile */}
        <div className="sm:hidden">
          {filteredReports.length > 0 ? (
            filteredReports.map((report, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-4 mb-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {report.clientName}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold shadow-md ${
                      report.status === "Répondu"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  Produit: {report.productName}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  Vendeur: {report.vendor}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  Date: {report.date}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Image
                width={32}
                height={32}
                src="/images/not-found.png"
                alt="Aucun signalement"
                className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4"
              />
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                Aucun signalement trouvé
              </p>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Aucun résultat ne correspond à votre recherche ou filtres.
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
                    Client
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">
                    Produit
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden lg:table-cell">
                    Vendeur
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.map((report, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
                      <div>
                        <span className="font-semibold">
                          {report.clientName}
                        </span>
                        <p className="text-xs text-gray-600">
                          {report.clientEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                      {report.productName}
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                      <div>
                        <span className="font-semibold">{report.vendor}</span>
                        <p className="text-xs text-gray-600">
                          {report.clientEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                      {report.date}
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                      <span
                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md ${
                          report.status === "Répondu"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modale détaillée */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
            <motion.div
              className="bg-white p-4 sm:p-8 rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-2xl border border-gray-200"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <div className="space-y-4 sm:space-y-6">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-4">
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
                    Signalement
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md mt-2 sm:mt-0 ${
                      selectedReport.status === "Répondu"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedReport.status}
                  </span>
                </div>

                {/* Détails */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">
                      Client :
                    </span>
                    <span className="text-gray-900 font-semibold block text-xs sm:text-sm">
                      {selectedReport.clientName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">
                      Email :
                    </span>
                    <span className="text-gray-900 block text-xs sm:text-sm">
                      {selectedReport.clientEmail}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">
                      Produit :
                    </span>
                    <span className="text-gray-900 block text-xs sm:text-sm">
                      {selectedReport.productName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">
                      Vendeur :
                    </span>
                    <span className="text-gray-900 block text-xs sm:text-sm">
                      {selectedReport.vendor}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">
                      Date :
                    </span>
                    <span className="text-gray-900 block text-xs sm:text-sm">
                      {selectedReport.date}
                    </span>
                  </div>
                </div>

                {/* Texte du signalement */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <span className="text-gray-700 font-medium block mb-2 text-xs sm:text-sm">
                    Texte du signalement :
                  </span>
                  <p className="text-gray-900 text-xs sm:text-sm">
                    {selectedReport.signalText}
                  </p>
                </div>

                {/* Réponse */}
                {selectedReport.status === "Répondu" ? (
                  <div className="bg-green-50 p-3 sm:p-4 rounded-xl">
                    <span className="text-green-700 font-medium block mb-2 text-xs sm:text-sm">
                      Réponse envoyée :
                    </span>
                    <p className="text-gray-900 text-xs sm:text-sm">
                      {selectedReport.response}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Entrez votre réponse ici..."
                      className="w-full p-3 sm:p-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 text-xs sm:text-sm"
                      rows={4}
                    />
                    <button
                      onClick={() => handleRespond(selectedReport)}
                      className="bg-black text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all duration-300 shadow-md text-sm sm:text-base"
                    >
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      Envoyer la réponse
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Message si aucun signalement */}
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <Image
              width={32}
              height={32}
              src="/images/not-found.png"
              alt="Aucun signalement"
              className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4"
            />
            <p className="text-lg sm:text-xl font-semibold text-gray-800">
              Aucun signalement trouvé
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Aucun résultat ne correspond à votre recherche ou filtres.
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
