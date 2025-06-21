"use client";

import { motion } from "framer-motion";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortConfig: {
    key: string;
    direction: "asc" | "desc";
  } | null;
  onSort: (key: string, direction: "asc" | "desc" | "") => void;
  isProductOpen: boolean;
  setIsProductOpen: (open: boolean) => void;
  isQuantityOpen: boolean;
  setIsQuantityOpen: (open: boolean) => void;
  isDateOpen: boolean;
  setIsDateOpen: (open: boolean) => void;
  isTotalOpen: boolean;
  setIsTotalOpen: (open: boolean) => void;
}

export default function SearchAndFilters({
  searchQuery,
  onSearchChange,
  sortConfig,
  onSort,
  isProductOpen,
  setIsProductOpen,
  isQuantityOpen,
  setIsQuantityOpen,
  isDateOpen,
  setIsDateOpen,
  isTotalOpen,
  setIsTotalOpen,
}: SearchAndFiltersProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row items-center gap-3 w-full">
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
          {sortConfig?.key === "nomProduit"
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
                onSort("nomProduit", "");
                setIsProductOpen(false);
              }}
              className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
            >
              Produit
            </button>
            <button
              onClick={() => {
                onSort("nomProduit", "asc");
                setIsProductOpen(false);
              }}
              className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
            >
              A-Z
            </button>
            <button
              onClick={() => {
                onSort("nomProduit", "desc");
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
          {sortConfig?.key === "quantite"
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
                onSort("quantite", "");
                setIsQuantityOpen(false);
              }}
              className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
            >
              Quantité
            </button>
            <button
              onClick={() => {
                onSort("quantite", "asc");
                setIsQuantityOpen(false);
              }}
              className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
            >
              Croissant
            </button>
            <button
              onClick={() => {
                onSort("quantite", "desc");
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
                onSort("date", "");
                setIsDateOpen(false);
              }}
              className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
            >
              Date
            </button>
            <button
              onClick={() => {
                onSort("date", "asc");
                setIsDateOpen(false);
              }}
              className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
            >
              Ancien
            </button>
            <button
              onClick={() => {
                onSort("date", "desc");
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
                onSort("total", "");
                setIsTotalOpen(false);
              }}
              className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
            >
              Total
            </button>
            <button
              onClick={() => {
                onSort("total", "asc");
                setIsTotalOpen(false);
              }}
              className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200"
            >
              Croissant
            </button>
            <button
              onClick={() => {
                onSort("total", "desc");
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
  );
} 