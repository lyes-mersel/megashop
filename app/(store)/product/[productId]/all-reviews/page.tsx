"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReviewCard from "@/components/common/ReviewCard";
import { fetchPaginatedDataFromAPI } from "@/lib/utils/fetchData";
import { ReviewFromAPI } from "@/lib/types/review.types";
import { satoshi } from "@/styles/fonts";
import { cn } from "@/lib/utils";

export default function AllReviewsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewFromAPI[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<"note" | "date">("note");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [productId, setProductId] = useState<string>("");
  const pageSize = 6; // Number of reviews per page

  useEffect(() => {
    const initializeProductId = async () => {
      const { productId } = await params;
      setProductId(productId);
    };
    initializeProductId();
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const reviewsResult = await fetchPaginatedDataFromAPI<ReviewFromAPI[]>(
          `/api/reviews?productId=${productId}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`
        );

        if (reviewsResult.error) {
          console.error(reviewsResult.error);
          router.push("/internal-error");
          return;
        }

        const reviewsData = reviewsResult.data!;
        setReviews(reviewsData.data);
        setTotalReviews(reviewsData.pagination.totalItems);
      } catch (error) {
        console.error("Unexpected error:", error);
        router.push("/internal-error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId, page, sortBy, sortOrder, router]);

  const handleSortChange = (value: string) => {
    setPage(1); // Reset to first page on sort change
    if (value === "best") {
      setSortBy("note");
      setSortOrder("desc");
    } else if (value === "latest") {
      setSortBy("date");
      setSortOrder("desc");
    } else if (value === "oldest") {
      setSortBy("date");
      setSortOrder("asc");
    }
  };

  const totalPages = Math.ceil(totalReviews / pageSize);

  return (
    <main className="min-h-[calc(100dvh-125px)] py-10 bg-white">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <div className="mb-6">
          <Link
            href={`/product/${productId}`}
            className="text-black hover:text-gray-700 text-sm font-medium flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour au produit
          </Link>
        </div>
        <div className="flex items-center justify-between flex-col sm:flex-row mb-5 sm:mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <h1
              className={cn(
                satoshi.className,
                "text-xl sm:text-2xl font-bold text-black mr-2"
              )}
            >
              Tous les Avis
            </h1>
            <span className="text-sm sm:text-base text-black/60">
              ({totalReviews})
            </span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Select defaultValue="best" onValueChange={handleSortChange}>
              <SelectTrigger className="min-w-[120px] font-medium text-xs sm:text-base px-4 py-3 sm:px-5 sm:py-4 text-black bg-[#F0F0F0] border-none rounded-full h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="best">Meilleurs avis</SelectItem>
                <SelectItem value="latest">Plus récent</SelectItem>
                <SelectItem value="oldest">Plus ancien</SelectItem>
              </SelectContent>
            </Select>
            <Link href={`/product/${productId}/write-review`}>
              <Button
                type="button"
                className="sm:min-w-[166px] px-4 py-3 sm:px-5 sm:py-4 rounded-full bg-black font-medium text-xs sm:text-base h-12"
              >
                Écrire un Avis
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : totalReviews === 0 ? (
          <div className="text-center py-10 px-4">
            <p
              className={cn(
                satoshi.className,
                "text-lg font-medium text-gray-600 mb-4"
              )}
            >
              Aucun avis disponible pour ce produit.
            </p>
            <p className="text-gray-500 mb-6">
              Soyez le premier à partager votre expérience avec ce produit !
            </p>
            <Link href={`/product/${productId}/write-review`}>
              <Button
                type="button"
                className="px-6 py-3 rounded-full bg-black font-medium text-base"
              >
                Écrire un avis
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 sm:mb-9">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} isAction isDate />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-black"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                <span
                  className={cn(satoshi.className, "text-sm text-black/60")}
                >
                  Page {page} sur {totalPages}
                </span>
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-black"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
