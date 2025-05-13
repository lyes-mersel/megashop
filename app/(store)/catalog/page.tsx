"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FiSliders, FiShoppingCart } from "react-icons/fi";

// UI Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Components
import ProductCard from "@/components/common/ProductCard";
import BreadcrumbShop from "@/components/store/catalogpage/BreadcrumbShop";
import MobileFilters from "@/components/store/catalogpage/filters/MobileFilters";
import Filters from "@/components/store/catalogpage/filters";

// Fonts & Types
import { montserrat } from "@/styles/fonts";
import { ProductFromAPI } from "@/lib/types/product.types";

// Données des publicités avec propriétés imageWidth et imageHeight
const ads = [
  {
    title: "Trouvez des accessoires uniques pour sublimer votre style !",
    description:
      "Quand la qualité rencontre la créativité, et que les prix restent doux… nos accessoires deviennent des indispensables.",
    image: "/images/pub-watch.png",
    bgColor: "bg-gradient-to-r from-amber-600 to-orange-800",
    textColor: "text-amber-100",
    imageWidth: "300px", // Largeur personnalisée
    imageHeight: "280px", // Hauteur personnalisée
  },
  {
    title: "Faites un pas vers le style",
    description:
      "Marchez avec élégance. Découvrez notre collection de chaussures tendances et confortables.",
    image: "/images/pub-basket.png",
    bgColor: "bg-gradient-to-r from-purple-700 to-violet-900",
    textColor: "text-white",
    imageWidth: "350px", // Largeur personnalisée
    imageHeight: "280px", // Hauteur personnalisée
  },
  {
    title: "Profitez de remises jusqu'à 50% sur nos collections !",
    description:
      "Mode, style et économies réunis en un clic ! Dépêchez-vous, stock limité.",
    image: "/images/pub-gift.png",
    bgColor: "bg-gradient-to-r from-emerald-600 to-teal-800",
    textColor: "text-white",
    imageWidth: "280px", // Largeur personnalisée
    imageHeight: "180px", // Hauteur personnalisée
  },
  {
    title: "Achetez des vêtements pour vous et vos enfants",
    description:
      "Vous trouverez des vêtements modernes, confortables et de qualité pour vous et vos enfants !",
    image: "/images/pub-girl.png",
    bgColor: "bg-gradient-to-r from-rose-700 to-pink-900",
    textColor: "text-white",
    imageWidth: "300px", // Largeur personnalisée
    imageHeight: "200px", // Hauteur personnalisée
  },
  {
    title: "Profitez de la diversité des marques ! 🌟",
    description:
      "Découvrez un large choix de marques tendance à prix imbattables ! Que vous cherchiez du chic, du casual ou du streetwear, trouvez votre style parfait en un clic.",
    image: "/images/pub-pulls.png",
    bgColor: "bg-gradient-to-r from-gray-700 to-gray-900",
    textColor: "text-white",
    imageWidth: "320px", // Largeur personnalisée
    imageHeight: "250px", // Hauteur personnalisée
  },
];

export default function CatalogPage() {
  const [allProducts, setAllProducts] = useState<ProductFromAPI[]>([]);
  const [currentAd, setCurrentAd] = useState(0);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 9,
  });

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?page=${pagination.currentPage}&pageSize=${pagination.pageSize}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }
        const jsonData = await response.json();
        setAllProducts(jsonData.data);
        setPagination(jsonData.pagination);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchProducts();
  }, [pagination.currentPage, pagination.pageSize]);

  // Gestion du carrousel publicitaire
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev === ads.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentAd(index);
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll en haut de la page
  };

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />

        {/* Page title: h1 */}
        <div className="mb-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1
                className={`text-2xl md:text-[32px] font-extrabold uppercase tracking-tight ${montserrat.className}`}
              >
                Nos produits
              </h1>
              <FiShoppingCart className="text-black text-2xl md:text-3xl" />
            </div>
            <MobileFilters />
          </div>

          {/* Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-sm md:text-base text-black/60">
              Affichage de{" "}
              {(pagination.currentPage - 1) * pagination.pageSize + 1} à{" "}
              {Math.min(
                pagination.currentPage * pagination.pageSize,
                pagination.totalItems
              )}{" "}
              sur {pagination.totalItems} produits
            </span>

            <div className="flex items-center">
              Trier par:{" "}
              <Select defaultValue="most-popular">
                <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="most-popular">
                    Le plus populaire
                  </SelectItem>
                  <SelectItem value="low-price">Prix bas</SelectItem>
                  <SelectItem value="high-price">Prix élevé</SelectItem>
                  <SelectItem value="newest">Plus récent</SelectItem>
                  <SelectItem value="oldest">Plus ancien</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Ads */}
        <div
          className={`${ads[currentAd].bgColor} rounded-2xl shadow-lg overflow-hidden mb-8 ${ads[currentAd].textColor}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between h-72 sm:h-56 md:h-64">
            <div className="w-full sm:w-1/2 p-6 flex flex-col justify-center">
              <h2
                className={`text-2xl md:text-3xl font-bold ${montserrat.className}`}
              >
                {ads[currentAd].title}
              </h2>
              <p
                className={`text-sm md:text-base mt-4 ${montserrat.className}`}
              >
                {ads[currentAd].description}
              </p>
            </div>
            <div className="w-full sm:w-1/2 flex items-center justify-center">
              <Image
                src={ads[currentAd].image}
                alt={ads[currentAd].title}
                className="object-cover object-center"
                width={
                  ads[currentAd].imageWidth
                    ? parseInt(ads[currentAd].imageWidth)
                    : undefined
                }
                height={
                  ads[currentAd].imageHeight
                    ? parseInt(ads[currentAd].imageHeight)
                    : undefined
                }
                style={{
                  width: ads[currentAd].imageWidth,
                  height: ads[currentAd].imageHeight,
                }}
              />
            </div>
          </div>
          <div className="flex justify-center gap-2 py-4 bg-black/20">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  currentAd === index ? "bg-white w-4" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex md:space-x-5 items-start">
          {/* Filters */}
          <div className="hidden md:block min-w-[295px] max-w-[295px] min-h-[1300px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filtres</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters />
          </div>

          {/* Products */}
          <div className="flex flex-col w-full md:min-h-[1300px] space-y-5">
            <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {allProducts.length > 0 ? (
                allProducts.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg font-semibold text-gray-800">
                    Aucun produit trouvé
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Essayez de modifier vos filtres ou votre recherche.
                  </p>
                </div>
              )}
            </div>
            <div className="flex-grow"></div>

            {/* Pagination */}
            <hr className="border-t-black/10" />
            <Pagination className="justify-between">
              <PaginationPrevious
                onClick={() => {
                  if (pagination.currentPage > 1) {
                    handlePageChange(pagination.currentPage - 1);
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
                        onClick={() => handlePageChange(1)}
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
                        onClick={() => handlePageChange(page)}
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
                          onClick={() =>
                            handlePageChange(pagination.totalPages)
                          }
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
                    handlePageChange(pagination.currentPage + 1);
                  }
                }}
                className={`border border-black/10 ${
                  pagination.currentPage === pagination.totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              />
            </Pagination>
          </div>
        </div>
      </div>
    </main>
  );
}
