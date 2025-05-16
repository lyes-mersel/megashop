"use client";

import { useEffect, useRef, useState } from "react";

// Types
import { ProductFromAPI } from "@/lib/types/product.types";

// Data utils
import { fetchPaginatedDataFromAPI } from "@/lib/utils/fetchData";
import ProductListSec from "@/components/common/ProductListSec";
import Image from "next/image";

export default function LastArrivals() {
  const hasFetched = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [newProducts, setNewProducts] = useState<ProductFromAPI[] | null>(null);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchProducts = async () => {
      try {
        const newProductsResult = await fetchPaginatedDataFromAPI<
          ProductFromAPI[]
        >(`/api/products?sortBy=dateCreation&sortOrder=desc&page=1&pageSize=4`);

        if (
          newProductsResult.error ||
          !newProductsResult.data?.data ||
          newProductsResult.error ||
          !newProductsResult.data?.data
        ) {
          setHasError(true);
        } else {
          setNewProducts(newProductsResult.data.data);
        }
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center py-20 gap-4 text-gray-700">
        <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <p className="text-lg font-medium">Chargement des produits...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center py-20 gap-4 text-[#f74951]">
        {/* Error icon: Circle with an X mark */}
        <Image
          src="/icons/error.png"
          alt="Error Icon"
          width={50}
          height={50}
          className="h-15 w-15"
        />
        <p className="text-lg font-semibold text-center my-5">
          Une erreur est survenue lors du chargement des produits.
          <br />
          Veuillez réessayer plus tard.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="mb-[50px] sm:mb-20">
      <ProductListSec title="Nos derniers arrivages" data={newProducts ?? []} />
    </div>
  );
}
