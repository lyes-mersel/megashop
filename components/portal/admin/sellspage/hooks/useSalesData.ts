import { useState, useEffect, useCallback } from "react";
import { SortConfig, PaginatedApiResponse, SellFromAPI } from "../types";

export function useSalesData() {
  const [sales, setSales] = useState<SellFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      // Add search parameter
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      // Add pagination parameters
      params.append("page", pagination.currentPage.toString());
      params.append("pageSize", pagination.pageSize.toString());

      // Add sorting parameters
      if (sortConfig) {
        params.append("sortBy", sortConfig.key);
        params.append("sortOrder", sortConfig.direction);
      }

      const response = await fetch(`/api/sells?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PaginatedApiResponse<SellFromAPI[]> = await response.json();
      
      setSales(result.data);
      setPagination(result.pagination);
    } catch (err) {
      console.error("Error fetching sales:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortConfig, pagination.currentPage, pagination.pageSize]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleSort = (key: string, direction: "asc" | "desc" | "") => {
    if (direction === "") {
      setSortConfig(null);
    } else {
      setSortConfig({ key, direction });
    }
    // Reset to first page when sorting changes
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Reset to first page when search changes
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination(prev => ({ ...prev, currentPage: 1, pageSize }));
  };

  return {
    sales,
    loading,
    error,
    searchQuery,
    setSearchQuery: handleSearch,
    sortConfig,
    pagination,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    refetch: fetchSales,
  };
} 