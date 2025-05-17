"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSliders } from "react-icons/fi";

import BreadcrumbShop from "@/components/store/catalogpage/BreadcrumbShop";
import CatalogProducts from "@/components/store/catalogpage/CatalogProducts";
import Filters from "@/components/store/catalogpage/filters";
import { ProductFromAPI } from "@/lib/types/product.types";
import { PaginatedApiResponse } from "@/lib/types/apiResponse.types";

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<ProductFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 9,
  });

  // Local filter states for desktop
  const [localGender, setLocalGender] = useState<string | null>(
    searchParams.get("gender")
  );
  const [localCategory, setLocalCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get("minPrice") || "0"),
    parseInt(searchParams.get("maxPrice") || "20000"),
  ]);
  const [localColor, setLocalColor] = useState<string | null>(
    searchParams.get("color")
  );
  const [localSize, setLocalSize] = useState<string | null>(
    searchParams.get("size")
  );

  // Sync local state with searchParams when they change
  useEffect(() => {
    setLocalGender(searchParams.get("gender"));
    setLocalCategory(searchParams.get("category"));
    setLocalPriceRange([
      parseInt(searchParams.get("minPrice") || "0"),
      parseInt(searchParams.get("maxPrice") || "20000"),
    ]);
    setLocalColor(searchParams.get("color"));
    setLocalSize(searchParams.get("size"));
  }, [searchParams]);

  // Fetch products based on URL search parameters
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const url = `/api/products/search?${searchParams.toString()}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }
        const jsonData: PaginatedApiResponse<ProductFromAPI[]> =
          await response.json();
        setAllProducts(jsonData.data);
        setPagination(jsonData.pagination);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  // Handler functions to update URL parameters
  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    router.push(`?${newSearchParams.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (value: string) => {
    const sortOptions = [
      { value: "most-popular", sortBy: "noteMoyenne", sortOrder: "desc" },
      { value: "low-price", sortBy: "prix", sortOrder: "asc" },
      { value: "high-price", sortBy: "prix", sortOrder: "desc" },
      { value: "newest", sortBy: "dateCreation", sortOrder: "desc" },
      { value: "oldest", sortBy: "dateCreation", sortOrder: "asc" },
    ];
    const selectedOption = sortOptions.find((option) => option.value === value);
    if (selectedOption) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("sortBy", selectedOption.sortBy);
      newSearchParams.set("sortOrder", selectedOption.sortOrder);
      newSearchParams.set("page", "1");
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handleApplyFilters = ({
    gender,
    category,
    priceRange,
    color,
    size,
  }: {
    gender: string | null;
    category: string | null;
    priceRange: [number, number];
    color: string | null;
    size: string | null;
  }) => {
    const newSearchParams = new URLSearchParams(searchParams);
    // Preserve existing query parameter if present
    const query = searchParams.get("query");
    if (query) newSearchParams.set("query", query);
    // Update filter parameters
    if (gender) newSearchParams.set("gender", gender);
    else newSearchParams.delete("gender");
    if (category) newSearchParams.set("category", category);
    else newSearchParams.delete("category");
    newSearchParams.set("minPrice", priceRange[0].toString());
    newSearchParams.set("maxPrice", priceRange[1].toString());
    if (color) newSearchParams.set("color", color);
    else newSearchParams.delete("color");
    if (size) newSearchParams.set("size", size);
    else newSearchParams.delete("size");
    newSearchParams.set("page", "1");
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleResetFilters = () => {
    const newSearchParams = new URLSearchParams();
    router.push(`?${newSearchParams.toString()}`);
    console.log("newSearchParams", newSearchParams.toString());
  };

  return (
    <main className="py-5">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[270px] max-w-[270px] min-h-[1810px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filtres</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters
              localGender={localGender}
              setLocalGender={setLocalGender}
              localCategory={localCategory}
              setLocalCategory={setLocalCategory}
              localPriceRange={localPriceRange}
              setLocalPriceRange={setLocalPriceRange}
              localColor={localColor}
              setLocalColor={setLocalColor}
              localSize={localSize}
              setLocalSize={setLocalSize}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </div>

          <CatalogProducts
            products={allProducts}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
            isLoading={isLoading}
            selectedGender={searchParams.get("gender")}
            selectedCategory={searchParams.get("category")}
            priceRange={[
              parseInt(searchParams.get("minPrice") || "0"),
              parseInt(searchParams.get("maxPrice") || "20000"),
            ]}
            selectedColor={searchParams.get("color")}
            selectedSize={searchParams.get("size")}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </main>
  );
}
