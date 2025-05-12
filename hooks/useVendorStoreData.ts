import { useState, useEffect } from "react";

// Utils
import {
  fetchDataFromAPI,
  fetchPaginatedDataFromAPI,
} from "@/lib/utils/fetchData";

// Types
import { CategoryFromAPI } from "@/lib/types/category.types";
import { ColorFromAPI } from "@/lib/types/color.types";
import { GenderFromAPI } from "@/lib/types/gender.types";
import { SizeFromAPI } from "@/lib/types/size.types";
import { ProductFromAPI } from "@/lib/types/product.types";
import { DEFAULT_SHOP_PAGE_SIZE } from "@/lib/constants/settings";
import { Pagination } from "@/lib/types/apiResponse.types";

interface StoreData {
  categories: CategoryFromAPI[];
  colors: ColorFromAPI[];
  genders: GenderFromAPI[];
  sizes: SizeFromAPI[];
  products: ProductFromAPI[];
  totalProducts: number;
  isLoading: boolean;
  error: string | null;
}

export const useVendorStoreData = () => {
  const [storeData, setStoreData] = useState<StoreData>({
    categories: [],
    colors: [],
    genders: [],
    sizes: [],
    products: [],
    totalProducts: 0,
    isLoading: true,
    error: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: DEFAULT_SHOP_PAGE_SIZE,
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [categoriesRes, colorsRes, gendersRes, sizesRes] =
          await Promise.all([
            fetchDataFromAPI<CategoryFromAPI[]>("/api/metadata/categories"),
            fetchDataFromAPI<ColorFromAPI[]>("/api/metadata/colors"),
            fetchDataFromAPI<GenderFromAPI[]>("/api/metadata/genders"),
            fetchDataFromAPI<SizeFromAPI[]>("/api/metadata/sizes"),
          ]);

        setStoreData((prev) => ({
          ...prev,
          categories: categoriesRes.data || [],
          colors: colorsRes.data || [],
          genders: gendersRes.data || [],
          sizes: sizesRes.data || [],
          isLoading: false,
        }));
      } catch {
        setStoreData((prev) => ({
          ...prev,
          error: "Failed to fetch metadata",
          isLoading: false,
        }));
      }
    };

    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setStoreData((prev) => ({ ...prev, isLoading: true }));
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        pageSize: pagination.pageSize.toString(),
        sortBy: "dateCreation",
        sortOrder: "desc",
      });
      if (searchQuery) params.set("query", searchQuery);

      const result = await fetchPaginatedDataFromAPI<ProductFromAPI[]>(
        `/api/products/mine?${params.toString()}`
      );

      setStoreData((prev) => ({
        ...prev,
        products: result.data?.data || [],
        totalProducts: result.data?.pagination.totalItems || 0,
        isLoading: false,
        error: result.error || null,
      }));

      setPagination({
        totalItems: result.data?.pagination.totalItems || 0,
        totalPages: result.data?.pagination.totalPages || 0,
        currentPage: result.data?.pagination.currentPage || 1,
        pageSize: result.data?.pagination.pageSize || DEFAULT_SHOP_PAGE_SIZE,
      });
    };

    fetchProducts();
  }, [searchQuery, pagination.currentPage, pagination.pageSize, refresh]);

  return {
    ...storeData,
    searchQuery,
    setSearchQuery,
    pagination,
    setPagination,
    setRefresh,
  };
};
