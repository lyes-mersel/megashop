"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: PaginationProps) {
  const [visiblePages, setVisiblePages] = useState<(number | string)[]>([]);

  useEffect(() => {
    const calculateVisiblePages = () => {
      const newVisiblePages: (number | string)[] = [];

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          newVisiblePages.push(i);
        }
      } else {
        newVisiblePages.push(1);

        if (currentPage <= 3) {
          newVisiblePages.push(2, 3, 4, 5, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
          newVisiblePages.push(
            "...",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
          );
        } else {
          newVisiblePages.push(
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages
          );
        }
      }

      setVisiblePages(newVisiblePages);
    };

    calculateVisiblePages();
  }, [currentPage, totalPages]);

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="mt-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-sm text-gray-600">
        Affichage de <span className="font-medium">{startItem}</span> à{" "}
        <span className="font-medium">{endItem}</span> sur{" "}
        <span className="font-medium">{totalItems}</span> notifications
      </p>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all duration-200 ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          }`}
          aria-label="Page précédente"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            ) : (
              <motion.button
                key={`page-${page}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => typeof page === "number" && onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all duration-200 ${
                  currentPage === page
                    ? "bg-blue-500 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </motion.button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all duration-200 ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          }`}
          aria-label="Page suivante"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
