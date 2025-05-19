"use client";

import { motion } from "framer-motion";
import { SignalementStatut } from "@prisma/client";

const SearchAndFilters = ({
  searchQuery,
  setSearchQuery,
  dateSort,
  setDateSort,
  statusFilter,
  setStatusFilter,
  isDateOpen,
  setIsDateOpen,
  isStatusOpen,
  setIsStatusOpen,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  dateSort: "asc" | "desc" | "";
  setDateSort: (value: "asc" | "desc" | "") => void;
  statusFilter: SignalementStatut | "";
  setStatusFilter: (value: SignalementStatut | "") => void;
  isDateOpen: boolean;
  setIsDateOpen: (value: boolean) => void;
  isStatusOpen: boolean;
  setIsStatusOpen: (value: boolean) => void;
}) => (
  <div className="mb-8 flex flex-col sm:flex-row items-center gap-3 w-full">
    <div className="relative w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Rechercher par client, produit ou contenu signalement"
        className="w-full px-4 py-2 sm:py-3 bg-white/80 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 text-sm sm:text-base"
      />
      <svg
        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 absolute right-3 top-1/2 transform -translate-y-1/2"
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
    <div className="relative w-full sm:w-32">
      <button
        onClick={() => setIsDateOpen(!isDateOpen)}
        className="w-full px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-xl shadow-sm text-gray-800 text-xs sm:text-sm hover:bg-gray-50 transition-all duration-300"
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
          className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <button
            onClick={() => {
              setDateSort("");
              setIsDateOpen(false);
            }}
            className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100"
          >
            Date
          </button>
          <button
            onClick={() => {
              setDateSort("asc");
              setIsDateOpen(false);
            }}
            className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100"
          >
            Plus ancien
          </button>
          <button
            onClick={() => {
              setDateSort("desc");
              setIsDateOpen(false);
            }}
            className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100"
          >
            Plus récent
          </button>
        </motion.div>
      )}
    </div>
    <div className="relative w-full sm:w-32">
      <button
        onClick={() => setIsStatusOpen(!isStatusOpen)}
        className="w-full px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-xl shadow-sm text-gray-800 text-xs sm:text-sm hover:bg-gray-50 transition-all duration-300"
      >
        {statusFilter || "Statut"}
      </button>
      {isStatusOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <button
            onClick={() => {
              setStatusFilter("");
              setIsStatusOpen(false);
            }}
            className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100"
          >
            Statut
          </button>
          {Object.values(SignalementStatut).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setIsStatusOpen(false);
              }}
              className="w-full px-4 py-2 text-gray-800 text-xs sm:text-sm hover:bg-gray-100"
            >
              {status}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  </div>
);

export default SearchAndFilters;
