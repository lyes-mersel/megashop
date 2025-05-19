import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationType } from "@prisma/client";

interface Filters {
  type: NotificationType | "";
  status: "lu" | "nonlu" | "";
  sortBy: "asc" | "desc" | "";
  page: number;
  pageSize: number;
}

interface NotificationFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
}

export default function NotificationFilters({
  filters,
  onFilterChange,
}: NotificationFiltersProps) {
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const typeOptions = [
    { value: "", label: "Type" },
    { value: NotificationType.DEFAULT, label: "Défaut" },
    { value: NotificationType.MESSAGE, label: "Message" },
    { value: NotificationType.COMMANDE, label: "Commande" },
    { value: NotificationType.LIVRAISON, label: "Livraison" },
    { value: NotificationType.PAIEMENT, label: "Paiement" },
    { value: NotificationType.SIGNALEMENT, label: "Signalement" },
    { value: NotificationType.EVALUATION, label: "Évaluation" },
  ];

  const statusOptions = [
    { value: "", label: "Statut" },
    { value: "lu", label: "Lu" },
    { value: "nonlu", label: "Non lu" },
  ];

  const sortOptions = [
    { value: "", label: "Date" },
    { value: "desc", label: "Plus récent" },
    { value: "asc", label: "Plus ancien" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
      {/* Type Filter */}
      <div className="relative w-full sm:w-32">
        <button
          onClick={() => setIsTypeOpen(!isTypeOpen)}
          className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
        >
          {typeOptions.find((opt) => opt.value === filters.type)?.label}
        </button>
        <AnimatePresence>
          {isTypeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
            >
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onFilterChange({
                      type: option.value as NotificationType | "",
                    });
                    setIsTypeOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Filter */}
      <div className="relative w-full sm:w-32">
        <button
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
        >
          {statusOptions.find((opt) => opt.value === filters.status)?.label}
        </button>
        <AnimatePresence>
          {isStatusOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
            >
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onFilterChange({
                      status: option.value as "lu" | "nonlu" | "",
                    });
                    setIsStatusOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sort Filter */}
      <div className="relative w-full sm:w-32">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
        >
          {sortOptions.find((opt) => opt.value === filters.sortBy)?.label}
        </button>
        <AnimatePresence>
          {isSortOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onFilterChange({
                      sortBy: option.value as "asc" | "desc" | "",
                    });
                    setIsSortOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
