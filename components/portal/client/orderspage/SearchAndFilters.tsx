"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrderFromAPI } from "@/lib/types/order.types";

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortConfig: { key: keyof OrderFromAPI; direction: "asc" | "desc" } | null;
  handleSort: (key: keyof OrderFromAPI, direction: "asc" | "desc" | "") => void;
  isDateOpen: boolean;
  isTotalOpen: boolean;
  toggleDateDropdown: () => void;
  toggleTotalDropdown: () => void;
  closeDropdowns: () => void;
}

export default function SearchAndFilters({
  searchQuery,
  setSearchQuery,
  sortConfig,
  handleSort,
  isDateOpen,
  isTotalOpen,
  toggleDateDropdown,
  toggleTotalDropdown,
  closeDropdowns,
}: SearchAndFiltersProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const totalDropdownRef = useRef<HTMLDivElement>(null);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  // Handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node) &&
        totalDropdownRef.current &&
        !totalDropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeDropdowns]);

  // Clear search with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setSearchQuery]);

  return (
    <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <input
          ref={searchRef}
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Rechercher par ID ou produit..."
          className={`w-full px-4 py-2 sm:py-3 bg-white/80 backdrop-blur-md border ${
            isSearchFocused ? "border-blue-400" : "border-gray-300"
          } rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-gradient-to-r focus:from-blue-400 focus:to-blue-600 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 hover:shadow-[0_6px_25px_rgba(0,0,0,0.1)] text-sm sm:text-base`}
        />
        {localSearch && (
          <button
            type="button"
            onClick={() => {
              setLocalSearch("");
              setSearchQuery("");
            }}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Clear search"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
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
      </form>

      {/* Filtre Date */}
      <div className="relative w-full sm:w-32" ref={dateDropdownRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleDateDropdown();
            // Close the other dropdown
            if (isTotalOpen) toggleTotalDropdown();
          }}
          className={`w-full px-4 py-2 sm:py-3 bg-gradient-to-r ${
            sortConfig?.key === "date"
              ? "from-blue-50 to-blue-100/80 border-blue-300"
              : "from-white to-gray-100/80 border-gray-300"
          } backdrop-blur-md border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between`}
        >
          <span>
            {sortConfig?.key === "date"
              ? sortConfig.direction === "asc"
                ? "Ancien"
                : "Récent"
              : "Date"}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isDateOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <AnimatePresence>
          {isDateOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("date", "");
                  toggleDateDropdown();
                }}
                className={`w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200 ${
                  !sortConfig?.key || sortConfig?.key !== "date"
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                Date
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("date", "asc");
                  toggleDateDropdown();
                }}
                className={`w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200 ${
                  sortConfig?.key === "date" && sortConfig.direction === "asc"
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                Ancien
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("date", "desc");
                  toggleDateDropdown();
                }}
                className={`w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200 ${
                  sortConfig?.key === "date" && sortConfig.direction === "desc"
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                Récent
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filtre Total */}
      <div className="relative w-full sm:w-32" ref={totalDropdownRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTotalDropdown();
            // Close the other dropdown
            if (isDateOpen) toggleDateDropdown();
          }}
          className={`w-full px-4 py-2 sm:py-3 bg-gradient-to-r ${
            sortConfig?.key === "montant"
              ? "from-blue-50 to-blue-100/80 border-blue-300"
              : "from-white to-gray-100/80 border-gray-300"
          } backdrop-blur-md border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between`}
        >
          <span>
            {sortConfig?.key === "montant"
              ? sortConfig.direction === "asc"
                ? "Croissant"
                : "Décroissant"
              : "Total"}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isTotalOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <AnimatePresence>
          {isTotalOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("montant", "");
                  toggleTotalDropdown();
                }}
                className={`w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200 ${
                  !sortConfig?.key || sortConfig?.key !== "montant"
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                Total
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("montant", "asc");
                  toggleTotalDropdown();
                }}
                className={`w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200 ${
                  sortConfig?.key === "montant" &&
                  sortConfig.direction === "asc"
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                Croissant
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("montant", "desc");
                  toggleTotalDropdown();
                }}
                className={`w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200 ${
                  sortConfig?.key === "montant" &&
                  sortConfig.direction === "desc"
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                Décroissant
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
