"use client";

import { useState } from "react";
import { SellFromAPI } from "@/lib/types/sell.types";
import { useVendorSells } from "@/hooks/useVendorSells";
import SellsHeader from "@/components/portal/vendor/sellspage/SellsHeader";
import SearchAndFilters from "@/components/portal/vendor/sellspage/SearchAndFilters";
import MobileSellsCards from "@/components/portal/vendor/sellspage/MobileSellsCards";
import DesktopSellsTable from "@/components/portal/vendor/sellspage/DesktopSellsTable";
import SellDetailModal from "@/components/portal/vendor/sellspage/SellDetailModal";
import LoadingState from "@/components/portal/vendor/sellspage/LoadingState";
import ErrorState from "@/components/portal/vendor/sellspage/ErrorState";
import Pagination from "@/components/portal/vendor/sellspage/Pagination";

export default function SalesPage() {
  const {
    sells,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    sortConfig,
    setSortConfig,
    filteredSells,
    pagination,
    currentPage,
    setCurrentPage,
    refetch,
  } = useVendorSells();

  const [selectedSell, setSelectedSell] = useState<SellFromAPI | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isQuantityOpen, setIsQuantityOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTotalOpen, setIsTotalOpen] = useState(false);

  const handleSort = (key: string, direction: "asc" | "desc" | "") => {
    if (direction === "") {
      setSortConfig(null);
    } else {
      setSortConfig({ key, direction });
    }
  };

  const handleSellClick = (sell: SellFromAPI) => {
    setSelectedSell(sell);
  };

  const handleCloseModal = () => {
    setSelectedSell(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <ErrorState error={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <SellsHeader sells={filteredSells} onExport={() => {}} />

        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortConfig={sortConfig}
          onSort={handleSort}
          isProductOpen={isProductOpen}
          setIsProductOpen={setIsProductOpen}
          isQuantityOpen={isQuantityOpen}
          setIsQuantityOpen={setIsQuantityOpen}
          isDateOpen={isDateOpen}
          setIsDateOpen={setIsDateOpen}
          isTotalOpen={isTotalOpen}
          setIsTotalOpen={setIsTotalOpen}
        />

        <MobileSellsCards
          sells={filteredSells}
          onSellClick={handleSellClick}
        />

        <DesktopSellsTable
          sells={filteredSells}
          onSellClick={handleSellClick}
        />

        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
          />
        )}

        <SellDetailModal
          selectedSell={selectedSell}
          onClose={handleCloseModal}
        />
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
