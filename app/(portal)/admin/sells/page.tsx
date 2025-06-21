"use client";

import { useState } from "react";
import {
  PageHeader,
  SearchAndFilters,
  MobileSalesCards,
  DesktopSalesTable,
  SaleDetailModal,
  LoadingState,
  ErrorState,
  Pagination,
  useSalesData,
  exportSalesToExcel,
  SellFromAPI,
} from "@/components/portal/admin/sellspage";

export default function SalesPage() {
  const {
    sales,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    sortConfig,
    pagination,
    handleSort,
    handlePageChange,
    refetch,
  } = useSalesData();

  const [selectedSale, setSelectedSale] = useState<SellFromAPI | null>(null);

  const handleExport = () => {
    exportSalesToExcel(sales);
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader onExport={handleExport} />

        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        {loading && <LoadingState />}

        {error && <ErrorState error={error} onRetry={handleRetry} />}

        {!loading && !error && (
          <>
            <MobileSalesCards
              sales={sales}
              onSaleClick={setSelectedSale}
            />

            <DesktopSalesTable
              sales={sales}
              onSaleClick={setSelectedSale}
            />

            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}

        <SaleDetailModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
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
