"use client";

import { Store, Download } from "lucide-react";
import { montserrat } from "@/styles/fonts";

interface PageHeaderProps {
  onExport: () => void;
}

export default function PageHeader({ onExport }: PageHeaderProps) {
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
          onClick={onExport}
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