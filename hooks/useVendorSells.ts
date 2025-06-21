"use client";

import { useState, useEffect } from "react";
import { SellFromAPI } from "@/lib/types/sell.types";
import { PaginatedApiResponse } from "@/lib/types/apiResponse.types";

interface UseVendorSellsReturn {
  sells: SellFromAPI[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortConfig: {
    key: string;
    direction: "asc" | "desc";
  } | null;
  setSortConfig: (config: { key: string; direction: "asc" | "desc" } | null) => void;
  filteredSells: SellFromAPI[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  } | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  refetch: () => void;
}

export function useVendorSells(): UseVendorSellsReturn {
  const [sells, setSells] = useState<SellFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  } | null>(null);

  const fetchSells = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (sortConfig) {
        params.append("sortBy", sortConfig.key);
        params.append("sortOrder", sortConfig.direction);
      }
      params.append("page", currentPage.toString());
      params.append("pageSize", "10"); // Default page size

      const response = await fetch(`/api/sells/me?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PaginatedApiResponse<SellFromAPI[]> = await response.json();
      
      setSells(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Error fetching sells:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSells();
  }, [searchQuery, sortConfig, currentPage]);

  const filteredSells = sells;

  const refetch = () => {
    fetchSells();
  };

  return {
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
  };
} 