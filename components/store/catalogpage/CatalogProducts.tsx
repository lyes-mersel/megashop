"use client";

import { ProductFromAPI } from "@/lib/types/product.types";
import ProductCard from "@/components/common/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CatalogHead from "@/components/store/catalogpage/CatalogHead";
import IsLoading from "@/components/store/cartpage/IsLoading";
import { FiSearch } from "react-icons/fi";
import { montserrat } from "@/styles/fonts";
import { Button } from "@/components/ui/button";

interface CatalogProductsProps {
  products: ProductFromAPI[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  isLoading: boolean;
  onSortChange: (value: string) => void;
  onPageChange: (page: number) => void;
  selectedGender: string | null;
  selectedCategory: string | null;
  priceRange: [number, number];
  selectedColor: string | null;
  selectedSize: string | null;
  onApplyFilters: (filters: {
    gender: string | null;
    category: string | null;
    priceRange: [number, number];
    color: string | null;
    size: string | null;
  }) => void;
  onResetFilters: () => void;
}

const CatalogProducts = ({
  products,
  pagination,
  onPageChange,
  onSortChange,
  isLoading,
  selectedGender,
  selectedCategory,
  priceRange,
  selectedColor,
  selectedSize,
  onApplyFilters,
  onResetFilters,
}: CatalogProductsProps) => {
  return (
    <div className="flex flex-col w-full pl-0 lg:pl-5">
      <CatalogHead
        totalItems={pagination.totalItems}
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        onSortChange={onSortChange}
        selectedGender={selectedGender}
        selectedCategory={selectedCategory}
        priceRange={priceRange}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        onApplyFilters={onApplyFilters}
        onResetFilters={onResetFilters}
      />
      <div className="flex flex-1 flex-col w-full space-y-5">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <IsLoading />
          </div>
        ) : (
          <>
            <div className="flex-1 w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))
              ) : (
                <div className="max-h-[600px] col-span-full text-center py-16 flex flex-col items-center justify-center gap-2">
                  <FiSearch className="text-5xl text-gray-400 mb-4" />
                  <h2
                    className={`text-2xl font-bold text-gray-800 ${montserrat.className}`}
                  >
                    Aucun produit trouvé
                  </h2>
                  <p className="text-base text-gray-600 mt-2 max-w-md">
                    Vos filtres ou votre recherche n&apos;ont retourné aucun
                    résultat. Essayez de modifier vos critères ou explorez tous
                    nos produits.
                  </p>
                  <Button
                    onClick={onResetFilters}
                    className="mt-6 bg-black text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-gray-800"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-grow"></div>
            <hr className="border-t-black/10" />
            <Pagination className="justify-between">
              <PaginationPrevious
                onClick={() => {
                  if (pagination.currentPage > 1) {
                    onPageChange(pagination.currentPage - 1);
                  }
                }}
                className={`border border-black/10 ${
                  pagination.currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              />
              <PaginationContent>
                {pagination.totalPages > 5 && pagination.currentPage > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => onPageChange(1)}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis className="text-black/50 font-medium text-sm" />
                    </PaginationItem>
                  </>
                )}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 2 &&
                        page <= pagination.currentPage + 2)
                  )
                  .map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        className={`text-black/50 font-medium text-sm cursor-pointer ${
                          pagination.currentPage === page
                            ? "text-black font-bold"
                            : ""
                        }`}
                        isActive={pagination.currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                {pagination.totalPages > 5 &&
                  pagination.currentPage < pagination.totalPages - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis className="text-black/50 font-medium text-sm" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => onPageChange(pagination.totalPages)}
                          className="cursor-pointer"
                        >
                          {pagination.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
              </PaginationContent>
              <PaginationNext
                onClick={() => {
                  if (pagination.currentPage < pagination.totalPages) {
                    onPageChange(pagination.currentPage + 1);
                  }
                }}
                className={`border border-black/10 ${
                  pagination.currentPage === pagination.totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              />
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogProducts;
